import { cn } from '@/lib/utils';

interface Stat {
  label: string;
  value: number | string;
  suffix: string;
}

interface StatsGridProps {
  stats: Stat[];
  className?: string;
}

export const StatsGrid = ({ stats, className }: StatsGridProps) => {
  return (
    <div className={cn('grid grid-cols-2 md:grid-cols-4 gap-8', className)}>
      {stats.map((stat, index) => (
        <div
          key={index}
          className={`group text-center animate-fade-in-up delay-${
            index * 100
          } hover:scale-105 transition-all duration-300`}
        >
          <div className='relative'>
            <div className='text-3xl sm:text-4xl lg:text-5xl font-bold bg-gradient-to-b from-primary to-primary/70 bg-clip-text text-transparent group-hover:from-primary/90 group-hover:to-primary transition-all duration-300'>
              {stat.value}
              <span className='text-primary/60'>{stat.suffix}</span>
            </div>
            <div className='absolute inset-0 bg-primary/10 blur-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-full' />
          </div>
          <div className='mt-2 text-sm sm:text-base text-muted-foreground font-medium group-hover:text-foreground transition-colors duration-300'>
            {stat.label}
          </div>
          <div className='mt-1 h-0.5 bg-gradient-to-r from-transparent via-primary/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500' />
        </div>
      ))}
    </div>
  );
};
