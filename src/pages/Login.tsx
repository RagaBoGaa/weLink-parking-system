import { Link } from 'react-router';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';
import { LoginForm } from '@/components/auth/LoginForm';

const Login = () => {
  return (
    <div className='h-dvh flex items-center justify-center p-4 bg-gradient-to-br from-background via-background to-secondary/10'>
      <div className='w-full max-w-md space-y-8 relative z-10'>
        {/* Back Button */}
        <div className='flex items-center'>
          <Button variant='ghost' size='sm' asChild className='rounded-xl'>
            <Link to='/'>
              <ArrowLeft className='h-4 w-4 mr-2' />
              Back to Gates
            </Link>
          </Button>
        </div>

        {/* Login Card */}
        <Card variant='glass' className='border-0 shadow-2xl'>
          <CardHeader className='text-center'>
            <CardTitle className='text-2xl font-bold'>Staff Login</CardTitle>
            <CardDescription>
              Enter your credentials to access the system
            </CardDescription>
          </CardHeader>

          <CardContent>
            <LoginForm />
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Login;
