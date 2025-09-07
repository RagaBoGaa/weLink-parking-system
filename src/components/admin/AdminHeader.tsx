import { useTypedSelector } from '@/api/store/store';
import { Badge } from '@/components/ui/badge';
import { SidebarTrigger } from '@/components/ui/sidebar';
import { Shield } from 'lucide-react';
import { useAdminNavigation } from '@/hooks/useAdminNavigation';

const AdminHeader = () => {
  const { user } = useTypedSelector((state) => state.auth);
  const { currentViewInfo } = useAdminNavigation();

  return (
    <header className='flex h-16 shrink-0 items-center gap-2 border-b py-3 mb-3'>
      <div className='flex items-center gap-2 px-4'>
        <SidebarTrigger className='-ml-1' />
        <div className='h-4 w-px bg-sidebar-border' />
        <div className='flex items-center gap-2'>
          <h1 className='text-lg font-semibold'>{currentViewInfo?.label}</h1>
          <Badge
            variant='outline'
            className='hidden sm:flex text-xs bg-emerald-400 text-white'
          >
            Live Data
          </Badge>
        </div>
      </div>
      <div className='ml-auto flex items-center gap-2 px-4'>
        <div className='hidden sm:flex items-center gap-2 text-sm'>
          <div className='h-6 w-px bg-sidebar-border' />
          <Badge className='text-xs uppercase' variant='secondary'>
            {user?.username}
          </Badge>
        </div>
        <div className='flex h-8 w-8 items-center justify-center rounded-full bg-primary'>
          <Shield className='h-4 w-4 text-primary-foreground' />
        </div>
      </div>
    </header>
  );
};

export default AdminHeader;
