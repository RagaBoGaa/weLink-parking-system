import { useState } from 'react';
import { DollarSign, Timer, Calendar, MapPin } from 'lucide-react';

import CategoryRateManager from '../../components/admin/CategoryRateManager';
import RushHoursManager from '../../components/admin/RushHoursManager';
import VacationManager from '../../components/admin/VacationManager';
import ZoneManagement from '../../components/admin/ZoneManager';

type TabType = 'categories' | 'zones' | 'rush-hours' | 'vacations';

const ControlPanel = () => {
  const [activeTab, setActiveTab] = useState<TabType>('categories');

  const tabs = [
    {
      id: 'categories' as const,
      name: 'Category Rates',
      icon: DollarSign,
      color: 'from-blue-500 to-blue-600',
    },
    {
      id: 'zones' as const,
      name: 'Zone Management',
      icon: MapPin,
      color: 'from-emerald-500 to-emerald-600',
    },
    {
      id: 'rush-hours' as const,
      name: 'Rush Hours',
      icon: Timer,
      color: 'from-purple-500 to-purple-600',
    },
    {
      id: 'vacations' as const,
      name: 'Vacation Periods',
      icon: Calendar,
      color: 'from-green-500 to-green-600',
    },
  ];

  const renderTabContent = () => {
    switch (activeTab) {
      case 'categories':
        return <CategoryRateManager />;
      case 'zones':
        return <ZoneManagement />;
      case 'rush-hours':
        return <RushHoursManager />;
      case 'vacations':
        return <VacationManager />;
      default:
    }
  };

  return (
    <div className='min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-50'>
      {/* Header */}
      <div className='bg-white border-b border-gray-200 sticky top-0 z-40 backdrop-blur-lg bg-white/90'>
        {/* Tab Navigation */}
        <div className='lg:px-6'>
          <nav className='flex gap-2 pb-3 flex-wrap'>
            {tabs.map((tab) => {
              const isActive = activeTab === tab.id;
              const Icon = tab.icon;

              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`
                    flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-medium 
                    transition-all duration-200 whitespace-nowrap
                    ${
                      isActive
                        ? 'bg-gradient-to-r text-white shadow-lg transform scale-105 ' +
                          tab.color
                        : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
                    }
                  `}
                >
                  <Icon className='h-4 w-4' />
                  {tab.name}
                </button>
              );
            })}
          </nav>
        </div>
      </div>

      {/* Content */}
      <div className='lg:px-6 lg:py-8'>
        <div className='max-w-7xl'>{renderTabContent()}</div>
      </div>
    </div>
  );
};

export default ControlPanel;
