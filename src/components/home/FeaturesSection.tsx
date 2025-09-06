import { Zap, Shield, Clock, Users, Sparkles } from 'lucide-react';
import { FeatureCard } from './FeatureCard';

const FeaturesSection = () => {
  const features = [
    {
      icon: Zap,
      title: 'Lightning Fast',
      description:
        'Get in and out in seconds with our streamlined entry and exit system powered by advanced automation.',
    },
    {
      icon: Shield,
      title: 'Military-Grade Security',
      description:
        'Advanced security monitoring, encryption, and 24/7 surveillance to protect you and your vehicle.',
    },
    {
      icon: Clock,
      title: 'Real-time Intelligence',
      description:
        'Live availability tracking, smart notifications, and predictive analytics for optimal parking.',
    },
    {
      icon: Users,
      title: 'Universal Access',
      description:
        'Seamless support for visitors, subscribers, employees, and staff with role-based permissions.',
    },
  ];

  return (
    <section className='relative py-24 overflow-hidden'>
      {/* Background */}
      <div className='absolute inset-0 bg-gradient-to-br from-secondary/5 via-background to-primary/5' />
      <div className='absolute inset-0 bg-grid opacity-10' />

      {/* Floating background elements */}
      <div className='absolute top-20 left-10 w-72 h-72 bg-primary/5 rounded-full blur-3xl animate-pulse' />
      <div className='absolute bottom-20 right-10 w-80 h-80 bg-secondary/10 rounded-full blur-3xl animate-pulse delay-1000' />
      <div className='absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-gradient-to-r from-primary/3 to-secondary/3 rounded-full blur-3xl animate-pulse delay-500' />

      <div className='relative container mx-auto px-4'>
        {/* Section Header */}
        <div className='text-center mb-20 space-y-6'>
          <div className='inline-flex items-center space-x-2 bg-primary/5 px-4 py-2 rounded-full border border-primary/20'>
            <Sparkles className='h-5 w-5 text-primary animate-pulse' />
            <span className='text-primary font-semibold'>Why Choose Us</span>
          </div>

          <h2 className='text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight'>
            <span className='bg-gradient-to-r from-foreground via-foreground/90 to-foreground/70 bg-clip-text text-transparent'>
              Next-Gen Features
            </span>
          </h2>

          <p className='text-lg sm:text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed'>
            Experience the future of parking management with cutting-edge
            technology designed for efficiency, security, and user satisfaction.
          </p>
        </div>

        {/* Features Grid */}
        <div className='grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-8 lg:gap-10'>
          {features.map((feature, index) => (
            <FeatureCard key={index} feature={feature} index={index} />
          ))}
        </div>
      </div>
    </section>
  );
};
export default FeaturesSection;
