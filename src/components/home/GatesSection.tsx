import {
  Card,
  CardContent,
  CardDescription,
  CardTitle,
} from '@/components/ui/card';
import { GateCard } from './GateCard';
import { ParkingCircle, Building2 } from 'lucide-react';

interface Gate {
  id: string;
  name: string;
  location: string;
  zoneIds: string[];
}

interface GatesSectionProps {
  gates: Gate[];
}

const GatesSection = ({ gates }: GatesSectionProps) => {
  return (
    <section className='container mx-auto px-4 py-16'>
      {/* Section Header */}
      <div className='text-center mb-16 space-y-6'>
        <div className='inline-flex items-center space-x-2 bg-primary/5 px-4 py-2 rounded-full border border-primary/20'>
          <Building2 className='h-5 w-5 text-primary' />
          <span className='text-primary font-semibold'>Gate Selection</span>
        </div>

        <h2 className='text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight'>
          <span className='bg-gradient-to-r from-foreground via-foreground/90 to-foreground/70 bg-clip-text text-transparent'>
            Available Gates
          </span>
        </h2>

        <p className='text-lg sm:text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed'>
          Select any gate below to begin your parking experience. Each gate
          provides secure access to multiple parking zones with real-time
          availability updates.
        </p>
      </div>
      {/* Stats Summary */}
      <div className='mb-8 pb-4 border-b border-border/50'>
        <div className='text-center space-y-4'>
          <h3 className='text-xl font-semibold text-muted-foreground'>
            System Overview
          </h3>
          <div className='flex flex-col sm:flex-row justify-center items-center space-y-2 sm:space-y-0 sm:space-x-8 text-sm text-muted-foreground'>
            <div className='flex items-center space-x-2'>
              <div className='w-2 h-2 bg-green-500 rounded-full animate-pulse' />
              <span>{gates.length} Active Gates</span>
            </div>
            <div className='flex items-center space-x-2'>
              <div className='w-2 h-2 bg-blue-500 rounded-full animate-pulse' />
              <span>
                {gates.reduce((acc, gate) => acc + gate.zoneIds.length, 0)}{' '}
                Total Zones
              </span>
            </div>
            <div className='flex items-center space-x-2'>
              <div className='w-2 h-2 bg-primary rounded-full animate-pulse' />
              <span>Real-time Monitoring</span>
            </div>
          </div>
        </div>
      </div>
      {/* Gates Grid or Empty State */}
      {gates.length === 0 ? (
        <div className='max-w-2xl mx-auto'>
          <Card className='relative overflow-hidden border-dashed border-2 border-muted-foreground/20 bg-gradient-to-br from-muted/20 via-background to-muted/10'>
            {/* Background decoration */}
            <div className='absolute inset-0 bg-grid opacity-5' />
            <div className='absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-primary/5 rounded-full blur-3xl' />

            <CardContent className='relative text-center p-16 space-y-8'>
              {/* Icon */}
              <div className='mx-auto w-24 h-24 bg-gradient-to-br from-muted/40 to-muted/20 rounded-3xl flex items-center justify-center border border-muted/30'>
                <ParkingCircle className='h-12 w-12 text-muted-foreground/60' />
              </div>

              {/* Content */}
              <div className='space-y-4'>
                <CardTitle className='text-2xl font-bold text-muted-foreground'>
                  No Gates Available
                </CardTitle>
                <CardDescription className='text-lg leading-relaxed max-w-md mx-auto'>
                  No parking gates are currently configured in the system.
                  Please contact your system administrator for assistance.
                </CardDescription>
              </div>

              {/* Additional Info */}
              <div className='pt-6 border-t border-muted/20'>
                <p className='text-sm text-muted-foreground/80'>
                  Need help? Contact support or check back later
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      ) : (
        <>
          {/* Gates Grid */}
          <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8'>
            {gates.map((gate, index) => (
              <GateCard key={gate.id} gate={gate} index={index} />
            ))}
          </div>
        </>
      )}
    </section>
  );
};
export default GatesSection;
