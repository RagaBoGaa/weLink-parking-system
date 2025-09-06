import LoadingIndicator from '@/components/LoadingIndicator';
import { Subscription } from '@/types/parking';

interface PlateVerificationStepProps {
  currentSubscription: Subscription | null;
  subscriptionsLoading: boolean;
  onConfirmPlates: () => void;
  onVisitorRate: () => void;
  checkoutLoading: boolean;
}

const PlateVerificationStep: React.FC<PlateVerificationStepProps> = ({
  currentSubscription,
  subscriptionsLoading,
  onConfirmPlates,
  onVisitorRate,
  checkoutLoading,
}) => {
  return (
    <div className='bg-white rounded-lg shadow-sm border p-6'>
      <h3 className='text-lg font-bold text-gray-900 mb-4'>
        🚗 Verify License Plate
      </h3>

      {subscriptionsLoading ? (
        <LoadingIndicator />
      ) : currentSubscription ? (
        <div className='space-y-4'>
          <div className='p-4 bg-blue-50 rounded-lg border border-blue-200'>
            <h4 className='font-medium text-blue-900 mb-2'>
              Subscriber: {currentSubscription.userName}
            </h4>
            <div className='text-sm text-blue-700 space-y-1'>
              <p>
                Please verify the vehicle license plate matches one of the
                registered plates below:
              </p>
              <p className='font-medium'>
                Status:{' '}
                <span
                  className={
                    currentSubscription.active
                      ? 'text-green-600'
                      : 'text-red-600'
                  }
                >
                  {currentSubscription.active ? 'Active' : 'Inactive'}
                </span>
              </p>
            </div>
          </div>

          <div className='space-y-3'>
            <h4 className='font-medium text-gray-900'>
              Registered Vehicles ({currentSubscription.cars.length}):
            </h4>
            {currentSubscription.cars.map((car, index) => (
              <div
                key={index}
                className='flex justify-between items-center p-4 bg-gray-50 rounded-lg border border-gray-200 hover:bg-gray-100 transition-colors'
              >
                <div className='flex items-center space-x-4'>
                  <div className='bg-white px-4 py-2 rounded-lg font-mono text-xl font-bold border-2 border-blue-500 text-blue-700 tracking-wider'>
                    {car.plate}
                  </div>
                  <div className='text-gray-700'>
                    <div className='font-medium'>
                      {car.brand} {car.model}
                    </div>
                    <div className='text-sm text-gray-500 capitalize'>
                      {car.color}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className='bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-4'>
            <h4 className='font-medium text-yellow-800 mb-2'>
              Employee Decision Required:
            </h4>
            <p className='text-sm text-yellow-700'>
              Compare the physical license plate with the registered plates
              above. Choose the appropriate action:
            </p>
          </div>

          <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
            <button
              onClick={onConfirmPlates}
              disabled={checkoutLoading}
              className='bg-green-600 hover:bg-green-700 disabled:bg-gray-400 text-white font-medium py-4 px-6 rounded-lg transition-colors text-lg flex items-center justify-center space-x-2'
            >
              {checkoutLoading ? (
                <LoadingIndicator />
              ) : (
                <>
                  <span>✅</span>
                  <span>Plates Match - Subscriber Rate</span>
                </>
              )}
            </button>
            <button
              onClick={onVisitorRate}
              disabled={checkoutLoading}
              className='bg-orange-600 hover:bg-orange-700 disabled:bg-gray-400 text-white font-medium py-4 px-6 rounded-lg transition-colors text-lg flex items-center justify-center space-x-2'
            >
              {checkoutLoading ? (
                <LoadingIndicator />
              ) : (
                <>
                  <span>⚠️</span>
                  <span>Plates Don't Match - Visitor Rate</span>
                </>
              )}
            </button>
          </div>
        </div>
      ) : (
        <div className='text-center py-8'>
          <div className='text-red-600 font-medium mb-2'>
            ⚠️ Subscription Not Found
          </div>
          <p className='text-gray-600 text-sm mb-4'>
            This subscriber ticket is not linked to any active subscription.
          </p>
          <button
            onClick={onVisitorRate}
            disabled={checkoutLoading}
            className='bg-orange-600 hover:bg-orange-700 text-white font-medium py-3 px-6 rounded-lg transition-colors'
          >
            Process as Visitor Rate
          </button>
        </div>
      )}
    </div>
  );
};

export default PlateVerificationStep;
