import { Routes, Route } from 'react-router';

import HomePage from '@/pages/HomePage';
import Login from '@/pages/Login';
import GateScreen from '@/pages/GateScreen';
import CheckpointScreen from '@/pages/CheckpointScreen';
import AdminDashboard from '@/pages/Admin';
import Profile from '@/pages/Profile';
import ProtectedRoute from '@/routes/ProtectedRoute';
import ParkingStateReport from '@/pages/Admin/ParkingStateReport';
import ControlPanel from '@/pages/Admin/ControlPanel';
import EmployeeManagement from '@/pages/Admin/EmployeeManagement';
import AdminAuditLog from '@/pages/Admin/AdminAuditLog';

const PublicRoutes = () => {
  return (
    <Routes>
      <Route path='/' element={<HomePage />} />
      <Route path='/login' element={<Login />} />
      <Route path='/gate/:gateId' element={<GateScreen />} />

      {/* Protected Admin and Employee Routes */}
      <Route
        path='/checkpoint'
        element={
          <ProtectedRoute allowedRoles={['employee', 'admin']}>
            <CheckpointScreen />
          </ProtectedRoute>
        }
      />

      {/* Protected Admin and Employee Routes */}
      <Route
        path='/profile'
        element={
          <ProtectedRoute allowedRoles={['admin', 'employee']}>
            <Profile />
          </ProtectedRoute>
        }
      />

      {/* Protected Admin Routes */}
      <Route
        path='/admin'
        element={
          <ProtectedRoute allowedRoles={['admin']}>
            <AdminDashboard />
          </ProtectedRoute>
        }
      >
        <Route index element={<ParkingStateReport />} />
        <Route path='parking-state' element={<ParkingStateReport />} />
        <Route path='control-panel' element={<ControlPanel />} />
        <Route path='employees' element={<EmployeeManagement />} />
        <Route path='audit-log' element={<AdminAuditLog />} />
      </Route>
    </Routes>
  );
};

export default PublicRoutes;
