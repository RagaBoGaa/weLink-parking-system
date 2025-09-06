import { useState, useEffect } from 'react';
import { toast } from 'react-hot-toast';
import { Navigate } from 'react-router';

import {
  useCheckoutTicketMutation,
  useLazyGetTicketQuery,
  useLazyGetSubscriptionsQuery,
} from '@/api/cruds';
import { useTypedSelector } from '@/api/store/store';
import { CheckoutResponse, Subscription } from '@/types/parking';

import TicketLookupForm from '@/components/checkpoint/TicketLookupForm';
import TicketInfoDisplay from '@/components/checkpoint/TicketInfoDisplay';
import PlateVerificationStep from '@/components/checkpoint/PlateVerificationStep';
import CheckoutResults from '@/components/checkpoint/CheckoutResults';

const CheckpointScreen = () => {
  const [checkoutResult, setCheckoutResult] = useState<CheckoutResponse | null>(
    null
  );
  const [plateVerificationStep, setPlateVerificationStep] = useState(false);
  const [resetKey, setResetKey] = useState(0);

  const { isAuthenticated, user } = useTypedSelector((state) => state.auth);
  const [checkoutTicket, { isLoading: checkoutLoading }] =
    useCheckoutTicketMutation();

  const [
    triggerGetTicket,
    { data: ticketInfo, isSuccess: ticketSuccess, reset: resetTicketQuery },
  ] = useLazyGetTicketQuery();

  const [
    triggerGetSubscriptions,
    {
      data: allSubscriptions,
      isLoading: subscriptionsLoading,
      reset: resetSubscriptionsQuery,
    },
  ] = useLazyGetSubscriptionsQuery();

  const currentSubscription =
    allSubscriptions?.find((sub: Subscription) =>
      sub.currentCheckins?.some(
        (checkin: any) => checkin.ticketId === ticketInfo?.id
      )
    ) || null;

  // Auto-trigger verification step when ticket info is ready
  useEffect(() => {
    if (
      ticketInfo?.type === 'subscriber' &&
      allSubscriptions &&
      !plateVerificationStep
    ) {
      if (currentSubscription) {
        setPlateVerificationStep(true);
      }
    }
  }, [
    ticketInfo,
    allSubscriptions,
    plateVerificationStep,
    currentSubscription,
  ]);

  // Redirect if not authenticated employee
  if (
    !isAuthenticated ||
    (user?.role !== 'employee' && user?.role !== 'admin')
  ) {
    return <Navigate to='/login' replace />;
  }

  const handleConfirmPlates = () => {
    setPlateVerificationStep(false);
    handleCheckout();
  };

  const handleCheckout = async (forceConvertToVisitor: boolean = false) => {
    if (!ticketInfo?.id) {
      toast.error('No ticket found to checkout');
      return;
    }

    try {
      const result = await checkoutTicket({
        ticketId: ticketInfo.id,
        forceConvertToVisitor,
      }).unwrap();

      setCheckoutResult(result);
      setPlateVerificationStep(false);

      if (forceConvertToVisitor) {
        toast.success(
          '🔄 Converted to visitor rate and processed successfully!'
        );
      } else {
        toast.success(
          `💰 Checkout completed! Amount: $${result.amount.toFixed(2)}`
        );
      }
    } catch (error: any) {
      console.error('Checkout failed:', error);
      const errorMessage =
        error?.data?.message || 'Checkout failed. Please try again.';
      toast.error(`❌ ${errorMessage}`);
    }
  };

  const handleNewTicket = () => {
    setCheckoutResult(null);
    setPlateVerificationStep(false);
    resetTicketQuery();
    resetSubscriptionsQuery();
  };

  const handleSearchAnother = () => {
    setPlateVerificationStep(false);
    resetTicketQuery();
    resetSubscriptionsQuery();
    setResetKey((prev) => prev + 1); // Trigger form reset
  };

  return (
    <div className='min-h-screen bg-gray-50'>
      <div className='max-w-4xl mx-auto px-4 py-6'>
        {checkoutResult && ticketSuccess && !checkoutLoading ? (
          <CheckoutResults
            checkoutResult={checkoutResult}
            ticketInfo={ticketInfo}
            currentSubscription={currentSubscription}
            onNewTicket={handleNewTicket}
          />
        ) : (
          <div className='space-y-6'>
            {/* Ticket Input Form */}
            {!ticketSuccess ? (
              <TicketLookupForm
                triggerGetTicket={triggerGetTicket}
                triggerGetSubscriptions={triggerGetSubscriptions}
                resetKey={resetKey}
              />
            ) : (
              <div className='bg-white rounded-lg shadow-sm border p-6'>
                <TicketInfoDisplay
                  ticketInfo={ticketInfo}
                  onCheckout={handleCheckout}
                  checkoutLoading={checkoutLoading}
                  onSearchAnother={handleSearchAnother}
                />
              </div>
            )}

            {/* Plate Verification Step */}
            {plateVerificationStep && ticketInfo?.type === 'subscriber' && (
              <PlateVerificationStep
                currentSubscription={currentSubscription}
                subscriptionsLoading={subscriptionsLoading}
                onConfirmPlates={handleConfirmPlates}
                onVisitorRate={() => handleCheckout(true)}
                checkoutLoading={checkoutLoading}
              />
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default CheckpointScreen;
