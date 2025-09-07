import { useState, useEffect } from 'react';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Car, CheckCircle, AlertCircle } from 'lucide-react';
import { useDebounce } from '@/hooks/useDebounce';

interface SubscriptionData {
  userName: string;
  category: string;
}

interface SubscriptionVerificationProps {
  subscriptionId: string;
  onSubscriptionIdChange: (id: string) => void;
  subscriptionData?: SubscriptionData;
  subscriptionError?: boolean;
}

export const SubscriptionVerification = ({
  subscriptionId,
  onSubscriptionIdChange,
  subscriptionData,
  subscriptionError,
}: SubscriptionVerificationProps) => {
  const [inputValue, setInputValue] = useState(subscriptionId);
  const debouncedValue = useDebounce(inputValue, 2000); // 2000ms delay

  useEffect(() => {
    onSubscriptionIdChange(debouncedValue);
  }, [debouncedValue, onSubscriptionIdChange]);

  useEffect(() => {
    if (subscriptionId !== inputValue) {
      setInputValue(subscriptionId);
    }
  }, [subscriptionId]);

  return (
    <Card variant='interactive' className='mb-8 animate-fade-in-up'>
      <CardHeader>
        <CardTitle className='flex items-center'>
          <Car className='h-5 w-5 mr-2' />
          Subscription Verification
        </CardTitle>
        <CardDescription>
          Enter your subscription ID to access reserved parking zones
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className='space-y-4'>
          <Input
            label='Subscription ID'
            variant='modern'
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            placeholder='Enter your subscription ID'
          />

          {subscriptionData && debouncedValue && !subscriptionError && (
            <div className='flex items-center space-x-2 p-3 bg-success/10 rounded-xl'>
              <CheckCircle className='h-5 w-5 text-success' />
              <div>
                <p className='font-medium text-success'>Valid Subscription</p>
                <p className='text-sm text-muted-foreground'>
                  Welcome back, {subscriptionData.userName} (
                  {subscriptionData.category})
                </p>
              </div>
            </div>
          )}

          {subscriptionError && debouncedValue && (
            <div className='flex items-center space-x-2 p-3 bg-destructive/10 rounded-xl'>
              <AlertCircle className='h-5 w-5 text-destructive' />
              <div>
                <p className='font-medium text-destructive'>
                  Invalid Subscription
                </p>
                <p className='text-sm text-muted-foreground'>
                  Please check your subscription ID and try again
                </p>
              </div>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};
