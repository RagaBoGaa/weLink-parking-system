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

interface BulkActionConfirmationProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  zones: Zone[];
  action: 'open' | 'close';
  isLoading: boolean;
}

const BulkActionConfirmation: React.FC<BulkActionConfirmationProps> =
  React.memo(({ isOpen, onClose, onConfirm, zones, action, isLoading }) => {
    if (zones.length === 0) return null;

    const hasOccupiedZones = zones.some((zone) => zone.occupied > 0);
    const isClosing = action === 'close';
    const totalOccupied = zones.reduce((sum, zone) => sum + zone.occupied, 0);
    const totalCapacity = zones.reduce((sum, zone) => sum + zone.totalSlots, 0);

    return (
      <Dialog open={isOpen} onOpenChange={onClose}>
        <DialogContent className='sm:max-w-lg max-h-[90vh] overflow-y-auto'>
          <DialogHeader>
            <DialogTitle className='flex items-center gap-3'>
              <div
                className={`flex-shrink-0 w-10 h-10 ${
                  isClosing && hasOccupiedZones
                    ? 'bg-orange-100'
                    : 'bg-blue-100'
                } rounded-full flex items-center justify-center`}
              >
                {isClosing && hasOccupiedZones ? (
                  <AlertTriangle className='h-5 w-5 text-orange-600' />
                ) : action === 'open' ? (
                  <Unlock className='h-5 w-5 text-blue-600' />
                ) : (
                  <Lock className='h-5 w-5 text-blue-600' />
                )}
              </div>
              <span>
                Confirm Bulk {action === 'open' ? 'Opening' : 'Closure'}
              </span>
            </DialogTitle>
          </DialogHeader>

          <div className='space-y-4'>
            <div>
              <p className='text-sm font-medium text-gray-900 mb-1'>
                {action === 'open' ? 'Open' : 'Close'} {zones.length} zone
                {zones.length !== 1 ? 's' : ''}?
              </p>
              <p className='text-sm text-gray-600'>
                This action will affect {zones.length} parking zone
                {zones.length !== 1 ? 's' : ''}
              </p>
            </div>

            {isClosing && hasOccupiedZones && (
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
                <p className='text-sm text-orange-700 mb-2'>
                  Some zones have occupied spaces ({totalOccupied} total
                  occupied). Closing these zones may prevent new entries but
                  won't affect existing vehicles.
                </p>
                <div className='text-xs text-orange-600'>
                  <span className='font-medium'>
                    Zones with occupied spaces:
                  </span>{' '}
                  <div className='mt-1 flex flex-wrap gap-1'>
                    {zones
                      .filter((z) => z.occupied > 0)
                      .map((z) => (
                        <span
                          key={z.id}
                          className='inline-block bg-orange-100 px-2 py-1 rounded text-xs'
                        >
                          {z.name}
                        </span>
                      ))}
                  </div>
                </div>
              </div>
            )}

            {/* Summary Statistics */}
            <div className='bg-gray-50 rounded-lg p-4'>
              <h4 className='text-sm font-medium text-gray-900 mb-3'>
                Summary
              </h4>
              <div className='grid grid-cols-3 gap-4 text-xs'>
                <div className='text-center'>
                  <div className='font-semibold text-blue-600 text-lg'>
                    {totalOccupied}
                  </div>
                  <div className='text-gray-600'>Total Occupied</div>
                </div>
                <div className='text-center'>
                  <div className='font-semibold text-green-600 text-lg'>
                    {totalCapacity - totalOccupied}
                  </div>
                  <div className='text-gray-600'>Total Available</div>
                </div>
                <div className='text-center'>
                  <div className='font-semibold text-purple-600 text-lg'>
                    {totalCapacity}
                  </div>
                  <div className='text-gray-600'>Total Capacity</div>
                </div>
              </div>
            </div>

            {/* Zone List */}
            <div className='max-h-32 overflow-y-auto'>
              <h5 className='text-xs font-medium text-gray-700 mb-2'>
                Affected Zones:
              </h5>
              <div className='space-y-1'>
                {zones.map((zone) => (
                  <div
                    key={zone.id}
                    className='flex flex-col sm:flex-row sm:justify-between sm:items-center text-xs p-2 bg-gray-50 rounded gap-1'
                  >
                    <span className='font-medium'>{zone.name}</span>
                    <span className='text-gray-500 text-right sm:text-left'>
                      {zone.occupied}/{zone.totalSlots} occupied
                    </span>
                  </div>
                ))}
              </div>
            </div>
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
                  {action === 'open'
                    ? `Open ${zones.length} Zone${
                        zones.length !== 1 ? 's' : ''
                      }`
                    : `Close ${zones.length} Zone${
                        zones.length !== 1 ? 's' : ''
                      }`}
                </>
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    );
  });

BulkActionConfirmation.displayName = 'BulkActionConfirmation';

export default BulkActionConfirmation;
