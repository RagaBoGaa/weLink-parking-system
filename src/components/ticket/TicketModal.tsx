import { Gate, Zone, CheckinResponse } from '@/types/parking';
import { useState, useEffect } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import GateAnimation from './GateAnimation';
import { formatDateTime } from '@/utils/formatters';
import PrintTicketView from './PrintTicketView';

interface TicketModalProps {
  ticket: CheckinResponse;
  gate: Gate;
  zone?: Zone | null;
  open: boolean;
  onClose: () => void;
}

const TicketModal = ({
  ticket,
  gate,
  zone,
  open,
  onClose,
}: TicketModalProps) => {
  const [gateAnimationPhase, setGateAnimationPhase] = useState<
    'closed' | 'opening' | 'open'
  >('closed');
  const [showSuccess, setShowSuccess] = useState(false);

  useEffect(() => {
    if (open) {
      setGateAnimationPhase('closed');
      setShowSuccess(false);

      const timer1 = setTimeout(() => {
        setGateAnimationPhase('opening');
      }, 500);

      const timer2 = setTimeout(() => {
        setGateAnimationPhase('open');
      }, 2000);

      const timer3 = setTimeout(() => {
        setShowSuccess(true);
      }, 2500);

      return () => {
        clearTimeout(timer1);
        clearTimeout(timer2);
        clearTimeout(timer3);
      };
    }
  }, [open]);

  const handlePrint = () => {
    window.print();
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className='max-w-md print:max-w-none print:shadow-none max-h-[90dvh] w-[90dvw] lg:w-full overflow-y-auto'>
        {/* Screen View */}
        <div className='print:hidden'>
          <DialogHeader className='text-center space-y-2'>
            <DialogTitle className='text-2xl font-bold text-gray-900'>
              Parking Ticket
            </DialogTitle>
            <div
              className={`transition-all duration-500 ${
                showSuccess ? 'text-green-600' : 'text-blue-600'
              }`}
            >
              <p className='font-medium'>
                {showSuccess
                  ? '✅ Check-in Successful!'
                  : '🎫 Processing Entry...'}
              </p>
            </div>
          </DialogHeader>

          <div className='space-y-6 my-6'>
            {/* Ticket Information */}
            <div className='space-y-3 p-4 bg-gray-50 rounded-lg'>
              <div className='flex justify-between items-center'>
                <span className='text-gray-600 text-sm'>Ticket ID:</span>
                <span className='font-bold text-lg font-mono'>
                  {ticket.ticket.id}
                </span>
              </div>
              <Separator />
              <div className='flex justify-between'>
                <span className='text-gray-600 text-sm'>Type:</span>
                <span className='font-medium capitalize text-sm'>
                  {ticket.ticket.type}
                </span>
              </div>
              <div className='flex justify-between'>
                <span className='text-gray-600 text-sm'>Gate:</span>
                <span className='font-medium text-sm'>{gate.name}</span>
              </div>
              <div className='flex justify-between'>
                <span className='text-gray-600 text-sm'>Zone:</span>
                <span className='font-medium text-sm'>
                  {zone?.name || ticket.ticket.zoneId}
                </span>
              </div>
              <div className='flex justify-between'>
                <span className='text-gray-600 text-sm'>Check-in Time:</span>
                <span className='font-medium text-sm'>
                  {formatDateTime(ticket.ticket.checkinAt)}
                </span>
              </div>
              {ticket.ticket.subscriptionId && (
                <div className='flex justify-between'>
                  <span className='text-gray-600 text-sm'>Subscription:</span>
                  <span className='font-medium text-sm'>
                    {ticket.ticket.subscriptionId}
                  </span>
                </div>
              )}
            </div>

            {/* Gate Animation */}
            <div className='p-4 bg-blue-50 rounded-lg border border-blue-200'>
              <GateAnimation
                gateAnimationPhase={gateAnimationPhase}
                showSuccess={showSuccess}
              />
              <p className='text-center text-blue-700 font-medium mt-3 text-sm'>
                {gateAnimationPhase === 'closed' && 'Verifying access...'}
                {gateAnimationPhase === 'opening' && 'Opening gate...'}
                {gateAnimationPhase === 'open' &&
                  showSuccess &&
                  'Welcome! Drive safely.'}
              </p>
            </div>
          </div>

          <DialogFooter className='flex-col sm:flex-row gap-2'>
            <Button
              onClick={handlePrint}
              variant='default'
              className='w-full sm:w-auto'
              disabled={!showSuccess}
            >
              🖨️ Print Ticket
            </Button>
            <Button
              onClick={onClose}
              variant='outline'
              className='w-full sm:w-auto'
            >
              Close
            </Button>
          </DialogFooter>
        </div>

        {/* Print View */}
        <PrintTicketView ticket={ticket} gate={gate} zone={zone} />
      </DialogContent>
    </Dialog>
  );
};

export default TicketModal;
