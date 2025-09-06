import {
  CheckoutResponse,
  CheckoutBreakdown,
  Subscription,
  Ticket,
} from '@/types/parking';
import { formatDateTime, formatDuration } from '@/utils/formatters';

interface CheckoutResultsProps {
  checkoutResult: CheckoutResponse;
  ticketInfo: Ticket | undefined;
  currentSubscription: Subscription | null;
  onNewTicket: () => void;
}

const CheckoutResults: React.FC<CheckoutResultsProps> = ({
  checkoutResult,
  ticketInfo,
  currentSubscription,
  onNewTicket,
}) => {
  const renderBreakdown = (breakdown: CheckoutBreakdown[]) => {
    return (
      <div className='space-y-2'>
        <h4 className='font-medium text-gray-900'>Rate Breakdown:</h4>
        {breakdown.map((segment, index) => (
          <div
            key={index}
            className='flex justify-between items-center p-3 bg-gray-50 rounded border text-sm'
          >
            <div className='flex-1'>
              <div className='font-medium'>
                {formatDateTime(segment.from)} - {formatDateTime(segment.to)}
              </div>
              <div className='text-gray-600'>
                {formatDuration(segment.hours)} at ${segment.rate}/hr (
                {segment.rateMode} rate)
              </div>
            </div>
            <div className='font-bold text-gray-900'>
              ${segment.amount.toFixed(2)}
            </div>
          </div>
        ))}
      </div>
    );
  };

  return (
    <div className='space-y-6'>
      {/* Summary Card */}
      <div className='bg-white rounded-lg shadow-sm border p-6'>
        <div className='flex justify-between items-start mb-4'>
          <h2 className='text-xl font-bold text-gray-900'>Checkout Summary</h2>
          <div className='text-right'>
            <div className='text-2xl font-bold text-green-600'>
              ${checkoutResult.amount.toFixed(2)}
            </div>
            <div className='text-sm text-gray-600'>
              Duration: {formatDuration(checkoutResult.durationHours)}
            </div>
          </div>
        </div>

        <div className='grid grid-cols-2 gap-4 mb-4 text-sm'>
          <div>
            <span className='text-gray-600'>Ticket ID:</span>
            <div className='font-bold'>{checkoutResult.ticketId}</div>
          </div>
          <div>
            <span className='text-gray-600'>Check-in:</span>
            <div className='font-medium'>
              {formatDateTime(checkoutResult.checkinAt)}
            </div>
          </div>
          <div>
            <span className='text-gray-600'>Check-out:</span>
            <div className='font-medium'>
              {formatDateTime(checkoutResult.checkoutAt)}
            </div>
          </div>
          <div>
            <span className='text-gray-600'>Zone:</span>
            <div className='font-medium'>{checkoutResult.zoneState.name}</div>
          </div>
        </div>

        {renderBreakdown(checkoutResult.breakdown)}
      </div>

      {/* Checkout Type Indicator */}
      {ticketInfo?.type === 'subscriber' && checkoutResult && (
        <div className='bg-blue-50 rounded-lg shadow-sm border border-blue-200 p-4'>
          <div className='flex items-center justify-between'>
            <div>
              <h3 className='font-medium text-blue-900'>
                ✅ Subscriber Checkout Completed
              </h3>
              <p className='text-sm text-blue-700'>
                {currentSubscription
                  ? `Processed for: ${currentSubscription.userName}`
                  : 'Processed as subscriber'}
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Action Buttons */}
      <div className='bg-white rounded-lg shadow-sm border p-6'>
        <div className='flex space-x-4'>
          <button
            onClick={onNewTicket}
            className='flex-1 bg-gray-200 hover:bg-gray-300 text-gray-800 font-medium py-3 px-4 rounded-lg transition-colors'
          >
            Process Another Ticket
          </button>
          <button
            onClick={() => window.print()}
            className='flex-1 bg-blue-600 hover:bg-blue-700 text-white font-medium py-3 px-4 rounded-lg transition-colors'
          >
            Print Receipt
          </button>
        </div>
      </div>
    </div>
  );
};

export default CheckoutResults;
