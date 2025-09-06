import LoadingIndicator from '@/components/LoadingIndicator';
import { Ticket } from '@/types/parking';

interface TicketInfoDisplayProps {
  ticketInfo: Ticket;
  onCheckout: (forceConvertToVisitor?: boolean) => void;
  checkoutLoading: boolean;
  onSearchAnother: () => void;
}

const TicketInfoDisplay: React.FC<TicketInfoDisplayProps> = ({
  ticketInfo,
  onCheckout,
  checkoutLoading,
  onSearchAnother,
}) => {
  return (
    <div className='space-y-4'>
      {/* Search Another Ticket Button */}
      <button
        onClick={onSearchAnother}
        className='w-full bg-gray-100 hover:bg-gray-200 text-gray-700 font-medium py-2 px-4 rounded-lg transition-colors border border-gray-300'
      >
        🔍 Search Another Ticket
      </button>

      {/* Ticket Info Display */}
      <div className='p-4 bg-gray-50 rounded-lg border'>
        <h3 className='font-medium text-gray-900 mb-2'>Ticket Found:</h3>
        <div className='grid grid-cols-2 gap-4 text-sm'>
          <div>
            <span className='text-gray-600'>Type:</span>
            <div className='font-medium capitalize'>{ticketInfo.type}</div>
          </div>
          <div>
            <span className='text-gray-600'>Check-in:</span>
            <div className='font-medium'>
              {new Date(ticketInfo.checkinAt).toLocaleString()}
            </div>
          </div>
          <div>
            <span className='text-gray-600'>Zone:</span>
            <div className='font-medium'>{ticketInfo.zoneId}</div>
          </div>
          {ticketInfo.type === 'subscriber' && (
            <div>
              <span className='text-gray-600'>Type:</span>
              <div className='font-medium text-blue-600'>Subscriber Ticket</div>
            </div>
          )}
        </div>
      </div>

      {/* Proceed to checkout */}
      {ticketInfo.type === 'visitor' ? (
        <button
          onClick={() => onCheckout()}
          disabled={checkoutLoading}
          className='w-full bg-green-600 hover:bg-green-700 disabled:bg-gray-400 text-white font-medium py-3 px-4 rounded-lg transition-colors text-lg'
        >
          {checkoutLoading ? (
            <LoadingIndicator />
          ) : (
            '💰 Process Visitor Checkout'
          )}
        </button>
      ) : (
        <div className='w-full bg-blue-50 border border-blue-200 rounded-lg p-4 text-center'>
          <p className='text-blue-700 font-medium'>
            🔍 Subscriber ticket detected - plate verification required
          </p>
          <p className='text-sm text-blue-600 mt-1'>
            Loading subscription details for plate verification...
          </p>
        </div>
      )}
    </div>
  );
};

export default TicketInfoDisplay;
