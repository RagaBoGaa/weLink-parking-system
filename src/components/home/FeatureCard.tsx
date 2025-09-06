import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { LucideIcon } from 'lucide-react';

interface Feature {
  icon: LucideIcon;
  title: string;
  description: string;
}

interface FeatureCardProps {
  feature: Feature;
  index: number;
}

export const FeatureCard = ({ feature, index }: FeatureCardProps) => {
  const Icon = feature.icon;

  return (
    <Card
      className={`group relative overflow-hidden border-0 bg-gradient-to-br from-background via-background to-secondary/10 hover:shadow-2xl hover:shadow-primary/5 transition-all duration-700 hover:scale-105 animate-fade-in-up delay-${
        index * 150
      }`}
    >
      {/* Animated background elements */}
      <div className='absolute inset-0 bg-gradient-to-br from-primary/3 via-transparent to-secondary/5 opacity-0 group-hover:opacity-100 transition-opacity duration-700' />
      <div className='absolute -top-10 -right-10 w-32 h-32 bg-primary/5 rounded-full blur-3xl opacity-0 group-hover:opacity-75 transition-opacity duration-700' />
      <div className='absolute -bottom-10 -left-10 w-24 h-24 bg-secondary/10 rounded-full blur-2xl opacity-0 group-hover:opacity-50 transition-opacity duration-700' />

      <CardHeader className='relative text-center pb-6'>
        {/*  Icon Container */}
        <div className='mx-auto mb-6 relative'>
          <div className='w-20 h-20 bg-gradient-to-br from-primary via-primary/90 to-primary/70 rounded-3xl flex items-center justify-center shadow-lg group-hover:shadow-2xl group-hover:shadow-primary/25 transition-all duration-500 group-hover:scale-110 group-hover:rotate-3'>
            <Icon className='h-10 w-10 text-white group-hover:scale-110 transition-transform duration-300' />
          </div>

          {/* Glow effect */}
          <div className='absolute inset-0 bg-primary/30 blur-2xl rounded-3xl opacity-0 group-hover:opacity-75 transition-opacity duration-500' />

          {/* Floating particles effect */}
          <div className='absolute top-0 right-0 w-2 h-2 bg-primary/60 rounded-full opacity-0 group-hover:opacity-100 group-hover:animate-ping transition-opacity duration-300' />
          <div className='absolute bottom-2 left-2 w-1.5 h-1.5 bg-secondary/60 rounded-full opacity-0 group-hover:opacity-100 group-hover:animate-pulse transition-opacity duration-300 delay-200' />
        </div>

        <CardTitle className='text-xl font-bold group-hover:text-primary transition-colors duration-300 bg-gradient-to-r from-foreground to-foreground/90 bg-clip-text group-hover:from-primary group-hover:to-primary/80'>
          {feature.title}
        </CardTitle>
      </CardHeader>

      <CardContent className='relative text-center px-6'>
        <CardDescription className='text-base leading-relaxed group-hover:text-foreground/80 transition-colors duration-300'>
          {feature.description}
        </CardDescription>

        {/* Decorative bottom border */}
        <div className='mt-6 h-1 bg-gradient-to-r from-transparent via-primary/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500' />
      </CardContent>

      {/* Hover overlay */}
      <div className='absolute inset-0 bg-gradient-to-t from-primary/5 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none' />
    </Card>
  );
};
