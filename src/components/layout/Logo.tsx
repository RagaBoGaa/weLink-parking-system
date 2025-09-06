import { Link } from 'react-router';
import { Car } from 'lucide-react';

interface LogoProps {
  onLogoClick: () => void;
}

const Logo = ({ onLogoClick }: LogoProps) => {
  return (
    <div className='flex items-center'>
      <Link to='/' className='flex items-center group' onClick={onLogoClick}>
        <div className='relative p-2 bg-gradient-primary rounded-xl shadow-colored group-hover:shadow-xl transition-all duration-300 group-hover:scale-105'>
          <Car className='size-6 sm:size-7 text-white' />
        </div>
        <div className='ml-3 sm:ml-4'>
          <h1 className='text-xl sm:text-2xl font-bold gradient-text'>
            WeLink Cargo
          </h1>
          <p className='text-xs sm:text-sm text-muted-foreground hidden sm:block'>
            Parking System
          </p>
        </div>
      </Link>
    </div>
  );
};
export default Logo;
