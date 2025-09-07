import React from 'react';
import { Lock, Unlock, AlertTriangle } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import Loading from '@/components/ui/loading';
import { Zone } from '@/types/parking';

interface ZoneActionConfirmationProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  zone: Zone | null;
  action: 'open' | 'close';
  isLoading: boolean;
}

const ZoneActionConfirmation: React.FC<ZoneActionConfirmationProps> =
  React.memo(({ isOpen, onClose, onConfirm, zone, action, isLoading }) => {
    if (!zone) return null;

    const hasOccupiedSpaces = zone.occupied > 0;
    const isClosing = action === 'close';

    return (
      <Dialog open={isOpen} onOpenChange={onClose}>
        <DialogContent className='sm:max-w-md'>
          <DialogHeader>
            <DialogTitle className='flex items-center gap-3'>
              <div
                className={`flex-shrink-0 w-10 h-10 ${
                  isClosing && hasOccupiedSpaces
                    ? 'bg-orange-100'
                    : 'bg-blue-100'
                } rounded-full flex items-center justify-center`}
              >
                {isClosing && hasOccupiedSpaces ? (
                  <AlertTriangle className='h-5 w-5 text-orange-600' />
                ) : action === 'open' ? (
                  <Unlock className='h-5 w-5 text-blue-600' />
                ) : (
                  <Lock className='h-5 w-5 text-blue-600' />
                )}
              </div>
              <span>{action === 'open' ? 'Open' : 'Close'} Zone</span>
            </DialogTitle>
          </DialogHeader>

          <div className='space-y-4'>
            <div>
              <p className='text-sm font-medium text-gray-900 mb-1'>
                {action === 'open' ? 'Open' : 'Close'} "{zone.name}"?
              </p>
              <p className='text-sm text-gray-600'>
                This will {action === 'open' ? 'allow' : 'prevent'} new vehicles{' '}
                {action === 'open' ? 'to enter' : 'from entering'} this zone.
              </p>
            </div>

            {/* Zone Information */}
            <div className='bg-gray-50 rounded-lg p-4'>
              <h4 className='text-sm font-medium text-gray-900 mb-3'>
                Zone Information
              </h4>
              <div className='space-y-2'>
                <div className='flex flex-col sm:flex-row sm:justify-between sm:items-center text-sm gap-1'>
                  <span className='text-gray-600'>Zone Name:</span>
                  <span className='font-medium'>{zone.name}</span>
                </div>
                <div className='flex flex-col sm:flex-row sm:justify-between sm:items-center text-sm gap-1'>
                  <span className='text-gray-600'>Current Status:</span>
                  <span
                    className={`font-medium ${
                      zone.open ? 'text-green-600' : 'text-red-600'
                    }`}
                  >
                    {zone.open ? 'Open' : 'Closed'}
                  </span>
                </div>
                <div className='flex flex-col sm:flex-row sm:justify-between sm:items-center text-sm gap-1'>
                  <span className='text-gray-600'>Occupied Spaces:</span>
                  <span className='font-medium'>
                    {zone.occupied}/{zone.totalSlots}
                  </span>
                </div>
                <div className='flex flex-col sm:flex-row sm:justify-between sm:items-center text-sm gap-1'>
                  <span className='text-gray-600'>Availability:</span>
                  <span className='font-medium text-blue-600'>
                    {zone.free} spaces free
                  </span>
                </div>
              </div>
            </div>

            {/* Warning for closing zone with occupied spaces */}
            {isClosing && hasOccupiedSpaces && (
              <div
                className='bg-orange-50 border border-orange-200 rounded-lg p-4'
                role='alert'
              >
                <div className='flex items-center mb-2'>
                  <AlertTriangle className='h-4 w-4 text-orange-600 mr-2' />
                  <span className='text-sm font-medium text-orange-800'>
                    Warning
                  </span>
                </div>
                <p className='text-sm text-orange-700'>
                  This zone currently has {zone.occupied} occupied space
                  {zone.occupied !== 1 ? 's' : ''}. Closing the zone will
                  prevent new entries but won't affect existing vehicles.
                </p>
              </div>
            )}

            {/* Success message for opening */}
            {action === 'open' && (
              <div className='bg-green-50 border border-green-200 rounded-lg p-4'>
                <div className='flex items-center mb-2'>
                  <Unlock className='h-4 w-4 text-green-600 mr-2' />
                  <span className='text-sm font-medium text-green-800'>
                    Ready to Open
                  </span>
                </div>
                <p className='text-sm text-green-700'>
                  Opening this zone will allow new vehicles to enter and use the
                  available {zone.free} parking space
                  {zone.free !== 1 ? 's' : ''}.
                </p>
              </div>
            )}
          </div>

          <DialogFooter className='gap-2 sm:gap-0'>
            <Button
              onClick={onClose}
              variant='outline'
              disabled={isLoading}
              className='w-full sm:w-auto'
            >
              Cancel
            </Button>
            <Button
              onClick={onConfirm}
              disabled={isLoading}
              className={`w-full sm:w-auto ${
                action === 'open'
                  ? 'bg-green-600 hover:bg-green-700'
                  : 'bg-red-600 hover:bg-red-700'
              }`}
            >
              {isLoading ? (
                <>
                  <Loading size='sm' />
                  <span className='ml-2'>
                    {action === 'open' ? 'Opening...' : 'Closing...'}
                  </span>
                </>
              ) : (
                <>
                  {action === 'open' ? (
                    <Unlock className='h-4 w-4 mr-2' />
                  ) : (
                    <Lock className='h-4 w-4 mr-2' />
                  )}
                  {action === 'open' ? 'Open Zone' : 'Close Zone'}
                </>
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    );
  });

ZoneActionConfirmation.displayName = 'ZoneActionConfirmation';

export default ZoneActionConfirmation;
