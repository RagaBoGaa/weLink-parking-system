import { useState } from 'react';
import { Clock, Trash2, AlertTriangle, Timer } from 'lucide-react';
import { RushHour } from '@/types/parking';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';

interface RushHourItemProps {
  rushHour: RushHour;
  onDelete: (id: string, rushHour: RushHour) => void;
  className?: string;
}

const RushHourItem = ({ rushHour, onDelete, className }: RushHourItemProps) => {
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);

  const calculateDuration = () => {
    const start = new Date(`2000-01-01T${rushHour.from}:00`);
    const end = new Date(`2000-01-01T${rushHour.to}:00`);
    const diffMs = end.getTime() - start.getTime();
    const diffHours = diffMs / (1000 * 60 * 60);
    return diffHours;
  };

  const formatTime = (time: string) => {
    const [hours, minutes] = time.split(':');
    const hour24 = parseInt(hours);
    const hour12 = hour24 === 0 ? 12 : hour24 > 12 ? hour24 - 12 : hour24;
    const ampm = hour24 >= 12 ? 'PM' : 'AM';
    return `${hour12}:${minutes} ${ampm}`;
  };

  const getRushHourIntensity = () => {
    const duration = calculateDuration();
    if (duration >= 3) return 'high';
    if (duration >= 2) return 'medium';
    return 'low';
  };

  const intensity = getRushHourIntensity();
  const duration = calculateDuration();

  const intensityColors = {
    high: 'from-red-500 to-red-600 border-red-200 bg-red-50',
    medium: 'from-orange-500 to-orange-600 border-orange-200 bg-orange-50',
    low: 'from-green-500 to-green-600 border-green-200 bg-green-50',
  };

  const handleDelete = () => {
    onDelete(rushHour.id, rushHour);
    setShowDeleteDialog(false);
  };

  return (
    <>
      <div
        className={`group relative p-3 rounded-lg border transition-all duration-200 hover:shadow-md hover:-translate-y-0.5 ${intensityColors[intensity]} ${className}`}
      >
        {/* Intensity indicator */}
        <div
          className={`absolute top-2 right-2 w-2 h-2 rounded-full bg-gradient-to-br ${
            intensity === 'high'
              ? 'from-red-400 to-red-500'
              : intensity === 'medium'
              ? 'from-orange-400 to-orange-500'
              : 'from-green-400 to-green-500'
          }`}
        />

        <div className='flex items-center justify-between gap-3'>
          <div className='flex items-center gap-3 flex-1 min-w-0'>
            <div
              className={`p-1.5 rounded-md bg-gradient-to-br ${
                intensity === 'high'
                  ? 'from-red-500 to-red-600'
                  : intensity === 'medium'
                  ? 'from-orange-500 to-orange-600'
                  : 'from-green-500 to-green-600'
              } text-white flex-shrink-0`}
            >
              <Clock className='h-3 w-3' />
            </div>

            <div className='flex-1 min-w-0'>
              <div className='flex items-center gap-2 mb-1 flex-wrap'>
                <span className='font-semibold text-gray-900 text-base'>
                  {formatTime(rushHour.from)} - {formatTime(rushHour.to)}
                </span>
                <span
                  className={`px-2 py-0.5 rounded-full text-xs font-medium flex-shrink-0 ${
                    intensity === 'high'
                      ? 'bg-red-100 text-red-700'
                      : intensity === 'medium'
                      ? 'bg-orange-100 text-orange-700'
                      : 'bg-green-100 text-green-700'
                  }`}
                >
                  {intensity === 'high'
                    ? 'High'
                    : intensity === 'medium'
                    ? 'Medium'
                    : 'Low'}
                </span>
              </div>

              <div className='flex items-center gap-3 text-sm text-gray-600 flex-wrap'>
                <div className='flex items-center gap-1'>
                  <Timer className='h-3 w-3' />
                  <span>{duration}h</span>
                </div>
                <div className='flex items-center gap-1 text-xs'>
                  <span className='font-medium'>24h:</span>
                  <span className='font-mono'>
                    {rushHour.from} - {rushHour.to}
                  </span>
                </div>
              </div>
            </div>
          </div>

          <Button
            onClick={() => setShowDeleteDialog(true)}
            variant='outline'
            size='sm'
            className='gap-1 text-red-600 border-red-200 hover:bg-red-50 hover:border-red-300 opacity-0 group-hover:opacity-100 sm:opacity-100 transition-opacity duration-200 flex-shrink-0 h-8 px-2'
          >
            <Trash2 className='h-3 w-3' />
            <span className='hidden sm:inline'>Delete</span>
          </Button>
        </div>
      </div>

      {/* Delete Confirmation Dialog */}
      <Dialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <DialogContent className='sm:max-w-md mx-4'>
          <DialogHeader>
            <div className='flex items-center gap-3'>
              <div className='p-2 bg-red-100 rounded-lg'>
                <AlertTriangle className='h-5 w-5 text-red-600' />
              </div>
              <div>
                <DialogTitle>Delete Rush Hour</DialogTitle>
                <DialogDescription className='mt-1'>
                  This action cannot be undone.
                </DialogDescription>
              </div>
            </div>
          </DialogHeader>

          <div className='py-4'>
            <div className='p-4 bg-gray-50 rounded-lg border border-gray-200'>
              <div className='flex items-center gap-3'>
                <Clock className='h-4 w-4 text-gray-600' />
                <div>
                  <p className='font-medium text-gray-900'>
                    {formatTime(rushHour.from)} - {formatTime(rushHour.to)}
                  </p>
                  <p className='text-sm text-gray-600'>
                    Duration: {duration} hour{duration !== 1 ? 's' : ''}
                  </p>
                </div>
              </div>
            </div>
          </div>

          <DialogFooter className='flex-col sm:flex-row gap-2'>
            <Button
              variant='outline'
              onClick={() => setShowDeleteDialog(false)}
              className='w-full sm:w-auto'
            >
              Cancel
            </Button>
            <Button
              variant='destructive'
              onClick={handleDelete}
              className='gap-2 w-full sm:w-auto'
            >
              <Trash2 className='h-4 w-4' />
              Delete Rush Hour
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default RushHourItem;
