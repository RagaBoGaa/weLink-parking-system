import { useState, useEffect, useMemo, useCallback } from 'react';
import { toast } from 'react-hot-toast';
import {
  useGetGatesQuery,
  useGetZonesByGateQuery,
  useUpdateZoneStatusMutation,
} from '@/api/cruds';
import { useWebSocket } from '@/services/websocket';
import { Zone, WSMessage } from '@/types/parking';

export interface ZoneStats {
  total: number;
  open: number;
  closed: number;
  totalOccupied: number;
  totalFree: number;
  totalCapacity: number;
}

export interface ZoneManagementState {
  selectedGate: string;
  zones: Zone[];
  selectedZones: Set<string>;
}

export interface ZoneManagementActions {
  setSelectedGate: (gateId: string) => void;
  handleZoneSelect: (zoneId: string) => void;
  handleSelectAll: () => void;
  handleStatusToggle: (zoneId: string, newStatus: boolean) => Promise<void>;
  handleBulkOperation: (action: 'open' | 'close') => Promise<void>;
  clearSelection: () => void;
}

export interface UseZoneManagementReturn {
  // State
  state: ZoneManagementState;

  // Actions
  actions: ZoneManagementActions;

  // Computed values
  zones: Zone[];
  zoneStats: ZoneStats;
  selectedGateData: any;

  // API states
  gatesData: any;
  gatesLoading: boolean;
  gatesError: any;
  zonesLoading: boolean;
  zonesError: any;
  updateLoading: boolean;

  // Utilities
  refetchZones: () => void;
}

