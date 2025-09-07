import { CalendarX, Plane, Plus, Sparkles } from 'lucide-react';

import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

interface VacationEmptyStateProps {
  onAddClick?: () => void;
  className?: string;
}

const VacationEmptyState = ({
  onAddClick,
  className,
}: VacationEmptyStateProps) => {
  return (
    <Card
      variant='outlined'
      className={`border-dashed border-2 border-gray-200 hover:border-blue-300 transition-all duration-300 hover:shadow-lg ${className}`}
    >
      <CardContent className='py-12 text-center'>
        <div className='animate-in fade-in-50 slide-in-from-bottom-4 duration-500'>
          {/* Animated Icon */}
          <div className='relative mx-auto mb-6 w-24 h-24'>
            <div className='absolute inset-0 bg-gradient-to-br from-blue-100 to-purple-100 rounded-full animate-pulse'></div>
            <div className='relative flex items-center justify-center w-full h-full bg-gradient-to-br from-blue-50 to-purple-50 rounded-full border-2 border-blue-200'>
              <CalendarX className='h-12 w-12 text-gray-400' />
              <div className='absolute -top-2 -right-2 p-2 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full text-white shadow-lg'>
                <Plane className='h-4 w-4' />
              </div>
            </div>
          </div>

          {/* Main Message */}
          <div className='space-y-3 mb-8'>
            <h3 className='text-xl font-bold text-gray-900'>
              No vacation periods configured
            </h3>
            <p className='text-gray-500 max-w-md mx-auto leading-relaxed'>
              Start by adding your first vacation period to manage special rates
              for holidays and vacation times throughout the year.
            </p>
          </div>

          {/* Benefits List */}
          <div className='bg-gradient-to-r from-blue-50 to-purple-50 rounded-xl p-6 mb-8 border border-blue-100'>
            <div className='flex items-center gap-2 mb-4'>
              <Sparkles className='h-5 w-5 text-blue-600' />
              <span className='font-semibold text-blue-900'>
                Why add vacation periods?
              </span>
            </div>
            <div className='grid grid-cols-1 md:grid-cols-2 gap-3 text-sm text-blue-700'>
              <div className='flex items-center gap-2'>
                <div className='w-2 h-2 bg-blue-400 rounded-full'></div>
                <span>Apply special holiday rates</span>
              </div>
              <div className='flex items-center gap-2'>
                <div className='w-2 h-2 bg-purple-400 rounded-full'></div>
                <span>Manage seasonal pricing</span>
              </div>
              <div className='flex items-center gap-2'>
                <div className='w-2 h-2 bg-blue-400 rounded-full'></div>
                <span>Track vacation periods</span>
              </div>
              <div className='flex items-center gap-2'>
                <div className='w-2 h-2 bg-purple-400 rounded-full'></div>
                <span>Automate rate changes</span>
              </div>
            </div>
          </div>

          {/* Call to Action */}
          {onAddClick && (
            <Button
              onClick={onAddClick}
              className='gap-2 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-[1.02]'
              size='lg'
            >
              <Plus className='h-5 w-5' />
              Add Your First Vacation Period
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default VacationEmptyState;
