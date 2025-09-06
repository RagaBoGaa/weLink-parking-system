import { Navigate } from 'react-router';
import { useTypedSelector } from '@/api/store/store';

type ProtectedRouteProps = {
  children: React.ReactNode;
  allowedRoles?: string[];
};

const ProtectedRoute = ({
  children,
  allowedRoles = [],
}: ProtectedRouteProps) => {
  const { isAuthenticated, user } = useTypedSelector((state) => state.auth);

  if (!isAuthenticated) {
    return <Navigate to='/login' replace />;
  }

  if (
    allowedRoles.length > 0 &&
    user?.role &&
    !allowedRoles.includes(user.role)
  ) {
    return <Navigate to='/' replace />;
  }

  return <>{children}</>;
};

export default ProtectedRoute;
