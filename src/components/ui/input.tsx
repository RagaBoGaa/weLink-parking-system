import * as React from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '@/lib/utils';

const inputVariants = cva(
  'flex w-full rounded-xl border border-input bg-background text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 transition-all duration-200',
  {
    variants: {
      variant: {
        default: 'px-4 py-3 focus:border-primary',
        modern:
          'px-4 py-3 bg-muted/50 border-transparent focus:bg-background focus:border-primary shadow-sm',
        glass:
          'px-4 py-3 bg-glass backdrop-blur-md border-glass-border focus:border-primary/50',
        floating: 'px-4 pt-6 pb-2 focus:border-primary',
      },
      size: {
        sm: 'h-9 px-3 text-xs',
        default: 'h-12 px-4',
        lg: 'h-14 px-6 text-base',
      },
    },
    defaultVariants: {
      variant: 'default',
      size: 'default',
    },
  }
);

export interface InputProps
  extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'size'>,
    VariantProps<typeof inputVariants> {
  label?: string;
  error?: string;
  icon?: React.ReactNode;
  rightIcon?: React.ReactNode;
}

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  (
    { className, variant, size, type, label, error, icon, rightIcon, ...props },
    ref
  ) => {
    const [isFocused, setIsFocused] = React.useState(false);
    const [hasValue, setHasValue] = React.useState(false);

    const handleFocus = () => setIsFocused(true);
    const handleBlur = (e: React.FocusEvent<HTMLInputElement>) => {
      setIsFocused(false);
      setHasValue(!!e.target.value);
      props.onBlur?.(e);
    };

    const isFloating = variant === 'floating';

    if (isFloating) {
      return (
        <div className='relative'>
          <div className='relative'>
            {icon && (
              <div className='absolute left-4 top-1/2 transform -translate-y-1/2 text-muted-foreground'>
                {icon}
              </div>
            )}
            <input
              type={type}
              className={cn(
                inputVariants({ variant, size, className }),
                icon && 'pl-12',
                rightIcon && 'pr-12',
                error && 'border-destructive focus:ring-destructive'
              )}
              ref={ref}
              onFocus={handleFocus}
              onBlur={handleBlur}
              {...props}
            />
            {rightIcon && (
              <div className='absolute right-4 top-1/2 transform -translate-y-1/2 text-muted-foreground'>
                {rightIcon}
              </div>
            )}
            {label && (
              <label
                className={cn(
                  'absolute left-4 text-muted-foreground transition-all duration-200 pointer-events-none',
                  isFocused || hasValue || props.value
                    ? 'top-2 text-xs text-primary'
                    : 'top-1/2 transform -translate-y-1/2 text-sm'
                )}
              >
                {label}
              </label>
            )}
          </div>
          {error && <p className='mt-2 text-sm text-destructive'>{error}</p>}
        </div>
      );
    }

    return (
      <div className='space-y-2'>
        {label && (
          <label className='text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70'>
            {label}
          </label>
        )}
        <div className='relative'>
          {icon && (
            <div className='absolute left-4 top-1/2 transform -translate-y-1/2 text-muted-foreground'>
              {icon}
            </div>
          )}
          <input
            type={type}
            className={cn(
              inputVariants({ variant, size, className }),
              icon && 'pl-12',
              rightIcon && 'pr-12',
              error && 'border-destructive focus:ring-destructive'
            )}
            ref={ref}
            {...props}
          />
          {rightIcon && (
            <div className='absolute right-4 top-1/2 transform -translate-y-1/2 text-muted-foreground'>
              {rightIcon}
            </div>
          )}
        </div>
        {error && <p className='text-sm text-destructive'>{error}</p>}
      </div>
    );
  }
);
Input.displayName = 'Input';

export { Input };
