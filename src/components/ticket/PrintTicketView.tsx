import { CheckinResponse, Zone, Gate } from '@/types/parking';
import { formatDateTime } from '@/utils/formatters';

const PrintTicketView = ({
  ticket,
  gate,
  zone,
}: {
  ticket: CheckinResponse;
  gate: Gate;
  zone?: Zone | null;
}) => {
  return (
    <div className='hidden print:block p-6 text-black'>
      <div className='text-center mb-6'>
        <h1 className='text-3xl font-bold mb-2'>WeLink Cargo</h1>
        <h2 className='text-xl font-semibold mb-1'>PARKING TICKET</h2>
        <div className='border-t border-b border-gray-400 py-2 my-4'>
          <p className='text-lg font-bold'>{ticket.ticket.id}</p>
        </div>
      </div>

      <div className='space-y-3 text-sm'>
        <div className='flex justify-between'>
          <span>Type:</span>
          <span className='font-medium capitalize'>{ticket.ticket.type}</span>
        </div>
        <div className='flex justify-between'>
          <span>Gate:</span>
          <span className='font-medium'>{gate.name}</span>
        </div>
        <div className='flex justify-between'>
          <span>Location:</span>
          <span className='font-medium'>{gate.location}</span>
        </div>
        <div className='flex justify-between'>
          <span>Zone:</span>
          <span className='font-medium'>
            {zone?.name || ticket.ticket.zoneId}
          </span>
        </div>
        <div className='flex justify-between'>
          <span>Check-in:</span>
          <span className='font-medium'>
            {formatDateTime(ticket.ticket.checkinAt)}
          </span>
        </div>
        {ticket.ticket.subscriptionId && (
          <div className='flex justify-between'>
            <span>Subscription ID:</span>
            <span className='font-medium'>{ticket.ticket.subscriptionId}</span>
          </div>
        )}
      </div>

      <div className='border-t border-gray-400 pt-4 mt-6 text-center'>
        <p className='text-xs'>Please keep this ticket for checkout</p>
        <p className='text-xs'>Present ticket ID at checkpoint for payment</p>
      </div>
    </div>
  );
};

export default PrintTicketView;
