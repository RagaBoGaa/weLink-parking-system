// components/ui/loading.tsx
import React from 'react';
import { Loader2 } from 'lucide-react';
import clsx from 'clsx';

interface LoadingProps {
  text?: string;
  variant?: 'spinner' | 'dots' | 'pulse' | 'bars' | 'circle';
  size?: 'sm' | 'default' | 'lg' | 'xl';
  className?: string;
}

const Loading: React.FC<LoadingProps> = ({
  text,
  variant = 'spinner',
  size = 'default',
  className = '',
}) => {
  const sizeClasses: Record<NonNullable<LoadingProps['size']>, string> = {
    sm: 'h-4 w-4',
    default: 'h-6 w-6',
    lg: 'h-8 w-8',
    xl: 'h-12 w-12',
  };

  const renderLoader = () => {
    switch (variant) {
      case 'spinner':
        return (
          <Loader2
            className={clsx(
              'animate-spin text-primary',
              sizeClasses[size],
              className
            )}
          />
        );
      case 'dots':
        return (
          <div className={clsx('flex space-x-1', className)}>
            <span
              className={`h-2 w-2 rounded-full bg-primary animate-bounce`}
            />
            <span
              className={`h-2 w-2 rounded-full bg-primary animate-bounce [animation-delay:-.3s]`}
            />
            <span
              className={`h-2 w-2 rounded-full bg-primary animate-bounce [animation-delay:-.6s]`}
            />
          </div>
        );
      case 'pulse':
        return (
          <div
            className={clsx(
              'rounded-full bg-primary animate-pulse',
              sizeClasses[size],
              className
            )}
          />
        );
      case 'bars':
        return (
          <div className={clsx('flex space-x-1', className)}>
            {[...Array(3)].map((_, i) => (
              <span
                key={i}
                className={`h-4 w-1 bg-primary animate-[pulse_1s_ease-in-out_infinite]`}
                style={{ animationDelay: `${i * 0.2}s` }}
              />
            ))}
          </div>
        );
      case 'circle':
        return (
          <div
            className={clsx(
              'rounded-full border-4 border-primary border-t-transparent animate-spin',
              sizeClasses[size],
              className
            )}
          />
        );
      default:
        return null;
    }
  };

  return (
    <div className='flex flex-col items-center space-y-2'>
      {renderLoader()}
      {text && <span className='text-sm text-muted-foreground'>{text}</span>}
    </div>
  );
};

export default Loading;