export const useZoneManagement = (): UseZoneManagementReturn => {
  // State
  const [selectedGate, setSelectedGate] = useState<string>('');
  const [zones, setZones] = useState<Zone[]>([]);
  const [selectedZones, setSelectedZones] = useState<Set<string>>(new Set());

  // API Hooks
  const {
    data: gatesData,
    isLoading: gatesLoading,
    error: gatesError,
  } = useGetGatesQuery(null);

  const {
    data: zonesData,
    isLoading: zonesLoading,
    error: zonesError,
    refetch: refetchZones,
  } = useGetZonesByGateQuery({ gateId: selectedGate }, { skip: !selectedGate });

  const [updateZoneStatus, { isLoading: updateLoading }] =
    useUpdateZoneStatusMutation();
  const websocket = useWebSocket();

  // Memoized computed values
  const selectedGateData = useMemo(
    () => gatesData?.find((gate: any) => gate.id === selectedGate),
    [gatesData, selectedGate]
  );

  const zoneStats = useMemo((): ZoneStats => {
    return zones.reduce(
      (stats, zone) => ({
        total: stats.total + 1,
        open: stats.open + (zone.open ? 1 : 0),
        closed: stats.closed + (zone.open ? 0 : 1),
        totalOccupied: stats.totalOccupied + zone.occupied,
        totalFree: stats.totalFree + zone.free,
        totalCapacity: stats.totalCapacity + zone.totalSlots,
      }),
      {
        total: 0,
        open: 0,
        closed: 0,
        totalOccupied: 0,
        totalFree: 0,
        totalCapacity: 0,
      }
    );
  }, [zones]);

  // Actions
  const handleZoneSelect = useCallback((zoneId: string) => {
    setSelectedZones((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(zoneId)) {
        newSet.delete(zoneId);
      } else {
        newSet.add(zoneId);
      }
      return newSet;
    });
  }, []);

  const handleSelectAll = useCallback(() => {
    if (selectedZones.size === zones.length) {
      setSelectedZones(new Set());
    } else {
      setSelectedZones(new Set(zones.map((zone) => zone.id)));
    }
  }, [selectedZones.size, zones]);

  const handleStatusToggle = useCallback(
    async (zoneId: string, newStatus: boolean) => {
      try {
        await updateZoneStatus({
          id: zoneId,
          open: newStatus,
        }).unwrap();

        toast.success(`Zone ${newStatus ? 'opened' : 'closed'} successfully`);

        if (selectedGate) {
          refetchZones();
        }
      } catch (error: any) {
        console.error('Zone status update failed:', error);
        toast.error(error?.data?.message || 'Failed to update zone status');
        throw error;
      }
    },
    [updateZoneStatus, selectedGate, refetchZones]
  );

  const handleBulkOperation = useCallback(
    async (action: 'open' | 'close') => {
      if (selectedZones.size === 0) {
        toast.error('Please select zones to perform bulk operation');
        return;
      }

      const results = [];

      try {
        // Process in batches to avoid overwhelming the server
        const BATCH_SIZE = 5;
        const zoneIds = Array.from(selectedZones);

        for (let i = 0; i < zoneIds.length; i += BATCH_SIZE) {
          const batch = zoneIds.slice(i, i + BATCH_SIZE);
          const batchPromises = batch.map((zoneId) =>
            updateZoneStatus({ id: zoneId, open: action === 'open' })
              .unwrap()
              .then(() => ({ success: true, zoneId }))
              .catch((error) => ({ success: false, zoneId, error }))
          );

          const batchResults = await Promise.all(batchPromises);
          results.push(...batchResults);
        }

        const successful = results.filter((r) => r.success).length;
        const failed = results.filter((r) => !r.success).length;

        if (successful > 0) {
          toast.success(
            `${successful} zone(s) ${
              action === 'open' ? 'opened' : 'closed'
            } successfully`
          );
        }

        if (failed > 0) {
          toast.error(`${failed} zone(s) failed to update`);
        }

        setSelectedZones(new Set());

        if (selectedGate) {
          refetchZones();
        }
      } catch (error: any) {
        console.error('Bulk operation failed:', error);
        toast.error('Bulk operation encountered errors');
      }
    },
    [selectedZones, zones, updateZoneStatus, selectedGate, refetchZones]
  );

  const clearSelection = useCallback(() => {
    setSelectedZones(new Set());
  }, []);

  const handleGateChange = useCallback((gateId: string) => {
    setSelectedGate(gateId);
    setSelectedZones(new Set()); // Clear selection when gate changes
  }, []);

  // Effects
  useEffect(() => {
    if (zonesData) {
      setZones(zonesData);
    }
  }, [zonesData]);

  // WebSocket effect with improved error handling
  useEffect(() => {
    if (!selectedGate) return;

    let cleanup: (() => void) | undefined;
    let reconnectAttempts = 0;
    const MAX_RECONNECT_ATTEMPTS = 3;

    const subscribeToUpdates = async () => {
      try {
        if (!websocket.isConnected()) {
          await websocket.connect();
        }

        websocket.subscribeToGate(selectedGate);

        const unsubscribe = websocket.onMessage(
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

        cleanup = unsubscribe;
        reconnectAttempts = 0; // Reset on successful connection
      } catch (error) {
        console.error('Failed to subscribe to zone updates:', error);

        // Attempt to reconnect with exponential backoff
        if (reconnectAttempts < MAX_RECONNECT_ATTEMPTS) {
          const delay = Math.pow(2, reconnectAttempts) * 1000; // 1s, 2s, 4s
          setTimeout(() => {
            reconnectAttempts++;
            subscribeToUpdates();
          }, delay);
        } else {
          toast.error(
            'Failed to connect to real-time updates. Please refresh the page.'
          );
        }
      }
    };

    subscribeToUpdates();

    return () => {
      if (cleanup) {
        cleanup();
      }
    };
  }, [selectedGate, websocket]);

  // Create state and actions objects
  const state: ZoneManagementState = {
    selectedGate,
    zones,
    selectedZones,
  };

  const actions: ZoneManagementActions = {
    setSelectedGate: handleGateChange,
    handleZoneSelect,
    handleSelectAll,
    handleStatusToggle,
    handleBulkOperation,
    clearSelection,
  };

  return {
    state,
    actions,
    zones,
    zoneStats,
    selectedGateData,
    gatesData,
    gatesLoading,
    gatesError,
    zonesLoading,
    zonesError,
    updateLoading,
    refetchZones,
  };
};
