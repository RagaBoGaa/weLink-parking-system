import Loading from '@/components/ui/loading';

interface LoadingIndicatorProps {
  text?: string;
  variant?: 'spinner' | 'dots' | 'pulse' | 'bars' | 'circle';
  size?: 'sm' | 'default' | 'lg' | 'xl';
  fullScreen?: boolean;
  className?: string;
}

const LoadingIndicator = ({
  text,
  variant = 'spinner',
  size = 'lg',
  fullScreen = true,
  className = '',
}: LoadingIndicatorProps) => {
  if (fullScreen) {
    return (
      <div className='flex justify-center items-center h-screen bg-background/80 backdrop-blur-sm'>
        <div className='flex flex-col items-center space-y-4 p-8 bg-card rounded-2xl shadow-large border'>
          <Loading
            variant={variant}
            size={size}
            text={text}
            className={className}
          />
        </div>
      </div>
    );
  }

  return (
    <Loading variant={variant} size={size} text={text} className={className} />
  );
};

export default LoadingIndicator;
