import { Link } from 'react-router';
import { Home, MapPin, Shield } from 'lucide-react';
import { NavigationItem } from './types';

interface NavigationProps {
  items: NavigationItem[];
}

const iconMap = {
  Home: Home,
  MapPin: MapPin,
  Shield: Shield,
};

const Navigation = ({ items }: NavigationProps) => {
  return (
    <nav className='hidden md:flex items-center space-x-6'>
      {items.map((item) => {
        const Icon = iconMap[item.icon as keyof typeof iconMap];
        return (
          <Link
            key={item.href}
            to={item.href}
            className='nav-link group flex items-center space-x-2 px-4 py-2 rounded-xl hover:bg-accent/50 transition-all duration-200'
          >
            <Icon className='h-4 w-4' />
            <span>{item.label}</span>
          </Link>
        );
      })}
    </nav>
  );
};
export default Navigation;
