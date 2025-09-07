import { CalendarDays, Timer, TrendingUp, BarChart3 } from 'lucide-react';
import { RushHour } from '@/types/parking';
import { Card, CardContent } from '@/components/ui/card';
import DayRushHoursCard from './DayRushHoursCard';

interface RushHoursListProps {
  rushHours: RushHour[];
  onDelete: (id: string, rushHour: RushHour) => void;
  className?: string;
}

const RushHoursList = ({
  rushHours,
  onDelete,
  className,
}: RushHoursListProps) => {
  const weekDays = [
    'Sunday',
    'Monday',
    'Tuesday',
    'Wednesday',
    'Thursday',
    'Friday',
    'Saturday',
  ];

  // Group rush hours by day
  const rushHoursByDay = rushHours.reduce((acc, rushHour) => {
    if (!acc[rushHour.weekDay]) {
      acc[rushHour.weekDay] = [];
    }
    acc[rushHour.weekDay].push(rushHour);
    return acc;
  }, {} as Record<number, RushHour[]>);

  // Calculate statistics
  const getStatistics = () => {
    const totalRushHours = rushHours.length;
    const daysWithRushHours = Object.keys(rushHoursByDay).length;
    const totalDuration = rushHours.reduce((total, rushHour) => {
      const start = new Date(`2000-01-01T${rushHour.from}:00`);
      const end = new Date(`2000-01-01T${rushHour.to}:00`);
      const diffMs = end.getTime() - start.getTime();
      return total + diffMs / (1000 * 60 * 60);
    }, 0);
    const avgDurationPerDay =
      daysWithRushHours > 0 ? totalDuration / daysWithRushHours : 0;

    return {
      totalRushHours,
      daysWithRushHours,
      totalDuration,
      avgDurationPerDay,
    };
  };

  const stats = getStatistics();

  if (rushHours.length === 0) {
    return (
      <div className={`space-y-6 ${className}`}>
        <div className='flex items-center gap-2'>
          <CalendarDays className='h-5 w-5 text-gray-600' />
          <h3 className='font-semibold text-gray-900 text-lg'>
            Current Rush Hours
          </h3>
        </div>

        <Card variant='outlined' className='border-dashed border-2'>
          <CardContent className='pt-8 pb-8 text-center'>
            <div className='max-w-md mx-auto'>
              <div className='p-4 bg-gray-100 rounded-full w-fit mx-auto mb-4'>
                <Timer className='h-8 w-8 text-gray-400' />
              </div>
              <h4 className='text-lg font-semibold text-gray-900 mb-2'>
                No rush hours configured
              </h4>
              <p className='text-gray-500 mb-4'>
                Set up your first rush hour period to apply special rates during
                peak times.
              </p>
              <div className='text-sm text-gray-400'>
                💡 Tip: Rush hours help optimize pricing for busy periods
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className={`space-y-6 ${className}`}>
      {/* Header with Statistics */}
      <div className='space-y-4'>
        <div className='flex items-center gap-2'>
          <CalendarDays className='h-5 w-5 text-gray-600' />
          <h3 className='font-semibold text-gray-900 text-lg'>
            Current Rush Hours
          </h3>
        </div>

        {/* Statistics Cards */}
        <div className='grid grid-cols-2 lg:grid-cols-4 gap-4'>
          <Card className='bg-gradient-to-br from-blue-50 to-blue-100 border-blue-200'>
            <CardContent className='pt-4 pb-4'>
              <div className='flex items-center gap-3'>
                <div className='p-2 bg-blue-500 rounded-lg text-white'>
                  <BarChart3 className='h-4 w-4' />
                </div>
                <div>
                  <p className='text-sm text-blue-700 font-medium'>
                    Total Periods
                  </p>
                  <p className='text-2xl font-bold text-blue-900'>
                    {stats.totalRushHours}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className='bg-gradient-to-br from-green-50 to-green-100 border-green-200'>
            <CardContent className='pt-4 pb-4'>
              <div className='flex items-center gap-3'>
                <div className='p-2 bg-green-500 rounded-lg text-white'>
                  <CalendarDays className='h-4 w-4' />
                </div>
                <div>
                  <p className='text-sm text-green-700 font-medium'>
                    Active Days
                  </p>
                  <p className='text-2xl font-bold text-green-900'>
                    {stats.daysWithRushHours}/7
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className='bg-gradient-to-br from-purple-50 to-purple-100 border-purple-200'>
            <CardContent className='pt-4 pb-4'>
              <div className='flex items-center gap-3'>
                <div className='p-2 bg-purple-500 rounded-lg text-white'>
                  <Timer className='h-4 w-4' />
                </div>
                <div>
                  <p className='text-sm text-purple-700 font-medium'>
                    Total Hours
                  </p>
                  <p className='text-2xl font-bold text-purple-900'>
                    {stats.totalDuration.toFixed(1)}h
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className='bg-gradient-to-br from-orange-50 to-orange-100 border-orange-200'>
            <CardContent className='pt-4 pb-4'>
              <div className='flex items-center gap-3'>
                <div className='p-2 bg-orange-500 rounded-lg text-white'>
                  <TrendingUp className='h-4 w-4' />
                </div>
                <div>
                  <p className='text-sm text-orange-700 font-medium'>Avg/Day</p>
                  <p className='text-2xl font-bold text-orange-900'>
                    {stats.avgDurationPerDay.toFixed(1)}h
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Days Grid */}
      <div className='grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-3'>
        {weekDays.map((dayName, dayIndex) => (
          <DayRushHoursCard
            key={dayIndex}
            dayName={dayName}
            dayIndex={dayIndex}
            rushHours={rushHoursByDay[dayIndex] || []}
            onDelete={onDelete}
          />
        ))}
      </div>
    </div>
  );
};

export default RushHoursList;
