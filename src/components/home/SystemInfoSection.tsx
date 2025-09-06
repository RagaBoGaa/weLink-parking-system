import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Users, Car, HelpCircle } from 'lucide-react';

const SystemInfoSection = () => {
  const userTypes = [
    {
      icon: Users,
      title: 'Visitors',
      subtitle: 'Temporary Access',
      description:
        'Select any available gate to check in and receive a secure parking ticket for temporary access to our facilities.',
      features: [
        'Instant ticket generation',
        'QR code validation',
        'Automated billing',
      ],
      color: 'bg-blue-500',
      bgColor: 'bg-blue-500/10',
      borderColor: 'border-blue-500/20',
    },
    {
      icon: Car,
      title: 'Subscribers',
      subtitle: 'Reserved Parking',
      description:
        'Choose your designated gate, enter your subscription ID, and access your pre-assigned parking spot with priority access.',
      features: [
        'Reserved spot guarantee',
        'Priority access',
        'Monthly billing',
      ],
      color: 'bg-green-500',
      bgColor: 'bg-green-500/10',
      borderColor: 'border-green-500/20',
    },
  ];

  return (
    <section className='container mx-auto px-4 py-20'>
      <div className='space-y-16'>
        {/* Section Header */}
        <div className='text-center space-y-6'>
          <div className='inline-flex items-center space-x-2 bg-primary/5 px-4 py-2 rounded-full border border-primary/20'>
            <HelpCircle className='h-5 w-5 text-primary' />
            <span className='text-primary font-semibold'>How It Works</span>
          </div>

          <h2 className='text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight'>
            <span className='bg-gradient-to-r from-foreground via-foreground/90 to-foreground/70 bg-clip-text text-transparent'>
              System Information
            </span>
          </h2>

          <p className='text-lg sm:text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed'>
            Our parking system is designed to accommodate different types of
            users with tailored experiences and access levels.
          </p>
        </div>

        {/* User Types Grid */}
        <div className='grid grid-cols-1 lg:grid-cols-2 gap-8'>
          {userTypes.map((userType, index) => {
            const Icon = userType.icon;
            return (
              <Card
                key={index}
                className={`group relative overflow-hidden border-0 ${
                  userType.bgColor
                } hover:shadow-2xl transition-all duration-500 hover:scale-105 animate-fade-in-up delay-${
                  index * 200
                }`}
              >
                {/* Background decoration */}
                <div
                  className={`absolute inset-0 ${userType.bgColor} opacity-50 group-hover:opacity-75 transition-opacity duration-500`}
                />
                <div className='absolute top-0 right-0 w-32 h-32 bg-white/5 rounded-full blur-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-500' />

                <CardHeader className='relative text-center pb-6'>
                  {/* Enhanced Icon */}
                  <div className='mx-auto mb-6 relative'>
                    <div
                      className={`w-20 h-20 ${userType.color} rounded-3xl flex items-center justify-center shadow-lg group-hover:shadow-2xl transition-all duration-500 group-hover:scale-110 group-hover:rotate-3`}
                    >
                      <Icon className='h-10 w-10 text-white group-hover:scale-110 transition-transform duration-300' />
                    </div>
                    <div
                      className={`absolute inset-0 ${userType.color} opacity-30 blur-2xl rounded-3xl  group-hover:opacity-75 transition-opacity duration-500`}
                    />
                  </div>

                  <CardTitle className='space-y-2'>
                    <div className='text-2xl font-bold'>{userType.title}</div>
                    <div className='text-sm font-medium text-muted-foreground bg-background/80 px-3 py-1 rounded-full inline-block'>
                      {userType.subtitle}
                    </div>
                  </CardTitle>
                </CardHeader>

                <CardContent className='relative space-y-6'>
                  <p className='text-muted-foreground leading-relaxed'>
                    {userType.description}
                  </p>

                  {/* Features List */}
                  <div className='space-y-3'>
                    <h4 className='font-semibold text-sm uppercase tracking-wide text-muted-foreground'>
                      Key Features
                    </h4>
                    <ul className='space-y-2'>
                      {userType.features.map((feature, featureIndex) => (
                        <li
                          key={featureIndex}
                          className='flex items-center space-x-3 text-sm'
                        >
                          <div
                            className={`w-1.5 h-1.5 ${userType.color} rounded-full flex-shrink-0`}
                          />
                          <span className='group-hover:text-foreground transition-colors duration-300'>
                            {feature}
                          </span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>

        {/* Additional Help Section */}
        <div className='text-center pt-12 border-t border-border/50'>
          <div className='space-y-4'>
            <h3 className='text-xl font-semibold'>Need Additional Help?</h3>
            <div className='flex flex-col sm:flex-row justify-center items-center space-y-2 sm:space-y-0 sm:space-x-8 text-sm text-muted-foreground'>
              <div className='flex items-center space-x-2'>
                <div className='w-2 h-2 bg-primary rounded-full animate-pulse' />
                <span>24/7 Support Available</span>
              </div>
              <div className='flex items-center space-x-2'>
                <div className='w-2 h-2 bg-green-500 rounded-full animate-pulse' />
                <span>Live System Monitoring</span>
              </div>
              <div className='flex items-center space-x-2'>
                <div className='w-2 h-2 bg-blue-500 rounded-full animate-pulse' />
                <span>Quick Response Team</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
export default SystemInfoSection;
