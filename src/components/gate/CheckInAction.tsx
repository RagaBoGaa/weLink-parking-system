import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { RefreshCw, ArrowRight } from 'lucide-react';
import { Zone } from '@/types/parking';
import { TabType } from './TabNavigation';

interface CheckInActionProps {
  selectedZone: Zone | null;
  activeTab: TabType;
  isLoading: boolean;
  onCheckin: () => void;
}

export const CheckInAction = ({
  selectedZone,
  activeTab,
  isLoading,
  onCheckin,
}: CheckInActionProps) => {
  if (!selectedZone) return null;

  return (
    <Card variant='gradient' className='animate-scale-in'>
      <CardContent className='p-6'>
        <div className='flex flex-col sm:flex-row justify-between items-start sm:items-center space-y-4 sm:space-y-0'>
          <div className='text-white'>
            <h3 className='text-lg font-semibold mb-1'>Ready to Check In</h3>
            <p className='opacity-90'>
              Zone: {selectedZone.name} •{' '}
              {activeTab === 'visitor'
                ? `$${selectedZone.rateNormal}/hour`
                : `Subscription parking`}
            </p>
          </div>
          <Button
            onClick={onCheckin}
            disabled={isLoading}
            size='lg'
            variant='secondary'
            className='w-full sm:w-auto rounded-xl'
          >
            {isLoading ? (
              <>
                <RefreshCw className='h-4 w-4 mr-2 animate-spin' />
                Processing...
              </>
            ) : (
              <>
                Check In
                <ArrowRight className='h-4 w-4 ml-2' />
              </>
            )}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};
