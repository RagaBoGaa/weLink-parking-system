import { useTypedSelector } from '@/api/store/store';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router';
import { logout } from '@/state/auth';
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarRail,
  SidebarSeparator,
} from '@/components/ui/sidebar';
import { Shield, Activity, LogOut, Home } from 'lucide-react';
import { useAdminNavigation } from '@/hooks/useAdminNavigation';

const AdminSidebar = () => {
  const { user } = useTypedSelector((state) => state.auth);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { navigationItems, handleNavigation, isActiveItem } =
    useAdminNavigation();

  const handleLogout = () => {
    dispatch(logout());
    navigate('/');
  };

  const handleGoHome = () => {
    navigate('/');
  };

  return (
    <Sidebar variant='inset' className='border-sidebar-border'>
      <SidebarHeader className='border-b border-sidebar-border'>
        <div className='flex items-center gap-3 px-3 py-2'>
          <div className='flex h-8 w-8 items-center justify-center rounded-lg bg-primary'>
            <Shield className='h-4 w-4 text-primary-foreground' />
          </div>
          <div className='flex flex-col'>
            <span className='text-sm font-semibold'>Admin Dashboard</span>
            <span className='text-xs text-muted-foreground'>
              WeLink Cargo Management
            </span>
          </div>
        </div>
      </SidebarHeader>

      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupContent>
            <SidebarMenu>
              {navigationItems.map((item) => {
                const Icon = item.icon;
                const isActive = isActiveItem(item);
                return (
                  <SidebarMenuItem key={item.id}>
                    <SidebarMenuButton
                      onClick={() => handleNavigation(item.path)}
                      isActive={isActive}
                      tooltip={item.label}
                      className={`group relative overflow-hidden rounded-xl p-2 h-auto transition-all duration-200 ${
                        isActive
                          ? `!bg-gradient-to-r ${item.color} text-white shadow-lg scale-[1.02] border border-blue-500/50`
                          : `hover:bg-accent/50 hover:scale-[1.01]`
                      }`}
                    >
                      <div className='flex items-center gap-3 w-full'>
                        <div
                          className={`p-2 rounded-lg transition-colors shrink-0 ${
                            isActive
                              ? 'bg-white/20'
                              : `bg-gradient-to-r ${item.color} text-white`
                          }`}
                        >
                          <Icon className='h-4 w-4' />
                        </div>
                        <div className='flex-1 min-w-0 text-left group-data-[collapsible=icon]:hidden'>
                          <p
                            className={`font-medium text-sm ${
                              isActive ? 'text-white' : 'text-foreground'
                            }`}
                          >
                            {item.label}
                          </p>
                        </div>
                      </div>
                      {isActive && (
                        <div className='absolute right-3 top-1/2 transform -translate-y-1/2 group-data-[collapsible=icon]:hidden'>
                          <div className='h-2 w-2 rounded-full bg-white/80' />
                        </div>
                      )}
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                );
              })}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        <SidebarSeparator />

        <SidebarGroup>
          <SidebarGroupContent>
            <SidebarMenu>
              {/* User Profile Card */}
              <SidebarMenuItem>
                <div className='p-3 mb-3 bg-gradient-to-r from-slate-50 to-slate-100 dark:from-slate-800 dark:to-slate-900 rounded-xl border border-slate-200 dark:border-slate-700'>
                  <div className='flex items-center gap-3 mb-3'>
                    <div className='flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-r from-blue-500 to-purple-600 text-white font-semibold text-sm'>
                      {user?.username?.charAt(0).toUpperCase() || 'U'}
                    </div>
                    <div className='flex flex-col flex-1 min-w-0'>
                      <span className='text-sm font-semibold text-slate-900 dark:text-slate-100 truncate'>
                        {user?.username}
                      </span>
                      <span className='text-xs text-slate-500 dark:text-slate-400 capitalize'>
                        {user?.role || 'Admin'}
                      </span>
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div className='grid grid-cols-2 gap-2'>
                    <button
                      onClick={handleGoHome}
                      className='group flex items-center justify-center gap-2 px-3 py-2 rounded-lg bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-600 hover:border-blue-300 dark:hover:border-blue-500 transition-all duration-200 hover:shadow-md hover:scale-[1.02]'
                    >
                      <Home className='h-4 w-4 text-slate-600 dark:text-slate-300 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors' />
                      <span className='text-xs font-medium text-slate-700 dark:text-slate-300 group-hover:text-blue-700 dark:group-hover:text-blue-300 transition-colors'>
                        Home
                      </span>
                    </button>

                    <button
                      onClick={handleLogout}
                      className='group flex items-center justify-center gap-2 px-3 py-2 rounded-lg bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-600 hover:border-red-300 dark:hover:border-red-500 transition-all duration-200 hover:shadow-md hover:scale-[1.02]'
                    >
                      <LogOut className='h-4 w-4 text-slate-600 dark:text-slate-300 group-hover:text-red-600 dark:group-hover:text-red-400 transition-colors' />
                      <span className='text-xs font-medium text-slate-700 dark:text-slate-300 group-hover:text-red-700 dark:group-hover:text-red-300 transition-colors'>
                        Logout
                      </span>
                    </button>
                  </div>
                </div>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter className='border-t border-sidebar-border'>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton size='lg'>
              <div className='flex h-8 w-8 items-center justify-center rounded-lg bg-green-100 dark:bg-green-900/20'>
                <Activity className='h-4 w-4 text-green-600 dark:text-green-400' />
              </div>
              <div className='flex flex-col items-start'>
                <span className='text-sm font-medium'>System Status</span>
                <span className='text-xs text-muted-foreground'>
                  All systems operational
                </span>
              </div>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  );
};

export default AdminSidebar;
