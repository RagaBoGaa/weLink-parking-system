import { Link } from 'react-router';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ArrowRight, MapPin, Car, ChevronRight, Zap } from 'lucide-react';

interface Gate {
  id: string;
  name: string;
  location: string;
  zoneIds: string[];
}

interface GateCardProps {
  gate: Gate;
  index: number;
}

export const GateCard = ({ gate, index }: GateCardProps) => {
  return (
    <Link
      to={`/gate/${gate.id}`}
      className={`group block animate-fade-in-up delay-${
        index * 100
      } hover:scale-[1.02] transition-all duration-500`}
    >
      <Card className='h-full relative overflow-hidden border-0 bg-gradient-to-br from-background via-background to-secondary/10 hover:shadow-2xl hover:shadow-primary/10 transition-all duration-500 group-hover:border-primary/30'>
        {/* Animated background elements */}
        <div className='absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-secondary/5 opacity-0 group-hover:opacity-100 transition-opacity duration-700' />
        <div className='absolute top-0 right-0 w-24 h-24 bg-primary/10 rounded-full blur-2xl opacity-0 group-hover:opacity-75 transition-opacity duration-500' />

        <CardHeader className='relative pb-3'>
          <div className='flex justify-between items-start mb-4'>
            {/* Icon */}
            <div className='relative'>
              <div className='p-3 bg-gradient-to-br from-primary via-primary/90 to-primary/70 rounded-xl text-white group-hover:scale-110 group-hover:rotate-3 transition-all duration-500 shadow-lg group-hover:shadow-xl group-hover:shadow-primary/25'>
                <Car className='h-6 w-6' />
              </div>
              <div className='absolute inset-0 bg-primary/30 blur-xl rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500' />

              {/* Status indicator */}
              <div className='absolute -top-1 -right-1 w-4 h-4 bg-green-500 rounded-full border-2 border-background flex items-center justify-center'>
                <Zap className='h-2 w-2 text-white animate-pulse' />
              </div>
            </div>

            {/* Arrow */}
            <div className='p-2 rounded-xl bg-muted/50 group-hover:bg-primary/10 transition-colors duration-300'>
              <ChevronRight className='h-5 w-5 text-muted-foreground group-hover:text-primary group-hover:translate-x-2 transition-all duration-300' />
            </div>
          </div>

          <div className='space-y-2'>
            <CardTitle className='text-xl font-bold group-hover:text-primary transition-colors duration-300 bg-gradient-to-r from-foreground to-foreground/80 bg-clip-text group-hover:from-primary group-hover:to-primary/80'>
              {gate.name}
            </CardTitle>

            <CardDescription className='flex items-center text-base font-medium group-hover:text-foreground/80 transition-colors duration-300'>
              <div className='p-1.5 bg-primary/10 rounded-lg mr-3 group-hover:bg-primary/20 transition-colors duration-300'>
                <MapPin className='h-4 w-4 text-primary' />
              </div>
              {gate.location}
            </CardDescription>
          </div>
        </CardHeader>

        <CardContent className='relative pt-0'>
          <div className='space-y-4'>
            {/* Zone Information */}
            <div className='flex items-center justify-between p-3 bg-muted/30 rounded-xl group-hover:bg-primary/5 transition-colors duration-300'>
              <span className='text-sm font-semibold text-muted-foreground group-hover:text-foreground transition-colors duration-300'>
                Connected Zones
              </span>
              <Badge
                variant='outline'
                className='bg-background/50 border-primary/20 text-primary font-bold px-3 py-1 group-hover:bg-primary/10 group-hover:scale-105 transition-all duration-300'
              >
                {gate.zoneIds.length} zones
              </Badge>
            </div>

            {/* CTA */}
            <div className='pt-3 border-t border-border/50 group-hover:border-primary/20 transition-colors duration-300'>
              <div className='flex items-center justify-between font-bold text-lg text-gray-800 group transition-all duration-500'>
                <span className='flex items-center space-x-2'>
                  <span className='relative'>
                    {/* Gradient text */}
                    <span className='bg-gradient-to-r from-primary to-blue-500 bg-clip-text text-transparent transition-all duration-500 group-hover:from-blue-500 group-hover:to-primary'>
                      Access Gate
                    </span>
                    {/* Underline slide */}
                    <span className='absolute left-0 -bottom-1 w-0 h-[2px] bg-primary transition-all duration-500 group-hover:w-full' />
                  </span>

                  <div className='w-2 h-2 bg-primary rounded-full animate-pulse' />
                </span>

                {/* Arrow animation */}
                <ArrowRight className='h-5 w-5 transform group-hover:translate-x-2 group-hover:scale-110 transition-all duration-300' />
              </div>

              <p className='text-sm text-muted-foreground mt-1.5 group-hover:text-foreground/70 transition-colors duration-300'>
                Click to start parking process
              </p>
            </div>
          </div>
        </CardContent>

        {/* Hover overlay */}
        <div className='absolute inset-0 bg-gradient-to-t from-primary/5 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none' />
      </Card>
    </Link>
  );
};
