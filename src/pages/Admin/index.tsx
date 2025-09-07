import { Outlet } from 'react-router';
import { useEffect } from 'react';
import { useGetGatesQuery } from '@/api/cruds';
import { SidebarInset, SidebarProvider } from '@/components/ui/sidebar';
import { auditLogService } from '@/services/auditLogService';
import AdminSidebar from '@/components/admin/AdminSidebar';
import AdminHeader from '@/components/admin/AdminHeader';

const AdminDashboard = () => {
  const { data: gatesData } = useGetGatesQuery(null);

  useEffect(() => {
    if (gatesData && gatesData.length > 0) {
      console.log('AdminDashboard: Initializing audit log service with gates');
      const gateIds = gatesData.map((gate) => gate.id);
      auditLogService.initialize(gateIds);
    }
  }, [gatesData]);

  return (
    <SidebarProvider defaultOpen={true}>
      <div className='flex min-h-screen w-full'>
        <AdminSidebar />

        <SidebarInset className='!mt-0'>
          <AdminHeader />

          {/* Main Content */}
          <main className='flex-1 px-3'>
            <div className='animate-in fade-in-50 duration-300'>
              <Outlet />
            </div>
          </main>
        </SidebarInset>
      </div>
    </SidebarProvider>
  );
};

export default AdminDashboard;
