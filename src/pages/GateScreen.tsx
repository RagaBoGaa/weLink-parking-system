import { useEffect, useState } from 'react';
import { useParams } from 'react-router';
import { toast } from 'react-hot-toast';

import {
  useGetZonesByGateQuery,
  useGetGatesQuery,
  useCheckinTicketMutation,
  useGetSubscriptionQuery,
} from '@/api/cruds';
import { useWebSocket } from '@/services/websocket';
import {
  Zone,
  WSMessage,
  CheckinRequest,
  CheckinResponse,
} from '@/types/parking';
import LoadingIndicator from '@/components/LoadingIndicator';
import ErrorComponent from '@/components/shared/ErrorComponent';
import TicketModal from '@/components/ticket/TicketModal';
import { TabNavigation, TabType } from '@/components/gate/TabNavigation';
import { SubscriptionVerification } from '@/components/gate/SubscriptionVerification';
import { ZoneSelection } from '@/components/gate/ZoneSelection';
import { CheckInAction } from '@/components/gate/CheckInAction';
import { useDebounce } from '@/hooks/useDebounce';

const GateScreen = () => {
  const { gateId } = useParams<{ gateId: string }>();
  const [activeTab, setActiveTab] = useState<TabType>('visitor');
  const [selectedZone, setSelectedZone] = useState<Zone | null>(null);
  const [subscriptionId, setSubscriptionId] = useState('');
  const [isTicketModalOpen, setIsTicketModalOpen] = useState(false);
  const [ticketData, setTicketData] = useState<CheckinResponse | null>(null);
  const [zones, setZones] = useState<Zone[]>([]);
  const [connectionStatus, setConnectionStatus] = useState('disconnected');
  const [currentTime, setCurrentTime] = useState(new Date());

  const debouncedSubscriptionId = useDebounce(subscriptionId, 500);

  const websocket = useWebSocket();
  const { data: gatesData } = useGetGatesQuery(null);
  const {
    data: zonesData,
    isLoading: zonesLoading,
    error: zonesError,
    refetch: refetchZones,
  } = useGetZonesByGateQuery({ gateId: gateId! }, { skip: !gateId });

  const { data: subscriptionData, error: subscriptionError } =
    useGetSubscriptionQuery(
      { id: debouncedSubscriptionId },
      { skip: !debouncedSubscriptionId || debouncedSubscriptionId.length < 3 }
    );

  const [checkinTicket, { isLoading: checkinLoading }] =
    useCheckinTicketMutation();

  // Update current time every second
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  // WebSocket connection and zone updates
  useEffect(() => {
    if (!gateId) return;

    let cleanup: (() => void) | undefined;

    const connectAndSubscribe = async () => {
      try {
        setConnectionStatus('connecting');

        // Only connect if not already connected
        if (!websocket.isConnected()) {
          await websocket.connect();
        }

        setConnectionStatus('connected');
        websocket.subscribeToGate(gateId);

        // Subscribe to zone updates
        const unsubscribeZone = websocket.onMessage(
          'zone-update',
          (message: WSMessage) => {
            if (message.type === 'zone-update') {
              setZones((prevZones) =>
                prevZones.map((zone) =>
                  zone.id === message.payload.id
                    ? { ...zone, ...message.payload }
                    : zone
                )
              );
            }
          }
        );

        // Subscribe to admin updates
        const unsubscribeAdmin = websocket.onMessage(
          'admin-update',
          (message: WSMessage) => {
            if (message.type === 'admin-update') {
              // Refresh zones when admin makes changes
              if (refetchZones) {
                refetchZones();
              }
              toast.success(`Admin update: ${message.payload.action}`);
            }
          }
        );

        cleanup = () => {
          unsubscribeZone();
          unsubscribeAdmin();
        };
      } catch (error) {
        console.error('Failed to connect WebSocket:', error);
        setConnectionStatus('disconnected');
        toast.error('Connection failed. Some features may not work.');
      }
    };

    connectAndSubscribe();

    return () => {
      if (cleanup) {
        cleanup();
      }
      if (gateId) {
        websocket.unsubscribeFromGate(gateId);
      }
    };
  }, [gateId]); // Removed websocket and refetchZones from dependencies

  // Monitor connection status
  useEffect(() => {
    const interval = setInterval(() => {
      setConnectionStatus(websocket.getConnectionStatus());
    }, 5000); // Check every 5 seconds instead of every second

    return () => clearInterval(interval);
  }, []); // Removed websocket from dependencies

  // Update zones when data is fetched
  useEffect(() => {
    if (zonesData) {
      setZones(zonesData);
    }
  }, [zonesData]);

  // Clear selected zone when subscription changes to one without access
  useEffect(() => {
    if (selectedZone && activeTab === 'subscriber') {
      // If there's a subscription error, clear the zone
      if (subscriptionError) {
        setSelectedZone(null);
        return;
      }

      // If subscription data exists but category doesn't match, clear the zone
      if (
        subscriptionData &&
        subscriptionData.category !== selectedZone.categoryId
      ) {
        setSelectedZone(null);
        return;
      }

      // If subscription ID is cleared/empty, clear the zone
      if (!debouncedSubscriptionId) {
        setSelectedZone(null);
        return;
      }
    }
  }, [
    subscriptionData,
    subscriptionError,
    selectedZone,
    activeTab,
    debouncedSubscriptionId,
  ]);

  const currentGate = gatesData?.find((gate) => gate.id === gateId);

  const handleZoneSelect = (zone: Zone) => {
    if (activeTab === 'visitor') {
      if (!zone.open || zone.availableForVisitors <= 0) {
        toast.error('Zone is not available for visitors');
        return;
      }
    } else {
      if (!zone.open || zone.availableForSubscribers <= 0) {
        toast.error('Zone is not available for subscribers');
        return;
      }

      if (!debouncedSubscriptionId) {
        toast.error('Please enter subscription ID first');
        return;
      }

      if (subscriptionError) {
        toast.error('Invalid subscription ID');
        return;
      }

      if (subscriptionData && subscriptionData.category !== zone.categoryId) {
        toast.error('Subscription not valid for this zone category');
        return;
      }
    }

    setSelectedZone(zone);
  };

  const handleTabChange = (tab: TabType) => {
    setActiveTab(tab);
    setSelectedZone(null);
    setSubscriptionId('');
  };

  const handleCheckin = async () => {
    if (!selectedZone || !gateId) return;

    try {
      const request: CheckinRequest = {
        gateId,
        zoneId: selectedZone.id,
        type: activeTab,
        subscriptionId:
          activeTab === 'subscriber' ? debouncedSubscriptionId : undefined,
      };

      const response = await checkinTicket(request).unwrap();

      setTicketData(response);
      setIsTicketModalOpen(true);
      setSelectedZone(null);

      // Refresh zones data to get updated occupancy
      refetchZones();

      toast.success('Check-in successful!');
    } catch (error: any) {
      console.error('Check-in failed:', error);
      toast.error(error?.data?.message || 'Check-in failed');
    }
  };

  if (zonesLoading)
    return <LoadingIndicator text='Loading gate information...' />;

  if (zonesError) {
    return (
      <ErrorComponent
        error='Failed to load gate information'
        onRetry={() => refetchZones()}
      />
    );
  }

  if (!currentGate) {
    return <ErrorComponent error='Gate not found' />;
  }

  return (
    <div className='min-h-screen bg-gradient-to-br from-background via-background to-secondary/5'>
      <div className='container mx-auto px-4 py-6 sm:py-8'>
        <TabNavigation activeTab={activeTab} onTabChange={handleTabChange} />

        {activeTab === 'subscriber' && (
          <SubscriptionVerification
            subscriptionId={subscriptionId}
            onSubscriptionIdChange={setSubscriptionId}
            subscriptionData={subscriptionData}
            subscriptionError={!!subscriptionError}
          />
        )}

        <ZoneSelection
          gate={currentGate}
          zones={zones}
          selectedZone={selectedZone}
          onZoneSelect={handleZoneSelect}
          activeTab={activeTab}
          subscriptionCategory={
            subscriptionData?.category && !subscriptionError
              ? subscriptionData.category
              : undefined
          }
          connectionStatus={connectionStatus}
          currentTime={currentTime}
          onReconnect={() => websocket.reset()}
        />

        <CheckInAction
          selectedZone={selectedZone}
          activeTab={activeTab}
          isLoading={checkinLoading}
          onCheckin={handleCheckin}
        />
      </div>

      {/* Ticket Modal */}
      {ticketData && (
        <TicketModal
          ticket={ticketData}
          gate={currentGate}
          zone={selectedZone}
          open={isTicketModalOpen}
          onClose={() => {
            setIsTicketModalOpen(false);
            setTicketData(null);
          }}
        />
      )}
    </div>
  );
};

export default GateScreen;
