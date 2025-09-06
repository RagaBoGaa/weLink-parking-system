import { Routes, Route } from 'react-router';

import HomePage from '@/pages/HomePage';
import Login from '@/pages/Login';
import Profile from '@/pages/Profile';
import ProtectedRoute from '@/routes/ProtectedRoute';

const PublicRoutes = () => {
  return (
    <Routes>
      <Route path='/' element={<HomePage />} />
      <Route path='/login' element={<Login />} />

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
