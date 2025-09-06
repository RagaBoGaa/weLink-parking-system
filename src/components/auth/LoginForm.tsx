import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { toast } from 'react-hot-toast';
import Cookies from 'js-cookie';
import { useNavigate } from 'react-router';

import { useLoginMutation } from '@/api/cruds/auth/auth';
import { useAppDispatch } from '@/api/store/store';
import { setUser } from '@/state/auth';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { LogIn } from 'lucide-react';
import Loading from '@/components/ui/loading';
import { PasswordInput } from './PasswordInput';

const loginSchema = z.object({
  username: z.string().min(1, 'Username is required'),
  password: z.string().min(1, 'Password is required'),
});

type LoginForm = z.infer<typeof loginSchema>;

interface LoginFormProps {
  onSuccess?: () => void;
}

export const LoginForm = ({ onSuccess }: LoginFormProps) => {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const [login, { isLoading }] = useLoginMutation();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginForm>({
    resolver: zodResolver(loginSchema),
  });

  const onSubmit = async (data: LoginForm) => {
    try {
      const result = await login(data).unwrap();

      // Store token and user data
      Cookies.set('token', result.token);
      Cookies.set('user', JSON.stringify(result.user));

      // Update Redux state
      dispatch(setUser(result.user));

      toast.success('Login successful!');

      // Call onSuccess callback if provided
      if (onSuccess) {
        onSuccess();
      } else {
        // Default navigation based on role
        if (result.user.role === 'admin') {
          navigate('/admin');
        } else if (result.user.role === 'employee') {
          navigate('/checkpoint');
        } else {
          navigate('/');
        }
      }
    } catch (error: any) {
      console.error('Login failed:', error);
      toast.error(
        error?.data?.message || 'Login failed. Please check your credentials.'
      );
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className='space-y-6'>
      <Input
        label='Username'
        variant='modern'
        {...register('username')}
        placeholder='Enter your username'
        error={errors.username?.message}
        disabled={isLoading}
      />

      <PasswordInput
        label='Password'
        {...register('password')}
        placeholder='Enter your password'
        error={errors.password?.message}
        disabled={isLoading}
      />

      <Button
        type='submit'
        disabled={isLoading}
        className='w-full rounded-xl h-12 shadow-colored hover:shadow-xl transition-all duration-300'
      >
        {isLoading ? (
          <Loading variant='spinner' size='sm' />
        ) : (
          <>
            <LogIn className='h-4 w-4 mr-2' />
            Sign In
          </>
        )}
      </Button>
    </form>
  );
};
