import React from 'react';
import { Search } from 'lucide-react';
import ZoneCard from './ZoneCard';
import { Zone } from '@/types/parking';

interface ZoneGridProps {
  zones: Zone[];
  selectedZones: Set<string>;
  onZoneSelect: (zoneId: string) => void;
  onStatusToggle: (zone: Zone) => void;
  isLoading: boolean;
}

const ZoneGrid: React.FC<ZoneGridProps> = React.memo(
  ({ zones, selectedZones, onZoneSelect, onStatusToggle, isLoading }) => {
    if (zones.length === 0) {
      return (
        <div className='text-center py-12'>
          <div className='mx-auto w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mb-4'>
            <Search className='h-8 w-8 text-gray-400' aria-hidden='true' />
          </div>
          <h3 className='text-lg font-medium text-gray-900 mb-2'>
            No zones found
          </h3>
          <p className='text-gray-600 mb-4'>No zones found for this gate</p>
        </div>
      );
    }

    return (
      <div
        className='grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6'
        role='grid'
        aria-label='Parking zones'
      >
        {zones.map((zone) => (
          <ZoneCard
            key={zone.id}
            zone={zone}
            isSelected={selectedZones.has(zone.id)}
            onSelect={onZoneSelect}
            onStatusToggle={onStatusToggle}
            isLoading={isLoading}
          />
        ))}
      </div>
    );
  }
);

ZoneGrid.displayName = 'ZoneGrid';

export default ZoneGrid;
