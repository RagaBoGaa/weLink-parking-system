import { forwardRef, useState } from 'react';
import { Input } from '@/components/ui/input';
import { Eye, EyeOff } from 'lucide-react';

interface PasswordInputProps {
  label?: string;
  placeholder?: string;
  error?: string;
  disabled?: boolean;
  name?: string;
}

export const PasswordInput = forwardRef<HTMLInputElement, PasswordInputProps>(
  ({ label, placeholder, error, disabled, name, ...props }, ref) => {
    const [showPassword, setShowPassword] = useState(false);

    return (
      <Input
        ref={ref}
        label={label}
        variant='modern'
        type={showPassword ? 'text' : 'password'}
        placeholder={placeholder}
        error={error}
        disabled={disabled}
        name={name}
        rightIcon={
          <button
            type='button'
            onClick={() => setShowPassword(!showPassword)}
            className='text-muted-foreground hover:text-foreground transition-colors'
          >
            {showPassword ? (
              <EyeOff className='h-4 w-4' />
            ) : (
              <Eye className='h-4 w-4' />
            )}
          </button>
        }
        {...props}
      />
    );
  }
);

PasswordInput.displayName = 'PasswordInput';
