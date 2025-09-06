import { Zone } from '@/types/parking';

interface ZoneCardProps {
  zone: Zone;
  isSelected: boolean;
  onSelect: () => void;
  userType: 'visitor' | 'subscriber';
  subscriptionCategory?: string;
  specialActive?: boolean; // indicates if special rate is currently active
}

const ZoneCard = ({
  zone,
  isSelected,
  onSelect,
  userType,
  subscriptionCategory,
  specialActive,
}: ZoneCardProps) => {
  const isAvailable =
    userType === 'visitor'
      ? zone.open && zone.availableForVisitors > 0
      : zone.open && zone.availableForSubscribers > 0;

  const isValidForSubscription =
    userType === 'subscriber'
      ? !subscriptionCategory || subscriptionCategory === zone.categoryId
      : true;

  const canSelect = isAvailable && isValidForSubscription;

  const getAvailabilityText = () => {
    if (!zone.open) return 'Closed';
    if (userType === 'visitor') {
      return zone.availableForVisitors > 0
        ? `${zone.availableForVisitors} available for visitors`
        : 'No visitor slots available';
    } else {
      return zone.availableForSubscribers > 0
        ? `${zone.availableForSubscribers} available for subscribers`
        : 'No subscriber slots available';
    }
  };

  const getStatusColor = () => {
    if (!zone.open) return 'bg-red-100 border-red-300';
    if (!canSelect) return 'bg-gray-100 border-gray-300';
    if (isSelected) return 'bg-blue-100 border-blue-500';
    return 'bg-white border-gray-200 hover:border-blue-300';
  };

  return (
    <div
      onClick={canSelect ? onSelect : undefined}
      className={`p-4 rounded-lg border-2 transition-all cursor-pointer ${getStatusColor()} ${
        canSelect ? 'hover:shadow-md' : 'opacity-60 cursor-not-allowed'
      }`}
    >
      <div className='flex justify-between items-start mb-3'>
        <div>
          <h3 className='font-bold text-lg text-gray-900'>{zone.name}</h3>
          <p className='text-sm text-gray-600'>Category: {zone.categoryId}</p>
        </div>
        {!zone.open && (
          <span className='bg-red-500 text-white text-xs px-2 py-1 rounded-full'>
            CLOSED
          </span>
        )}
      </div>

      {/* Occupancy Stats */}
      <div className='grid grid-cols-3 gap-2 mb-3 text-sm'>
        <div className='text-center'>
          <div className='font-semibold text-blue-600'>{zone.occupied}</div>
          <div className='text-gray-600'>Occupied</div>
        </div>
        <div className='text-center'>
          <div className='font-semibold text-green-600'>{zone.free}</div>
          <div className='text-gray-600'>Free</div>
        </div>
        <div className='text-center'>
          <div className='font-semibold text-yellow-600'>{zone.reserved}</div>
          <div className='text-gray-600'>Reserved</div>
        </div>
      </div>

      {/* Rates */}
      <div className='flex justify-between items-center mb-3 text-sm'>
        <div className={specialActive ? 'opacity-60' : ''}>
          <span className='text-gray-600'>Normal: </span>
          <span className='font-semibold'>${zone.rateNormal}/hr</span>
        </div>
        <div
          className={
            specialActive
              ? 'ring-2 ring-orange-400 bg-orange-100 px-2 py-1 rounded'
              : ''
          }
        >
          <span className='text-gray-600'>Special: </span>
          <span
            className={`font-semibold ${
              specialActive ? 'text-orange-700' : 'text-orange-600'
            }`}
          >
            ${zone.rateSpecial}/hr
          </span>
          {specialActive && (
            <span className='ml-1 text-xs text-orange-700 font-medium'>
              ACTIVE
            </span>
          )}
        </div>
      </div>

      {/* Availability Status */}
      <div
        className={`text-sm font-medium ${
          canSelect ? 'text-green-600' : 'text-red-600'
        }`}
      >
        {getAvailabilityText()}
      </div>

      {/* Subscription validation message */}
      {userType === 'subscriber' &&
        subscriptionCategory &&
        subscriptionCategory !== zone.categoryId && (
          <div className='text-xs text-red-600 mt-2'>
            Your subscription ({subscriptionCategory}) is not valid for this
            zone
          </div>
        )}

      {/* Selection indicator */}
      {isSelected && (
        <div className='flex items-center justify-center mt-3 text-blue-600'>
          <div className='w-4 h-4 rounded-full bg-blue-600 flex items-center justify-center'>
            <div className='w-2 h-2 rounded-full bg-white'></div>
          </div>
          <span className='ml-2 text-sm font-medium'>Selected</span>
        </div>
      )}
    </div>
  );
};

export default ZoneCard;
