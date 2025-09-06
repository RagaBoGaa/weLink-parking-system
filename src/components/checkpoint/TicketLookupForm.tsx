import { useState, useEffect } from 'react';
import { toast } from 'react-hot-toast';
import LoadingIndicator from '@/components/LoadingIndicator';

interface TicketLookupFormProps {
  triggerGetTicket: any;
  triggerGetSubscriptions: any;
  resetKey?: number; // Used to reset the form when searching another ticket
}

const TicketLookupForm: React.FC<TicketLookupFormProps> = ({
  triggerGetTicket,
  triggerGetSubscriptions,
  resetKey,
}) => {
  const [ticketId, setTicketId] = useState('');
  const [showLoading, setShowLoading] = useState(false);

  // Reset form when resetKey changes (when searching another ticket)
  useEffect(() => {
    if (resetKey) {
      setTicketId('');
      setShowLoading(false);
    }
  }, [resetKey]);

  const handleLookupTicket = async () => {
    if (!ticketId.trim()) {
      toast.error('Please enter a ticket ID');
      return;
    }

    // Show loading with minimum delay to prevent flicker
    setShowLoading(true);
    const minLoadingTime = new Promise((resolve) => setTimeout(resolve, 300));

    try {
      const [result] = await Promise.all([
        triggerGetTicket({ id: ticketId.trim() }),
        minLoadingTime,
      ]);

      setShowLoading(false);

      if (
        result.error &&
        'data' in result.error &&
        'message' in (result.error.data as { message: string })
      ) {
        toast.error((result.error.data as { message: string }).message);
        return;
      }

      if (result.data) {
        toast.success(`Ticket found: ${result.data.type} ticket`);

        // If it's a subscriber ticket, fetch subscriptions for plate verification
        if (result.data.type === 'subscriber') {
          try {
            const subsResult = await triggerGetSubscriptions(null);
            if (subsResult.error) {
              toast.error('Failed to load subscription data');
            }
          } catch (error) {
            console.error('Failed to fetch subscriptions:', error);
            toast.error('Failed to load subscription data');
          }
        }
      }
    } catch (error) {
      console.error('Ticket lookup failed:', error);
      toast.error('Failed to lookup ticket. Please try again.');
      setShowLoading(false);
    }
  };

  return (
    <div className='bg-white rounded-lg shadow-sm border p-6'>
      <h2 className='text-lg font-bold text-gray-900 mb-4'>
        Scan or Enter Ticket ID
      </h2>

      <div className='space-y-4'>
        <div>
          <label
            htmlFor='ticketId'
            className='block text-sm font-medium text-gray-700 mb-2'
          >
            Ticket ID
          </label>
          <input
            id='ticketId'
            type='text'
            value={ticketId}
            onChange={(e) => setTicketId(e.target.value)}
            placeholder='Paste or type ticket ID'
            className='w-full border border-gray-300 rounded-md px-3 py-3 text-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent'
            onKeyPress={(e) => e.key === 'Enter' && handleLookupTicket()}
          />
        </div>

        <button
          onClick={handleLookupTicket}
          disabled={showLoading || !ticketId.trim()}
          className='w-full bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white font-medium py-3 px-4 rounded-lg transition-colors text-lg'
        >
          {showLoading ? <LoadingIndicator /> : 'Lookup Ticket'}
        </button>
      </div>
    </div>
  );
};

export default TicketLookupForm;
