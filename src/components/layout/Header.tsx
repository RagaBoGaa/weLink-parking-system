import { useState, useEffect } from 'react';
import { useTypedSelector } from '@/api/store/store';
import { useDispatch } from 'react-redux';
import { logout } from '@/state/auth';
import { toast } from 'react-hot-toast';
import { useNavigate } from 'react-router';
import { AuthAPI } from '@/api/cruds/auth/auth';
import { Button } from '@/components/ui/button';
import { Menu, X } from 'lucide-react';
import MobileMenu from './MobileMenu';
import Logo from './Logo';
import Navigation from './Navigation';
import UserMenu from './UserMenu';

const Header = () => {
  const { isAuthenticated, user } = useTypedSelector((state) => state.auth);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleLogout = () => {
    dispatch(logout());
    dispatch(AuthAPI.util.resetApiState());
    toast.success('Logged out successfully');
    navigate('/');
    setIsMobileMenuOpen(false);
  };

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  const closeMobileMenu = () => {
    setIsMobileMenuOpen(false);
  };

  const navigationItems = [
    { label: 'Gates', href: '/', icon: 'Home', show: true },
    {
      label: 'Checkpoint',
      href: '/checkpoint',
      icon: 'MapPin',
      show:
        isAuthenticated &&
        (user?.role === 'employee' || user?.role === 'admin'),
    },
    {
      label: 'Admin Dashboard',
      href: '/admin',
      icon: 'Shield',
      show: isAuthenticated && user?.role === 'admin',
    },
  ].filter((item) => item.show);

  return (
    <header
      className={`sticky top-0 z-50 transition-all duration-300 border-b ${
        isScrolled
          ? 'bg-background/80 backdrop-blur-xl border-b shadow-soft'
          : 'bg-transparent'
      }`}
    >
      <div className='container mx-auto px-4 sm:px-6 lg:px-8'>
        <div className='flex justify-between items-center h-16 sm:h-18'>
          <Logo onLogoClick={closeMobileMenu} />

          <Navigation items={navigationItems} />

          <div className='flex items-center space-x-3'>
            <UserMenu
              isAuthenticated={isAuthenticated}
              user={user}
              onLogout={handleLogout}
            />

            {/* Mobile Menu Button */}
            <Button
              variant='ghost'
              size='icon'
              onClick={toggleMobileMenu}
              className='md:hidden rounded-xl'
            >
              {isMobileMenuOpen ? (
                <X className='h-5 w-5' />
              ) : (
                <Menu className='h-5 w-5' />
              )}
            </Button>
          </div>
        </div>
      </div>

      <MobileMenu
        isOpen={isMobileMenuOpen}
        navigationItems={navigationItems}
        isAuthenticated={isAuthenticated}
        user={user}
        onClose={closeMobileMenu}
        onLogout={handleLogout}
      />
    </header>
  );
};
export default Header;
