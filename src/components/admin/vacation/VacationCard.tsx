import {
  Calendar,
  CalendarDays,
  Trash2,
  MapPin,
  Clock,
  Sparkles,
  AlertCircle,
  MoreVertical,
} from 'lucide-react';

import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Vacation } from '@/types/parking';
import { useState } from 'react';

interface VacationCardProps {
  vacation: Vacation;
  onDeleteRequest: (vacation: Vacation) => void;
  className?: string;
}

const VacationCard = ({
  vacation,
  onDeleteRequest,
  className,
}: VacationCardProps) => {
  const [showActions, setShowActions] = useState(false);

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  const getDurationDays = (from: string, to: string) => {
    const start = new Date(from);
    const end = new Date(to);
    const diffTime = end.getTime() - start.getTime();
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24)) + 1;
  };

  const isUpcoming = (fromDate: string) => {
    return new Date(fromDate) > new Date();
  };

  const isActive = (fromDate: string, toDate: string) => {
    const now = new Date();
    return new Date(fromDate) <= now && now <= new Date(toDate);
  };

  const getDaysRemaining = (fromDate: string) => {
    const now = new Date();
    const start = new Date(fromDate);
    const diffTime = start.getTime() - now.getTime();
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  };

  const getDaysElapsed = (fromDate: string, toDate: string) => {
    const now = new Date();
    const start = new Date(fromDate);
    const end = new Date(toDate);

    if (now <= start) return 0;
    if (now >= end) return getDurationDays(fromDate, toDate);

    const diffTime = now.getTime() - start.getTime();
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  };

  const getProgressPercentage = (fromDate: string, toDate: string) => {
    const total = getDurationDays(fromDate, toDate);
    const elapsed = getDaysElapsed(fromDate, toDate);
    return Math.min((elapsed / total) * 100, 100);
  };

  const upcoming = isUpcoming(vacation.from);
  const active = isActive(vacation.from, vacation.to);
  const duration = getDurationDays(vacation.from, vacation.to);
  const daysRemaining = upcoming ? getDaysRemaining(vacation.from) : 0;
  const progressPercentage = active
    ? getProgressPercentage(vacation.from, vacation.to)
    : 0;

  const getStatusConfig = () => {
    if (active) {
      return {
        label: 'Active Now',
        className: 'bg-green-100 text-green-800 border-green-200',
        cardClassName:
          'border-green-200 bg-gradient-to-br from-green-50 via-emerald-50 to-green-50 hover:from-green-100 hover:via-emerald-100 hover:to-green-100',
        iconBg: 'from-green-500 to-emerald-600',
        icon: Sparkles,
      };
    }
    if (upcoming) {
      return {
        label: `In ${daysRemaining} day${daysRemaining !== 1 ? 's' : ''}`,
        className: 'bg-blue-100 text-blue-800 border-blue-200',
        cardClassName:
          'border-blue-200 bg-gradient-to-br from-blue-50 via-cyan-50 to-blue-50 hover:from-blue-100 hover:via-cyan-100 hover:to-blue-100',
        iconBg: 'from-blue-500 to-cyan-600',
        icon: Clock,
      };
    }
    return {
      label: 'Completed',
      className: 'bg-gray-100 text-gray-600 border-gray-200',
      cardClassName:
        'border-gray-200 bg-gradient-to-br from-gray-50 to-gray-100 opacity-75 hover:opacity-90',
      iconBg: 'from-gray-400 to-gray-500',
      icon: AlertCircle,
    };
  };

  const statusConfig = getStatusConfig();

  const handleDeleteClick = () => {
    setShowActions(false);
    onDeleteRequest(vacation);
  };

  return (
    <Card
      className={`group relative ${statusConfig.cardClassName} transition-all duration-300 hover:shadow-xl hover:scale-[1.02] animate-in slide-in-from-bottom-4 ${className}`}
    >
      <CardContent className='p-4 '>
        {/* Action Menu Button - Mobile friendly */}
        <div className='absolute top-3 right-3 sm:top-4 sm:right-4'>
          <div className='relative'>
            <Button
              onClick={() => setShowActions(!showActions)}
              variant='ghost'
              size='sm'
              className='size-8 p-0 rounded-full hover:bg-white/80 transition-all duration-200 opacity-60 hover:opacity-100 group-hover:opacity-100'
            >
              <MoreVertical className='h-4 w-4' />
            </Button>

            {/* Action Dropdown */}
            {showActions && (
              <div className='absolute top-full right-0 mt-1 bg-white rounded-lg shadow-lg border border-gray-200 py-1 z-20 min-w-[120px]'>
                <Button
                  onClick={handleDeleteClick}
                  variant='ghost'
                  size='sm'
                  className='w-full justify-start gap-2 text-red-600 hover:bg-red-50 hover:text-red-700 px-3 py-2 h-auto'
                >
                  <Trash2 className='h-4 w-4' />
                  Delete
                </Button>
              </div>
            )}
          </div>
        </div>

        {/* Header Section - Responsive Layout */}
        <div className='flex flex-col sm:flex-row sm:items-center gap-3 sm:gap-4 mb-4 sm:mb-6'>
          {/* Icon and Status Row for Mobile */}
          <div className='flex items-center justify-between sm:justify-start sm:gap-4'>
            <div
              className={`p-2.5 sm:p-3 bg-gradient-to-br ${statusConfig.iconBg} rounded-xl text-white shadow-lg group-hover:shadow-xl transition-shadow duration-300 flex-shrink-0`}
            >
              <statusConfig.icon className='h-4 w-4 sm:h-5 sm:w-5' />
            </div>

            {/* Status Badge */}
            <div
              className={`px-2.5 py-1 sm:px-3 text-xs font-semibold rounded-full border ${statusConfig.className} inline-flex items-center gap-1 sm:hidden`}
            >
              {statusConfig.label}
              <div className='w-1.5 h-1.5 sm:w-2 sm:h-2 rounded-full bg-current animate-pulse'></div>
            </div>
          </div>

          {/* Title and Desktop Status */}
          <div className='flex-1 min-w-0'>
            <h4 className='font-bold text-gray-900 text-lg sm:text-xl mb-1 truncate pr-8 sm:pr-0'>
              {vacation.name}
            </h4>

            {/* Status Badge - Desktop */}
            <div
              className={`hidden sm:inline-flex px-3 py-1 text-xs font-semibold rounded-full border ${statusConfig.className} items-center gap-1`}
            >
              {statusConfig.label}
              <div className='w-2 h-2 rounded-full bg-current animate-pulse'></div>
            </div>
          </div>
        </div>

        {/* Date Range Section - Responsive */}
        <div className='space-y-2.5 sm:space-y-3 mb-4 sm:mb-6'>
          <div className='flex items-center gap-2.5 sm:gap-3 text-gray-700'>
            <Calendar className='h-4 w-4 text-gray-500 flex-shrink-0' />
            <span className='font-medium text-sm sm:text-base'>
              {formatDate(vacation.from)} - {formatDate(vacation.to)}
            </span>
          </div>

          <div className='flex items-center gap-2.5 sm:gap-3 text-gray-600'>
            <CalendarDays className='h-4 w-4 text-gray-500 flex-shrink-0' />
            <span className='text-sm'>
              {duration} day{duration !== 1 ? 's' : ''} total
            </span>
          </div>

          <div className='flex items-center gap-2.5 sm:gap-3 text-gray-600'>
            <MapPin className='h-4 w-4 text-gray-500 flex-shrink-0' />
            <span className='text-sm'>Special vacation rates apply</span>
          </div>
        </div>

        {/* Progress Bar for Active Vacations - Responsive */}
        {active && (
          <div className='space-y-2 mb-4 sm:mb-6'>
            <div className='flex justify-between text-sm text-gray-600'>
              <span>Progress</span>
              <span className='font-medium'>
                {Math.round(progressPercentage)}% completed
              </span>
            </div>
            <div className='w-full bg-gray-200 rounded-full h-2 overflow-hidden'>
              <div
                className='h-full bg-gradient-to-r from-green-500 to-emerald-500 rounded-full transition-all duration-500 ease-out'
                style={{ width: `${progressPercentage}%` }}
              />
            </div>
          </div>
        )}

        {/* Upcoming Counter - Responsive */}
        {upcoming && daysRemaining <= 7 && (
          <div className='bg-gradient-to-r from-blue-100 to-cyan-100 rounded-lg p-3 border border-blue-200'>
            <div className='flex items-center gap-2'>
              <Clock className='h-4 w-4 text-blue-600 flex-shrink-0' />
              <span className='text-sm font-medium text-blue-900'>
                Starting in {daysRemaining} day{daysRemaining !== 1 ? 's' : ''}
              </span>
            </div>
          </div>
        )}

        {/* Click outside to close actions menu */}
        {showActions && (
          <div
            className='fixed inset-0 z-10'
            onClick={() => setShowActions(false)}
          />
        )}
      </CardContent>
    </Card>
  );
};

export default VacationCard;
