import {
  CalendarDays,
  Clock,
  Sparkles,
  Timer,
  ChevronDown,
} from 'lucide-react';
import { RushHour } from '@/types/parking';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import RushHourItem from './RushHourItem';
import { useState, useRef, useEffect } from 'react';

interface DayRushHoursCardProps {
  dayName: string;
  dayIndex: number;
  rushHours: RushHour[];
  onDelete: (id: string, rushHour: RushHour) => void;
  className?: string;
}

const DayRushHoursCard = ({
  dayName,
  dayIndex,
  rushHours,
  onDelete,
  className,
}: DayRushHoursCardProps) => {
  const [isScrollable, setIsScrollable] = useState(false);
  const [showScrollIndicator, setShowScrollIndicator] = useState(false);
  const contentRef = useRef<HTMLDivElement>(null);

  const getTotalDuration = () => {
    return rushHours.reduce((total, rushHour) => {
      const start = new Date(`2000-01-01T${rushHour.from}:00`);
      const end = new Date(`2000-01-01T${rushHour.to}:00`);
      const diffMs = end.getTime() - start.getTime();
      const diffHours = diffMs / (1000 * 60 * 60);
      return total + diffHours;
    }, 0);
  };

  const getActivityLevel = () => {
    const totalDuration = getTotalDuration();
    if (totalDuration === 0) return 'none';
    if (totalDuration >= 6) return 'high';
    if (totalDuration >= 3) return 'medium';
    return 'low';
  };

  // Check if content is scrollable
  useEffect(() => {
    const checkScrollable = () => {
      if (contentRef.current) {
        const hasOverflow =
          contentRef.current.scrollHeight > contentRef.current.clientHeight;
        setIsScrollable(hasOverflow);

        // Check if user is at the bottom of scroll
        const isAtBottom =
          contentRef.current.scrollHeight - contentRef.current.scrollTop <=
          contentRef.current.clientHeight + 5;
        setShowScrollIndicator(hasOverflow && !isAtBottom);
      }
    };

    checkScrollable();
    window.addEventListener('resize', checkScrollable);

    return () => window.removeEventListener('resize', checkScrollable);
  }, [rushHours]);

  const handleScroll = () => {
    if (contentRef.current) {
      const isAtBottom =
        contentRef.current.scrollHeight - contentRef.current.scrollTop <=
        contentRef.current.clientHeight + 5;
      setShowScrollIndicator(isScrollable && !isAtBottom);
    }
  };

  const activityLevel = getActivityLevel();
  const totalDuration = getTotalDuration();
  const rushHourCount = rushHours.length;

  const activityColors = {
    none: 'border-gray-200 bg-gray-50',
    low: 'border-green-200 bg-green-50',
    medium: 'border-orange-200 bg-orange-50',
    high: 'border-red-200 bg-red-50',
  };

  const activityIcons = {
    none: 'text-gray-400',
    low: 'text-green-600',
    medium: 'text-orange-600',
    high: 'text-red-600',
  };

  const getDayColor = () => {
    // Weekend days get a different color
    if (dayIndex === 0 || dayIndex === 6) {
      return 'from-blue-500 to-blue-600';
    }
    // Weekdays
    return 'from-purple-500 to-purple-600';
  };

  if (rushHours.length === 0) {
    return (
      <Card
        className={`${activityColors[activityLevel]} border-2 border-dashed transition-all duration-200 hover:shadow-sm min-h-[280px] ${className}`}
      >
        <CardContent className='pt-6 pb-6 h-full flex items-center justify-center'>
          <div className='text-center'>
            <div className='flex items-center justify-center mb-3'>
              <div
                className={`p-3 bg-gradient-to-br ${getDayColor()} rounded-xl text-white`}
              >
                <CalendarDays className='h-5 w-5' />
              </div>
            </div>
            <h4 className='font-semibold text-gray-900 mb-2'>{dayName}</h4>
            <div className='space-y-2'>
              <div className='flex items-center justify-center gap-2 text-gray-500'>
                <Clock className='h-4 w-4' />
                <span className='text-sm'>No rush hours</span>
              </div>
              <p className='text-xs text-gray-400'>
                Standard rates apply all day
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card
      className={`${activityColors[activityLevel]} border-2 px-2 transition-all duration-200 hover:shadow-md h-[400px] flex flex-col ${className}`}
    >
      <CardHeader className='pb-3 flex-shrink-0'>
        {/* Activity Level Indicator */}
        <div className='flex items-center gap-2 justify-end'>
          <div
            className={`flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium ${
              activityLevel === 'high'
                ? 'bg-red-100 text-red-700'
                : activityLevel === 'medium'
                ? 'bg-orange-100 text-orange-700'
                : activityLevel === 'low'
                ? 'bg-green-100 text-green-700'
                : 'bg-gray-100 text-gray-700'
            }`}
          >
            <Sparkles className={`h-3 w-3 ${activityIcons[activityLevel]}`} />
            <span className='capitalize'>{activityLevel} Activity</span>
          </div>
        </div>

        <div className='flex items-center gap-3'>
          <div
            className={`p-2 bg-gradient-to-br ${getDayColor()} rounded-lg text-white`}
          >
            <CalendarDays className='h-4 w-4' />
          </div>
          <div className='flex justify-between gap-3'>
            <h4 className='font-semibold text-gray-900 text-lg'>{dayName}</h4>
            <div className='flex items-center gap-3 text-sm text-gray-600'>
              <div className='flex items-center gap-1'>
                <Timer className='h-3 w-3' />
                <span>
                  {rushHourCount} period{rushHourCount !== 1 ? 's' : ''}
                </span>
              </div>
              <div className='flex items-center gap-1'>
                <Clock className='h-3 w-3' />
                <span>{totalDuration}h total</span>
              </div>
            </div>
          </div>
        </div>
      </CardHeader>

      <div className='flex-1 flex flex-col relative overflow-hidden'>
        <CardContent
          ref={contentRef}
          onScroll={handleScroll}
          className='flex-1 space-y-3 overflow-y-auto scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-transparent pr-2'
          style={{
            scrollbarWidth: 'thin',
            scrollbarColor: '#cbd5e1 transparent',
          }}
        >
          {rushHours
            .sort((a, b) => a.from.localeCompare(b.from))
            .map((rushHour) => (
              <RushHourItem
                key={rushHour.id}
                rushHour={rushHour}
                onDelete={onDelete}
              />
            ))}
        </CardContent>

        {/* Scroll Indicator */}
        {showScrollIndicator && (
          <div className='absolute bottom-0 left-0 right-0 h-8 bg-gradient-to-t from-white via-white/80 to-transparent pointer-events-none flex items-end justify-center pb-1'>
            <div className='flex items-center gap-1 text-xs text-gray-500 bg-white/90 px-2 py-1 rounded-full shadow-sm border'>
              <ChevronDown className='h-3 w-3 animate-bounce' />
              <span>Scroll for more</span>
            </div>
          </div>
        )}

        {/* Item Count Indicator */}
        {rushHours.length > 3 && (
          <div className='absolute top-2 right-2 bg-white/90 backdrop-blur-sm border border-gray-200 text-xs text-gray-600 px-2 py-1 rounded-full shadow-sm'>
            {rushHours.length} items
          </div>
        )}
      </div>
    </Card>
  );
};

export default DayRushHoursCard;
