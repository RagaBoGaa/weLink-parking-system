import { Gate, Zone } from '@/types/parking';
import ZoneCard from '@/components/ZoneCard';
import { TabType } from './TabNavigation';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Wifi, WifiOff, RefreshCw, Clock } from 'lucide-react';

interface ZoneSelectionProps {
  zones: Zone[];
  selectedZone: Zone | null;
  onZoneSelect: (zone: Zone) => void;
  activeTab: TabType;
  subscriptionCategory?: string;
  gate: Gate;
  connectionStatus: string;
  currentTime: Date;
  onReconnect: () => void;
}

export const ZoneSelection = ({
  zones,
  selectedZone,
  onZoneSelect,
  activeTab,
  subscriptionCategory,
  gate,
  connectionStatus,
  currentTime,
  onReconnect,
}: ZoneSelectionProps) => {
  return (
    <div>
      {/* Connection Status and Time Header */}
      <div className='mb-6 bg-card border rounded-lg p-4 shadow-soft'>
        <div className='flex flex-col sm:flex-row justify-between items-start sm:items-center space-y-3 sm:space-y-0'>
          <h1 className='text-xl sm:text-2xl font-bold'>{gate.name}</h1>

          <div className='flex flex-col sm:flex-row items-start sm:items-center space-y-3 sm:space-y-0 sm:space-x-6'>
            {/* Connection Status */}
            <div className='flex items-center space-x-2'>
              <div className='flex items-center space-x-2'>
                {connectionStatus === 'connected' ? (
                  <>
                    <Wifi className='h-4 w-4 text-success' />
                    <Badge variant='success' size='sm'>
                      Connected
                    </Badge>
                  </>
                ) : (
                  <>
                    <WifiOff className='h-4 w-4 text-destructive' />
                    <Badge variant='destructive' size='sm'>
                      Disconnected
                    </Badge>
                    <Button
                      variant='ghost'
                      size='sm'
                      onClick={onReconnect}
                      className='h-7 px-2'
                    >
                      <RefreshCw className='h-3 w-3' />
                    </Button>
                  </>
                )}
              </div>
            </div>

            {/* Current Time */}
            <div className='flex items-center space-x-2 text-sm text-muted-foreground'>
              <Clock className='h-4 w-4' />
              <span className='font-mono'>
                {currentTime.toLocaleTimeString()}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Zone Selection Header */}
      <div className='mb-6'>
        <h2 className='text-xl sm:text-2xl font-bold mb-2'>
          Available Parking Zones for {gate.name}
        </h2>
        <p className='text-muted-foreground'>
          Select a zone below to{' '}
          {activeTab === 'visitor'
            ? 'check in as a visitor'
            : 'access your reserved parking'}
        </p>
      </div>

      {/* Zone Cards */}
      <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 mb-8'>
        {zones.map((zone, index) => (
          <div
            key={zone.id}
            className={`animate-fade-in-up delay-${index * 100}`}
          >
            <ZoneCard
              zone={zone}
              isSelected={selectedZone?.id === zone.id}
              onSelect={() => onZoneSelect(zone)}
              userType={activeTab}
              subscriptionCategory={subscriptionCategory}
              specialActive={(zone as any).specialActive}
            />
          </div>
        ))}
      </div>
    </div>
  );
};
