import { BarChart3, Settings, Users, FileText } from 'lucide-react';

export interface NavigationItem {
  id: string;
  label: string;
  icon: any;
  description: string;
  color: string;
  path: string;
}

export const navigationItems: NavigationItem[] = [
  {
    id: 'parking-state',
    label: 'Parking State',
    icon: BarChart3,
    description: '',
    color: 'from-blue-500 to-blue-600',
    path: '/admin/parking-state',
  },
  {
    id: 'control-panel',
    label: 'Control Panel',
    icon: Settings,
    description: '',
    color: 'from-purple-500 to-purple-600',
    path: '/admin/control-panel',
  },
  {
    id: 'employees',
    label: 'Employees',
    icon: Users,
    description: '',
    color: 'from-green-500 to-green-600',
    path: '/admin/employees',
  },
  {
    id: 'audit-log',
    label: 'Audit Log',
    icon: FileText,
    description: '',
    color: 'from-orange-500 to-orange-600',
    path: '/admin/audit-log',
  },
];
