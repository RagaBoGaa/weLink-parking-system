import { Link } from 'react-router';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ArrowRight, MapPin, Shield, Zap } from 'lucide-react';
import { StatsGrid } from './StatsGrid';

interface HeroSectionProps {
  isAuthenticated: boolean;
  user?: {
    role: string;
    username: string;
  } | null;
  gatesCount: number;
  totalZones: number;
}

export const HeroSection = ({
  isAuthenticated,
  user,
  gatesCount,
  totalZones,
}: HeroSectionProps) => {
  const stats = [
    { label: 'Active Gates', value: gatesCount, suffix: '' },
    { label: 'Total Zones', value: totalZones, suffix: '' },
    { label: 'Security Level', value: '24', suffix: '/7' },
    { label: 'Uptime', value: '99.9', suffix: '%' },
  ];

  return (
    <section className='relative overflow-hidden bg-gradient-to-br from-background via-background to-secondary/5 min-h-[80vh] flex items-center'>
      {/* Animated background elements */}
      <div className='absolute inset-0 bg-grid opacity-20' />
      <div className='absolute inset-0'>
        <div className='absolute top-20 left-20 w-64 h-64 bg-blue-100 rounded-full blur-3xl animate-pulse ' />
        <div className='absolute bottom-20 right-20 w-80 h-80 bg-blue-100 rounded-full blur-3xl animate-pulse delay-1000' />
      </div>

      <div className='relative container mx-auto px-4 py-16 '>
        <div className='text-center space-y-12'>
          {/* Header Content */}
          <div className='space-y-6'>
            <Badge
              variant='outline'
              className='mx-auto w-fit animate-fade-in-up hover:scale-105 transition-transform duration-300 border-primary/20 bg-primary/5'
            >
              <Zap className='h-3 w-3 mr-2 text-primary animate-pulse' />
              Next-Gen Parking System
            </Badge>

            <div className='space-y-4'>
              <h1 className='text-4xl sm:text-6xl lg:text-8xl font-bold tracking-tight animate-fade-in-up delay-100'>
                <span className='bg-gradient-to-r from-primary via-primary/90 to-primary/70 bg-clip-text text-transparent animate-gradient-x'>
                  WeLink Cargo
                </span>
                <br />
                <span className='text-foreground/90 font-light'>
                  Parking System
                </span>
              </h1>

              <p className='mx-auto max-w-3xl text-lg sm:text-xl lg:text-2xl text-muted-foreground animate-fade-in-up delay-200 leading-relaxed'>
                Experience the future of parking management with{' '}
                <span className='text-primary font-medium'>
                  real-time availability
                </span>
                ,{' '}
                <span className='text-primary font-medium'>secure access</span>,
                and{' '}
                <span className='text-primary font-medium'>
                  seamless automation
                </span>{' '}
                for all users.
              </p>
            </div>
          </div>

          {/* CTA Buttons */}
          <div className='flex flex-col sm:flex-row gap-6 justify-center items-center animate-fade-in-up delay-300'>
            {!isAuthenticated ? (
              <>
                <Button
                  size='lg'
                  className='group relative overflow-hidden rounded-2xl px-8 py-4 text-lg font-semibold shadow-2xl hover:shadow-primary/25 transition-all duration-500 hover:scale-105 bg-gradient-to-r from-primary to-primary/90 hover:from-primary/90 hover:to-primary'
                >
                  <span className='relative z-10 flex items-center'>
                    Select Gate to Start
                    <ArrowRight className='ml-3 h-5 w-5 group-hover:translate-x-1 transition-transform duration-300' />
                  </span>
                  <div className='absolute inset-0 bg-gradient-to-r from-white/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300' />
                </Button>

                <Button
                  variant='outline'
                  size='lg'
                  asChild
                  className='group rounded-2xl px-8 py-4 text-lg font-semibold border-2 hover:border-primary/50 hover:bg-primary/5 transition-all duration-300 hover:scale-105'
                >
                  <Link to='/login' className='flex items-center'>
                    <Shield className='mr-3 h-5 w-5 group-hover:rotate-12 transition-transform duration-300' />
                    Staff Login
                  </Link>
                </Button>
              </>
            ) : (
              <div className='flex flex-col sm:flex-row gap-6'>
                {user?.role === 'admin' && (
                  <Button
                    size='lg'
                    asChild
                    className='group rounded-2xl px-8 py-4 text-lg font-semibold shadow-2xl hover:shadow-primary/25 transition-all duration-500 hover:scale-105'
                  >
                    <Link to='/admin' className='flex items-center'>
                      <Shield className='mr-3 h-5 w-5 group-hover:rotate-12 transition-transform duration-300' />
                      Admin Dashboard
                    </Link>
                  </Button>
                )}
                {(user?.role === 'employee' || user?.role === 'admin') && (
                  <Button
                    variant='outline'
                    size='lg'
                    asChild
                    className='group rounded-2xl px-8 py-4 text-lg font-semibold border-2 hover:border-primary/50 hover:bg-primary/5 transition-all duration-300 hover:scale-105'
                  >
                    <Link to='/checkpoint' className='flex items-center'>
                      <MapPin className='mr-3 h-5 w-5 group-hover:bounce transition-transform duration-300' />
                      Checkpoint Access
                    </Link>
                  </Button>
                )}
              </div>
            )}
          </div>

          {/*  Stats Grid */}
          <StatsGrid
            stats={stats}
            className='mt-20 animate-fade-in-up delay-500'
          />
        </div>
      </div>
    </section>
  );
};
