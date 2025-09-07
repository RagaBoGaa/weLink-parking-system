import { useLocation, useNavigate } from 'react-router';
import {
  navigationItems,
  type NavigationItem,
} from '@/components/admin/navigationConfig';

export const useAdminNavigation = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const getCurrentViewInfo = (): NavigationItem => {
    const currentPath =
      location.pathname === '/admin'
        ? '/admin/parking-state'
        : location.pathname;
    return (
      navigationItems.find((item) => item.path === currentPath) ||
      navigationItems[0]
    );
  };

  const handleNavigation = (path: string) => {
    navigate(path);
  };

  const isActiveItem = (item: NavigationItem): boolean => {
    return (
      location.pathname === item.path ||
      (location.pathname === '/admin' && item.id === 'parking-state')
    );
  };

  return {
    currentViewInfo: getCurrentViewInfo(),
    handleNavigation,
    isActiveItem,
    navigationItems,
  };
};
