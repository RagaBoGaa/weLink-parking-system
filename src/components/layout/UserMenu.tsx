import { Link } from 'react-router';
import { LogOut, User } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { User as UserType } from './types';
import { useState } from 'react';

interface UserMenuProps {
  isAuthenticated: boolean;
  user: UserType | null;
  onLogout: () => void;
}

const UserMenu = ({ isAuthenticated, user, onLogout }: UserMenuProps) => {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  if (isAuthenticated) {
    return (
      <div className='flex items-center space-x-3'>
        {/* Desktop User Info */}
        <div className='hidden lg:flex items-center space-x-4'>
          <Link
            to='/profile'
            className='group flex items-center space-x-3 rounded-xl p-2 transition-all duration-200 hover:bg-accent/50'
          >
            {/* Enhanced Avatar - Now on the left */}
            <div className='relative'>
              <div className='size-8 rounded-full bg-gradient-primary flex items-center justify-center shadow-lg group-hover:shadow-colored transition-all duration-300 group-hover:scale-105'>
                <User className='size-4 text-white' />
              </div>
              {/* Online Status Indicator */}
              <div className='absolute -bottom-0.5 -right-0.5 h-3 w-3 bg-success rounded-full border-2 border-background animate-pulse-soft'></div>
            </div>

            <div className='text-left'>
              <p className='text-sm font-semibold text-foreground group-hover:text-primary transition-colors duration-200'>
                {user?.username}
              </p>
            </div>
          </Link>
        </div>

        {/* Mobile Menu Button */}
        <div className='lg:hidden relative'>
          <Button
            variant='ghost'
            size='sm'
            onClick={() => setIsDropdownOpen(!isDropdownOpen)}
            className='h-10 w-10 rounded-full p-0 hover:bg-accent/70 transition-all duration-200'
          >
            <div className='h-8 w-8 rounded-full bg-gradient-primary flex items-center justify-center'>
              <User className='h-4 w-4 text-white' />
            </div>
          </Button>

          {/* Mobile Dropdown */}
          {isDropdownOpen && (
            <>
              {/* Backdrop */}
              <div
                className='fixed inset-0 z-40'
                onClick={() => setIsDropdownOpen(false)}
              />

              {/* Dropdown Menu */}
              <div className='absolute right-0 top-12 z-50 w-64 animate-fade-in-down'>
                <div className='glass-card border-glass-border shadow-xl'>
                  <Link
                    to='/profile'
                    className='block p-4 border-b border-border/50 hover:bg-accent/50 transition-colors duration-200'
                    onClick={() => setIsDropdownOpen(false)}
                  >
                    <div className='flex items-center space-x-3'>
                      <div className='h-12 w-12 rounded-full bg-gradient-primary flex items-center justify-center'>
                        <User className='h-6 w-6 text-white' />
                      </div>
                      <div>
                        <p className='text-sm font-semibold text-foreground'>
                          {user?.username}
                        </p>
                        <Badge variant='gradient' size='sm' className='mt-1'>
                          {user?.role}
                        </Badge>
                      </div>
                    </div>
                  </Link>

                  <div className='p-2'>
                    <button
                      onClick={() => {
                        onLogout();
                        setIsDropdownOpen(false);
                      }}
                      className='flex items-center space-x-3 w-full p-3 text-left rounded-lg text-destructive hover:bg-destructive/10 transition-colors duration-200'
                    >
                      <LogOut className='h-4 w-4' />
                      <span className='text-sm font-medium'>Logout</span>
                    </button>
                  </div>
                </div>
              </div>
            </>
          )}
        </div>

        {/* Desktop Logout Button */}
        <div className='hidden md:flex items-center'>
          <Button
            variant='ghost'
            size='sm'
            onClick={onLogout}
            className='rounded-xl text-destructive hover:text-destructive hover:bg-destructive/10 transition-all duration-200 hover:scale-105'
          >
            <LogOut className='h-4 w-4 mr-2' />
            Logout
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className='flex items-center space-x-3'>
      <Button
        size='sm'
        asChild
        className='rounded-xl bg-gradient-primary border-0 shadow-lg hover:shadow-colored transition-all duration-300 hover:scale-105 animate-fade-in-right'
      >
        <Link to='/login' className='flex items-center space-x-2'>
          <User className='h-4 w-4' />
          <span className='hidden sm:inline'>Staff Login</span>
        </Link>
      </Button>
    </div>
  );
};

export default UserMenu;
