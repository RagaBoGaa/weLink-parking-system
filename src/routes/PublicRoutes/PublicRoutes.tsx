import { Routes, Route } from 'react-router';

import HomePage from '@/pages/HomePage';
import Login from '@/pages/Login';
import GateScreen from '@/pages/GateScreen';
import CheckpointScreen from '@/pages/CheckpointScreen';
import Profile from '@/pages/Profile';
import ProtectedRoute from '@/routes/ProtectedRoute';

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
    </Routes>
  );
};

export default PublicRoutes;
