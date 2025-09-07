import {
  Calendar,
  CalendarDays,
  CalendarCheck,
  TrendingUp,
  Plane,
  Clock,
} from 'lucide-react';

import { Card, CardContent } from '@/components/ui/card';
import { Vacation } from '@/types/parking';

interface VacationStatsProps {
  vacations: Vacation[];
  className?: string;
}

interface StatsData {
  total: number;
  active: number;
  upcoming: number;
  past: number;
  totalDays: number;
  activeDays: number;
}

const VacationStats = ({ vacations, className }: VacationStatsProps) => {
  const calculateStats = (): StatsData => {
    const now = new Date();

    const stats = vacations.reduce(
      (acc, vacation) => {
        const fromDate = new Date(vacation.from);
        const toDate = new Date(vacation.to);
        const duration =
          Math.ceil(
            (toDate.getTime() - fromDate.getTime()) / (1000 * 60 * 60 * 24)
          ) + 1;

        acc.total++;
        acc.totalDays += duration;

        if (fromDate <= now && now <= toDate) {
          acc.active++;
          acc.activeDays += duration;
        } else if (fromDate > now) {
          acc.upcoming++;
        } else {
          acc.past++;
        }

        return acc;
      },
      { total: 0, active: 0, upcoming: 0, past: 0, totalDays: 0, activeDays: 0 }
    );

    return stats;
  };

  const stats = calculateStats();

  const statCards = [
    {
      title: 'Total Periods',
      value: stats.total,
      icon: Calendar,
      color: 'from-blue-500 to-blue-600',
      bgColor: 'from-blue-50 to-blue-100',
      textColor: 'text-blue-700',
      description: 'All vacation periods',
    },
    {
      title: 'Active Now',
      value: stats.active,
      icon: CalendarCheck,
      color: 'from-green-500 to-green-600',
      bgColor: 'from-green-50 to-green-100',
      textColor: 'text-green-700',
      description: 'Currently active periods',
    },
    {
      title: 'Upcoming',
      value: stats.upcoming,
      icon: Clock,
      color: 'from-purple-500 to-purple-600',
      bgColor: 'from-purple-50 to-purple-100',
      textColor: 'text-purple-700',
      description: 'Future vacation periods',
    },
    {
      title: 'Total Days',
      value: stats.totalDays,
      icon: CalendarDays,
      color: 'from-orange-500 to-orange-600',
      bgColor: 'from-orange-50 to-orange-100',
      textColor: 'text-orange-700',
      description: 'Total vacation days',
    },
  ];

  if (stats.total === 0) {
    return null;
  }

  return (
    <div className={`space-y-4 ${className}`}>
      {/* Header */}
      <div className='flex items-center gap-3 mb-6'>
        <div className='p-2 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-lg text-white'>
          <TrendingUp className='h-5 w-5' />
        </div>
        <div>
          <h3 className='text-lg font-semibold text-gray-900'>
            Vacation Overview
          </h3>
          <p className='text-sm text-gray-500'>
            Quick statistics about your vacation periods
          </p>
        </div>
      </div>

      {/* Stats Grid */}
      <div className='grid grid-cols-2 lg:grid-cols-4 gap-4'>
        {statCards.map((stat, index) => (
          <Card
            key={stat.title}
            className={`border-0 bg-gradient-to-br ${stat.bgColor} hover:shadow-lg transition-all duration-300 hover:scale-[1.02] animate-in slide-in-from-bottom-4`}
            style={{ animationDelay: `${index * 100}ms` }}
          >
            <CardContent className='p-4'>
              <div className='flex items-center justify-between mb-3'>
                <div
                  className={`p-2 bg-gradient-to-br ${stat.color} rounded-lg text-white shadow-md`}
                >
                  <stat.icon className='h-4 w-4' />
                </div>
                <div className='text-right'>
                  <div className={`text-2xl font-bold ${stat.textColor}`}>
                    {stat.value}
                  </div>
                </div>
              </div>
              <div>
                <h4 className={`font-medium ${stat.textColor} mb-1`}>
                  {stat.title}
                </h4>
                <p className='text-xs text-gray-500'>{stat.description}</p>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Additional insights */}
      {stats.active > 0 && (
        <Card className='border-green-200 bg-gradient-to-r from-green-50 to-emerald-50'>
          <CardContent className='p-4'>
            <div className='flex items-center gap-3'>
              <div className='p-2 bg-green-500 rounded-lg text-white'>
                <Plane className='h-4 w-4' />
              </div>
              <div>
                <p className='font-medium text-green-900'>
                  {stats.active} vacation period{stats.active !== 1 ? 's' : ''}{' '}
                  currently active
                </p>
                <p className='text-sm text-green-700'>
                  Special vacation rates are being applied
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default VacationStats;
