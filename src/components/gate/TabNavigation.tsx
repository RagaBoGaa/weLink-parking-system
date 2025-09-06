import { Card, CardContent } from '@/components/ui/card';
import { Users, Car } from 'lucide-react';

export type TabType = 'visitor' | 'subscriber';

interface Tab {
  id: TabType;
  label: string;
  icon: typeof Users;
  description: string;
}

interface TabNavigationProps {
  activeTab: TabType;
  onTabChange: (tab: TabType) => void;
}

const tabs: Tab[] = [
  {
    id: 'visitor',
    label: 'Visitor',
    icon: Users,
    description: 'Hourly parking',
  },
  {
    id: 'subscriber',
    label: 'Subscriber',
    icon: Car,
    description: 'Reserved parking',
  },
];

export const TabNavigation = ({
  activeTab,
  onTabChange,
}: TabNavigationProps) => {
  return (
    <div className='mb-8'>
      <Card variant='default' className='shadow-soft p-2'>
        <CardContent className='p-0'>
          <div className='grid grid-cols-2 gap-1'>
            {tabs.map((tab) => {
              const Icon = tab.icon;
              const isActive = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => onTabChange(tab.id)}
                  className={`flex items-center justify-center gap-2 p-2 rounded-xl font-medium transition-all duration-200 ${
                    isActive
                      ? 'bg-primary text-primary-foreground shadow-colored'
                      : 'hover:bg-accent text-muted-foreground hover:text-foreground'
                  }`}
                >
                  <Icon className='size-6' />
                  <div className='text-left'>
                    <div className='font-semibold'>{tab.label}</div>
                    <div className='text-xs opacity-75'>{tab.description}</div>
                  </div>
                </button>
              );
            })}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
