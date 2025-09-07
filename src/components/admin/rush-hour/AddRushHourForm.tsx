import { useState } from 'react';
import { toast } from 'react-hot-toast';
import { Clock, Plus, Loader2, RotateCcw } from 'lucide-react';

import { useCreateRushHourMutation } from '@/api/cruds';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

interface AddRushHourFormProps {
  className?: string;
}

const AddRushHourForm = ({ className }: AddRushHourFormProps) => {
  const [newRushHour, setNewRushHour] = useState({
    weekDay: 1,
    from: '07:00',
    to: '09:00',
  });

  const [createRushHour, { isLoading: createRushLoading }] =
    useCreateRushHourMutation();

  const weekDays = [
    'Sunday',
    'Monday',
    'Tuesday',
    'Wednesday',
    'Thursday',
    'Friday',
    'Saturday',
  ];

  const handleCreateRushHour = async () => {
    // Validation
    if (newRushHour.from >= newRushHour.to) {
      toast.error('Start time must be before end time');
      return;
    }

    // Check for duplicate time overlap (basic validation)
    if (newRushHour.from === newRushHour.to) {
      toast.error('Start and end time cannot be the same');
      return;
    }

    try {
      await createRushHour(newRushHour).unwrap();
      toast.success('Rush hour created successfully');
      resetForm();
    } catch (error: any) {
      toast.error(error?.data?.message || 'Failed to create rush hour');
    }
  };

  const resetForm = () => {
    setNewRushHour({ weekDay: 1, from: '07:00', to: '09:00' });
  };

  const calculateDuration = () => {
    if (
      newRushHour.from &&
      newRushHour.to &&
      newRushHour.from < newRushHour.to
    ) {
      const start = new Date(`2000-01-01T${newRushHour.from}:00`);
      const end = new Date(`2000-01-01T${newRushHour.to}:00`);
      const diffMs = end.getTime() - start.getTime();
      const diffHours = diffMs / (1000 * 60 * 60);
      return diffHours;
    }
    return 0;
  };

  const duration = calculateDuration();

  return (
    <Card
      variant='default'
      className={`border-dashed border-2 border-purple-200 bg-gradient-to-br from-purple-50/50 to-blue-50/50 ${className}`}
    >
      <CardContent className='pt-6'>
        <div className='flex items-center gap-2 mb-6'>
          <div className='p-2 bg-gradient-to-br from-purple-500 to-purple-600 rounded-lg text-white'>
            <Plus className='h-4 w-4' />
          </div>
          <div>
            <h3 className='font-semibold text-gray-900'>Add New Rush Hour</h3>
            <p className='text-sm text-gray-500'>
              Configure peak hour pricing periods
            </p>
          </div>
        </div>

        <div className='space-y-4'>
          <div className='grid grid-cols-1 md:grid-cols-3 gap-4'>
            <div className='space-y-2'>
              <label className='block text-sm font-medium text-gray-700'>
                Day of Week
              </label>
              <select
                value={newRushHour.weekDay}
                onChange={(e) =>
                  setNewRushHour({
                    ...newRushHour,
                    weekDay: parseInt(e.target.value),
                  })
                }
                className='w-full rounded-xl border border-input bg-background px-4 py-3 text-sm ring-offset-background focus:ring-2 focus:ring-purple-500 focus:ring-offset-2 focus:border-purple-500 transition-all duration-200'
              >
                {weekDays.map((day, index) => (
                  <option key={index} value={index}>
                    {day}
                  </option>
                ))}
              </select>
            </div>

            <Input
              label='Start Time'
              type='time'
              value={newRushHour.from}
              onChange={(e) =>
                setNewRushHour({ ...newRushHour, from: e.target.value })
              }
              icon={<Clock className='h-4 w-4' />}
              variant='modern'
            />

            <Input
              label='End Time'
              type='time'
              value={newRushHour.to}
              onChange={(e) =>
                setNewRushHour({ ...newRushHour, to: e.target.value })
              }
              icon={<Clock className='h-4 w-4' />}
              variant='modern'
            />
          </div>

          {/* Duration Preview */}
          {duration > 0 && (
            <div className='p-3 bg-purple-50 rounded-lg border border-purple-100'>
              <div className='flex items-center gap-2 text-sm'>
                <Clock className='h-4 w-4 text-purple-600' />
                <span className='text-purple-700'>
                  Duration:{' '}
                  <span className='font-semibold'>
                    {duration} hour{duration !== 1 ? 's' : ''}
                  </span>{' '}
                  on {weekDays[newRushHour.weekDay]}
                </span>
              </div>
            </div>
          )}

          <div className='flex gap-3 pt-2'>
            <Button
              onClick={handleCreateRushHour}
              disabled={createRushLoading || duration <= 0}
              className='gap-2 flex-1 bg-gradient-to-r from-purple-600 to-purple-700 hover:from-purple-700 hover:to-purple-800'
            >
              {createRushLoading ? (
                <Loader2 className='h-4 w-4 animate-spin' />
              ) : (
                <Plus className='h-4 w-4' />
              )}
              {createRushLoading ? 'Adding...' : 'Add Rush Hour'}
            </Button>

            <Button
              onClick={resetForm}
              variant='outline'
              size='default'
              className='gap-2 border-purple-200 text-purple-700 hover:bg-purple-50'
            >
              <RotateCcw className='h-4 w-4' />
              Reset
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default AddRushHourForm;
