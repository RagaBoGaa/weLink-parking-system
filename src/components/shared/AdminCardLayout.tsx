import { ReactNode } from 'react';
import { LucideIcon } from 'lucide-react';
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from '@/components/ui/card';
import LoadingIndicator from '@/components/LoadingIndicator';
import ErrorComponent from './ErrorComponent';

interface AdminCardLayoutProps {
  title: string;
  description: string;
  icon: LucideIcon;
  iconColor?: string;
  isLoading?: boolean;
  error?: any;
  onRetry?: () => void;
  children: ReactNode;
  className?: string;
  headerActions?: ReactNode;
}

export const AdminCardLayout = ({
  title,
  description,
  icon: Icon,
  iconColor = 'from-blue-500 to-blue-600',
  isLoading = false,
  error,
  onRetry,
  children,
  className = '',
  headerActions,
}: AdminCardLayoutProps) => {
  if (isLoading) {
    return <LoadingIndicator />;
  }

  if (error) {
    return <ErrorComponent error={error} onRetry={onRetry} />;
  }

  return (
    <Card variant='default' className={`px-4 ${className}`}>
      <CardHeader>
        <div className='flex items-center justify-between'>
          <div className='flex items-center gap-3'>
            <div
              className={`p-2 bg-gradient-to-br ${iconColor} rounded-lg text-white`}
            >
              <Icon className='h-5 w-5' />
            </div>
            <div>
              <CardTitle className='text-xl'>{title}</CardTitle>
              <CardDescription>{description}</CardDescription>
            </div>
          </div>
          {headerActions && (
            <div className='flex-shrink-0'>{headerActions}</div>
          )}
        </div>
      </CardHeader>
      <CardContent className='space-y-6'>{children}</CardContent>
    </Card>
  );
};
