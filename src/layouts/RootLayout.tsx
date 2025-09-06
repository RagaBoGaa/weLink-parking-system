import { useLocation } from 'react-router';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const location = useLocation();

  const hideHeaderFooter =
    location.pathname === '/login' || location.pathname.startsWith('/admin');

  return (
    <div className='min-h-screen flex flex-col bg-gradient-to-br from-background via-background to-secondary/10'>
      {!hideHeaderFooter && <Header />}
      <main className='flex-grow w-full'>{children}</main>
      {!hideHeaderFooter && <Footer />}
    </div>
  );
}
