import { Link } from 'react-router';
import { LogOut, User, Home, MapPin, Shield } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { User as UserType, NavigationItem } from './types';

interface MobileMenuProps {
  isOpen: boolean;
  navigationItems: NavigationItem[];
  isAuthenticated: boolean;
  user: UserType | null;
  onClose: () => void;
  onLogout: () => void;
}

const iconMap = {
  Home: Home,
  MapPin: MapPin,
  Shield: Shield,
};

const MobileMenu = ({
  isOpen,
  navigationItems,
  isAuthenticated,
  user,
  onClose,
  onLogout,
}: MobileMenuProps) => {
  if (!isOpen) return null;

  return (
    <div className='md:hidden bg-background/95 backdrop-blur-xl border-t animate-fade-in-down'>
      <div className='container mx-auto px-4 py-4 space-y-4'>
        {/* Mobile Navigation */}
        <nav className='space-y-2'>
          {navigationItems.map((item) => {
            const Icon = iconMap[item.icon as keyof typeof iconMap];
            return (
              <Link
                key={item.href}
                to={item.href}
                onClick={onClose}
                className='flex items-center space-x-3 px-4 py-3 rounded-xl hover:bg-accent/50 transition-all duration-200'
              >
                <Icon className='h-5 w-5' />
                <span className='font-medium'>{item.label}</span>
              </Link>
            );
          })}
        </nav>

        {/* Mobile User Section */}
        {isAuthenticated ? (
          <div className='pt-4 border-t space-y-3'>
            <div className='flex items-center space-x-3 px-4 py-2'>
              <div className='h-10 w-10 rounded-full bg-gradient-primary flex items-center justify-center'>
                <User className='h-5 w-5 text-white' />
              </div>
              <div>
                <p className='font-medium text-foreground'>{user?.username}</p>
                <Badge variant='outline' size='sm'>
                  {user?.role}
                </Badge>
              </div>
            </div>
            <div className='space-y-2'>
              <Link
                to='/profile'
                onClick={onClose}
                className='flex items-center space-x-3 px-4 py-3 rounded-xl hover:bg-accent/50 transition-all duration-200'
              >
                <User className='h-5 w-5' />
                <span className='font-medium'>Profile</span>
              </Link>
              <button
                onClick={onLogout}
                className='w-full flex items-center space-x-3 px-4 py-3 rounded-xl hover:bg-destructive/10 text-destructive transition-all duration-200'
              >
                <LogOut className='h-5 w-5' />
                <span className='font-medium'>Logout</span>
              </button>
            </div>
          </div>
        ) : (
          <div className='pt-4 border-t space-y-2'>
            <Link to='/login' onClick={onClose} className='block w-full'>
              <Button className='w-full rounded-xl'>Login / Get Started</Button>
            </Link>
          </div>
        )}
      </div>
    </div>
  );
};
export default MobileMenu;
