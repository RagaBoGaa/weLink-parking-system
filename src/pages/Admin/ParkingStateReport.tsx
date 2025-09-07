import { useGetParkingStateReportQuery } from '@/api/cruds';
import LoadingIndicator from '@/components/LoadingIndicator';
import ErrorComponent from '@/components/shared/ErrorComponent';
import { Zone } from '@/types/parking';

const ParkingStateReport = () => {
  const { data, isLoading, error, refetch } =
    useGetParkingStateReportQuery(null);

  if (isLoading) return <LoadingIndicator />;

  if (error) {
    return <ErrorComponent error={error} onRetry={refetch} />;
  }

  const zones = data || [];

  const getStatusBadge = (zone: Zone) => {
    if (!zone.open) {
      return (
        <span className='bg-red-500 text-white text-xs px-2 py-1 rounded-full'>
          CLOSED
        </span>
      );
    }

    const utilizationRate =
      zone.totalSlots > 0 ? (zone.occupied / zone.totalSlots) * 100 : 0;

    if (utilizationRate >= 90) {
      return (
        <span className='bg-red-500 text-white text-xs px-2 py-1 rounded-full'>
          FULL
        </span>
      );
    } else if (utilizationRate >= 70) {
      return (
        <span className='bg-yellow-500 text-white text-xs px-2 py-1 rounded-full'>
          BUSY
        </span>
      );
    } else {
      return (
        <span className='bg-green-500 text-white text-xs px-2 py-1 rounded-full'>
          AVAILABLE
        </span>
      );
    }
  };

  const calculateUtilization = (zone: Zone) => {
    if (zone.totalSlots === 0) return 0;
    return ((zone.occupied / zone.totalSlots) * 100).toFixed(1);
  };

  return (
    <div className='space-y-6'>
      {/* Summary Stats */}
      <div className='grid grid-cols-1 md:grid-cols-4 gap-4'>
        <div className='bg-white p-4 rounded-lg shadow-sm border'>
          <div className='text-2xl font-bold text-blue-600'>{zones.length}</div>
          <div className='text-sm text-gray-600'>Total Zones</div>
        </div>
        <div className='bg-white p-4 rounded-lg shadow-sm border'>
          <div className='text-2xl font-bold text-green-600'>
            {zones.reduce((sum, zone) => sum + zone.totalSlots, 0)}
          </div>
          <div className='text-sm text-gray-600'>Total Slots</div>
        </div>
        <div className='bg-white p-4 rounded-lg shadow-sm border'>
          <div className='text-2xl font-bold text-red-600'>
            {zones.reduce((sum, zone) => sum + zone.occupied, 0)}
          </div>
          <div className='text-sm text-gray-600'>Occupied</div>
        </div>
        <div className='bg-white p-4 rounded-lg shadow-sm border'>
          <div className='text-2xl font-bold text-yellow-600'>
            {zones.reduce((sum, zone) => sum + zone.reserved, 0)}
          </div>
          <div className='text-sm text-gray-600'>Reserved</div>
        </div>
      </div>

      {/* Zones Table */}
      <div className='bg-white rounded-lg shadow-sm border'>
        <div className='p-6 border-b border-gray-200'>
          <h2 className='text-lg font-bold text-gray-900'>
            Zone Status Report
          </h2>
          <p className='text-sm text-gray-600'>
            Real-time parking availability and statistics
          </p>
        </div>

        <div className='overflow-x-auto'>
          <table className='w-full'>
            <thead className='bg-gray-50'>
              <tr>
                <th className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'>
                  Zone
                </th>
                <th className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'>
                  Status
                </th>
                <th className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'>
                  Occupancy
                </th>
                <th className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'>
                  Available
                </th>
                <th className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'>
                  Reserved
                </th>
                <th className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'>
                  Subscribers
                </th>
                <th className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'>
                  Utilization
                </th>
              </tr>
            </thead>
            <tbody className='bg-white divide-y divide-gray-200'>
              {zones.map((zone) => (
                <tr key={zone.zoneId} className='hover:bg-gray-50'>
                  <td className='px-6 py-4 whitespace-nowrap'>
                    <div>
                      <div className='font-medium text-gray-900'>
                        {zone.name}
                      </div>
                      <div className='text-sm text-gray-500'>
                        {zone.categoryId}
                      </div>
                    </div>
                  </td>
                  <td className='px-6 py-4 whitespace-nowrap'>
                    {getStatusBadge(zone)}
                  </td>
                  <td className='px-6 py-4 whitespace-nowrap'>
                    <div className='text-sm text-gray-900'>
                      {zone.occupied}/{zone.totalSlots}
                    </div>
                    <div className='text-xs text-gray-500'>
                      {zone.free} free
                    </div>
                  </td>
                  <td className='px-6 py-4 whitespace-nowrap'>
                    <div className='text-sm text-gray-900'>
                      V: {zone.availableForVisitors}
                    </div>
                    <div className='text-xs text-gray-500'>
                      S: {zone.availableForSubscribers}
                    </div>
                  </td>
                  <td className='px-6 py-4 whitespace-nowrap'>
                    <div className='text-sm font-medium text-yellow-600'>
                      {zone.reserved}
                    </div>
                  </td>
                  <td className='px-6 py-4 whitespace-nowrap'>
                    <div className='text-sm text-gray-900'>
                      {zone.subscriberCount || 0}
                    </div>
                  </td>
                  <td className='px-6 py-4 whitespace-nowrap'>
                    <div className='flex items-center'>
                      <div className='flex-1 bg-gray-200 rounded-full h-2 mr-2'>
                        <div
                          className='bg-blue-600 h-2 rounded-full'
                          style={{ width: `${calculateUtilization(zone)}%` }}
                        ></div>
                      </div>
                      <div className='text-sm text-gray-600'>
                        {calculateUtilization(zone)}%
                      </div>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default ParkingStateReport;
