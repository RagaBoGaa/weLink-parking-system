import React from 'react';
import { BarChart3 } from 'lucide-react';
import { Gate } from '@/types/parking';
import { ZoneStats } from '@/hooks/useZoneManagement';

interface ZoneStatisticsProps {
  stats: ZoneStats;
  selectedGate: Gate | undefined;
}

const ZoneStatistics: React.FC<ZoneStatisticsProps> = React.memo(
  ({ stats, selectedGate }) => {
    const occupancyRate =
      stats.totalCapacity > 0
        ? (stats.totalOccupied / stats.totalCapacity) * 100
        : 0;

    return (
      <div className='bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl p-4 sm:p-6 border border-blue-200'>
        <div className='flex flex-col sm:flex-row sm:items-center justify-between mb-4 gap-3'>
          <h4 className='text-lg font-semibold text-gray-900 flex items-center'>
            <BarChart3
              className='h-5 w-5 mr-2 text-blue-600'
              aria-hidden='true'
            />
            <span className='truncate'>
              {selectedGate
                ? `${selectedGate.name} Statistics`
                : 'Zone Statistics'}
            </span>
          </h4>
          <div
            className='flex items-center px-3 py-1 bg-blue-100 rounded-full self-start sm:self-center'
            role='status'
            aria-label={`Occupancy rate: ${occupancyRate.toFixed(1)} percent`}
          >
            <span className='text-sm font-medium text-blue-800'>
              {occupancyRate.toFixed(1)}% Occupied
            </span>
          </div>
        </div>

        <div className='grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3 sm:gap-4'>
          <div className='text-center'>
            <div
              className='text-xl sm:text-2xl font-bold text-gray-900'
              aria-label={`${stats.total} total zones`}
            >
              {stats.total}
            </div>
            <div className='text-xs sm:text-sm text-gray-600'>Total Zones</div>
          </div>
          <div className='text-center'>
            <div
              className='text-xl sm:text-2xl font-bold text-green-600'
              aria-label={`${stats.open} open zones`}
            >
              {stats.open}
            </div>
            <div className='text-xs sm:text-sm text-gray-600'>Open</div>
          </div>
          <div className='text-center sm:col-span-1 col-span-2 sm:col-start-auto'>
            <div
              className='text-xl sm:text-2xl font-bold text-red-600'
              aria-label={`${stats.closed} closed zones`}
            >
              {stats.closed}
            </div>
            <div className='text-xs sm:text-sm text-gray-600'>Closed</div>
          </div>
          <div className='text-center'>
            <div
              className='text-xl sm:text-2xl font-bold text-blue-600'
              aria-label={`${stats.totalOccupied} occupied spaces`}
            >
              {stats.totalOccupied}
            </div>
            <div className='text-xs sm:text-sm text-gray-600'>Occupied</div>
          </div>
          <div className='text-center'>
            <div
              className='text-xl sm:text-2xl font-bold text-purple-600'
              aria-label={`${stats.totalCapacity} total capacity`}
            >
              {stats.totalCapacity}
            </div>
            <div className='text-xs sm:text-sm text-gray-600'>
              Total Capacity
            </div>
          </div>
        </div>
      </div>
    );
  }
);

ZoneStatistics.displayName = 'ZoneStatistics';

export default ZoneStatistics;
