import React from 'react';
import { CheckSquare, Square, Lock, Unlock, Users, Clock } from 'lucide-react';
import Loading from '@/components/ui/loading';
import { Zone } from '@/types/parking';

interface ZoneCardProps {
  zone: Zone;
  isSelected: boolean;
  onSelect: (zoneId: string) => void;
  onStatusToggle: (zone: Zone) => void;
  isLoading: boolean;
}

const ZoneCard: React.FC<ZoneCardProps> = React.memo(
  ({ zone, isSelected, onSelect, onStatusToggle, isLoading }) => {
    const occupancyRate =
      zone.totalSlots > 0 ? (zone.occupied / zone.totalSlots) * 100 : 0;

    const statusColors = zone.open
      ? {
          bg: 'bg-green-50',
          border: 'border-green-200',
          text: 'text-green-800',
          badge: 'bg-green-100',
          button: 'bg-red-600 hover:bg-red-700',
        }
      : {
          bg: 'bg-red-50',
          border: 'border-red-200',
          text: 'text-red-800',
          badge: 'bg-red-100',
          button: 'bg-green-600 hover:bg-green-700',
        };

    const handleCardClick = () => onSelect(zone.id);
    const handleButtonClick = (e: React.MouseEvent) => {
      e.stopPropagation();
      onStatusToggle(zone);
    };

    return (
      <div
        className={`relative p-4 rounded-xl border-2 transition-all duration-200 hover:shadow-md cursor-pointer ${
          statusColors.bg
        } ${statusColors.border} ${
          isSelected ? 'ring-2 ring-blue-500 ring-offset-2' : ''
        }`}
        onClick={handleCardClick}
        role='button'
        tabIndex={0}
        aria-label={`Zone ${zone.name}, ${zone.open ? 'open' : 'closed'}, ${
          zone.occupied
        } occupied, ${zone.free} free spaces`}
      >
        {/* Selection Checkbox */}
        <div className='absolute top-3 left-3'>
          <button
            onClick={(e) => {
              e.stopPropagation();
              onSelect(zone.id);
            }}
            className='text-gray-500 hover:text-gray-700 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 rounded'
            aria-label={isSelected ? 'Deselect zone' : 'Select zone'}
          >
            {isSelected ? (
              <CheckSquare className='h-5 w-5 text-blue-600' />
            ) : (
              <Square className='h-5 w-5' />
            )}
          </button>
        </div>

        {/* Zone Header */}
        <div className='flex justify-between items-start mb-3 ml-8'>
          <div>
            <h5 className='font-bold text-gray-900 text-lg'>{zone.name}</h5>
            <p className='text-sm text-gray-600'>Category: {zone.categoryId}</p>
          </div>
          <span
            className={`text-xs px-3 py-1 rounded-full font-medium ${statusColors.badge} ${statusColors.text}`}
            role='status'
            aria-label={`Zone status: ${zone.open ? 'open' : 'closed'}`}
          >
            {zone.open ? '🔓 OPEN' : '🔒 CLOSED'}
          </span>
        </div>

        {/* Occupancy Bar */}
        <div className='mb-4'>
          <div className='flex justify-between text-xs mb-1'>
            <span className='text-gray-600'>Occupancy</span>
            <span className='font-medium'>{occupancyRate.toFixed(1)}%</span>
          </div>
          <div
            className='w-full bg-gray-200 rounded-full h-2'
            role='progressbar'
            aria-valuenow={occupancyRate}
            aria-valuemin={0}
            aria-valuemax={100}
            aria-label={`Occupancy rate: ${occupancyRate.toFixed(1)}%`}
          >
            <div
              className='bg-gradient-to-r from-blue-500 to-blue-600 h-2 rounded-full transition-all duration-300'
              style={{ width: `${Math.min(occupancyRate, 100)}%` }}
            />
          </div>
        </div>

        {/* Statistics Grid */}
        <div className='grid grid-cols-3 gap-2 mb-4 text-xs'>
          <div className='text-center p-2 bg-white/50 rounded-lg'>
            <div className='font-semibold text-blue-600 text-lg'>
              {zone.occupied}
            </div>
            <div className='text-gray-600'>Occupied</div>
          </div>
          <div className='text-center p-2 bg-white/50 rounded-lg'>
            <div className='font-semibold text-green-600 text-lg'>
              {zone.free}
            </div>
            <div className='text-gray-600'>Available</div>
          </div>
          <div className='text-center p-2 bg-white/50 rounded-lg'>
            <div className='font-semibold text-purple-600 text-lg'>
              {zone.reserved}
            </div>
            <div className='text-gray-600'>Reserved</div>
          </div>
        </div>

        {/* Availability Info */}
        <div className='flex justify-between items-center text-xs mb-4'>
          <div className='flex items-center text-gray-600'>
            <Users className='h-3 w-3 mr-1' aria-hidden='true' />
            <span>Visitors: {zone.availableForVisitors}</span>
          </div>
          <div className='flex items-center text-gray-600'>
            <Clock className='h-3 w-3 mr-1' aria-hidden='true' />
            <span>Subscribers: {zone.availableForSubscribers}</span>
          </div>
        </div>

        {/* Action Button */}
        <button
          onClick={handleButtonClick}
          disabled={isLoading}
          className={`w-full px-4 py-2 rounded-lg font-medium transition-all duration-200 flex items-center justify-center focus:outline-none focus:ring-2 focus:ring-offset-2 ${
            statusColors.button
          } text-white ${
            isLoading
              ? 'opacity-50 cursor-not-allowed'
              : 'hover:shadow-lg transform hover:-translate-y-0.5 focus:ring-blue-500'
          }`}
          aria-label={`${zone.open ? 'Close' : 'Open'} ${zone.name} zone`}
        >
          {isLoading ? (
            <Loading size='sm' />
          ) : zone.open ? (
            <>
              <Lock className='h-4 w-4 mr-2' aria-hidden='true' />
              Close Zone
            </>
          ) : (
            <>
              <Unlock className='h-4 w-4 mr-2' aria-hidden='true' />
              Open Zone
            </>
          )}
        </button>
      </div>
    );
  }
);

ZoneCard.displayName = 'ZoneCard';

export default ZoneCard;
