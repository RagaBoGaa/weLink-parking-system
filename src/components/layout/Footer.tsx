import {
  Car,
  Mail,
  Phone,
  MapPin,
  Github,
  Twitter,
  Linkedin,
  Clock,
  Shield,
  Zap,
} from 'lucide-react';

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className='bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 text-white mt-auto'>
      {/* Main Footer Content */}
      <div className='container mx-auto px-4 py-12'>
        <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8'>
          {/* Company Info */}
          <div className='space-y-4'>
            <div className='flex items-center space-x-2'>
              <div className='bg-gradient-to-r from-blue-500 to-purple-600 p-2 rounded-lg'>
                <Car className='h-6 w-6 text-white' />
              </div>
              <span className='text-xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent'>
                WeLink Cargo
              </span>
            </div>
            <p className='text-slate-300 text-sm leading-relaxed'>
              Advanced parking management system designed for modern cargo
              facilities. Streamline operations with intelligent zone management
              and real-time monitoring.
            </p>
            <div className='flex space-x-3'>
              <div className='flex items-center space-x-1 text-xs text-slate-400'>
                <Shield className='h-3 w-3' />
                <span>Secure</span>
              </div>
              <div className='flex items-center space-x-1 text-xs text-slate-400'>
                <Zap className='h-3 w-3' />
                <span>Fast</span>
              </div>
              <div className='flex items-center space-x-1 text-xs text-slate-400'>
                <Clock className='h-3 w-3' />
                <span>24/7</span>
              </div>
            </div>
          </div>

          {/* Features */}
          <div className='space-y-4'>
            <h3 className='text-lg font-semibold text-white'>Features</h3>
            <div className='space-y-2'>
              {[
                'Real-time Monitoring',
                'Zone Management',
                'Automated Check-in/out',
                'Rush Hour Management',
                'Vacation Tracking',
                'Audit Logging',
              ].map((feature) => (
                <div key={feature} className='text-slate-300 text-sm'>
                  {feature}
                </div>
              ))}
            </div>
          </div>

          {/* Contact & Social */}
          <div className='space-y-4'>
            <h3 className='text-lg font-semibold text-white'>Contact</h3>
            <div className='space-y-3'>
              <div className='flex items-center space-x-2 text-slate-300 text-sm'>
                <Mail className='h-4 w-4 text-blue-400' />
                <span>support@welinkcargo.com</span>
              </div>
              <div className='flex items-center space-x-2 text-slate-300 text-sm'>
                <Phone className='h-4 w-4 text-blue-400' />
                <span>+1 (555) 123-4567</span>
              </div>
              <div className='flex items-center space-x-2 text-slate-300 text-sm'>
                <MapPin className='h-4 w-4 text-blue-400' />
                <span>Enterprise District</span>
              </div>
            </div>

            {/* Social Links */}
            <div className='pt-2'>
              <p className='text-sm text-slate-400 mb-3'>Follow Us</p>
              <div className='flex space-x-3'>
                {[
                  { icon: Github, href: '#', label: 'GitHub' },
                  { icon: Twitter, href: '#', label: 'Twitter' },
                  { icon: Linkedin, href: '#', label: 'LinkedIn' },
                ].map((social) => (
                  <a
                    key={social.label}
                    href={social.href}
                    className='bg-slate-700 hover:bg-blue-600 p-2 rounded-lg transition-colors duration-200 group'
                    aria-label={social.label}
                  >
                    <social.icon className='h-4 w-4 text-slate-300 group-hover:text-white' />
                  </a>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className='border-t border-slate-700 bg-slate-900/50'>
        <div className='container mx-auto px-4 py-4'>
          <div className='flex flex-col md:flex-row justify-between items-center space-y-2 md:space-y-0'>
            <div className='text-slate-400 text-sm'>
              © {currentYear} WeLink Cargo Parking System. All rights reserved.
            </div>
            <div className='flex items-center space-x-6 text-sm'>
              <a
                href='#'
                className='text-slate-400 hover:text-blue-400 transition-colors'
              >
                Privacy Policy
              </a>
              <a
                href='#'
                className='text-slate-400 hover:text-blue-400 transition-colors'
              >
                Terms of Service
              </a>
              <a
                href='#'
                className='text-slate-400 hover:text-blue-400 transition-colors'
              >
                Documentation
              </a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
