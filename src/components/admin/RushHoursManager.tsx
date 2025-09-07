import { Timer } from 'lucide-react';
import { useGetRushHoursQuery, useDeleteRushHourMutation } from '@/api/cruds';

import LoadingIndicator from '@/components/LoadingIndicator';
import { toast } from 'react-hot-toast';
import AddRushHourForm from './rush-hour/AddRushHourForm';
import RushHoursList from './rush-hour/RushHoursList';
import { AdminCardLayout } from '../shared/AdminCardLayout';

interface RushHoursManagerProps {
  className?: string;
}

const RushHoursManager = ({ className }: RushHoursManagerProps) => {
  const {
    data: rushHoursData,
    isLoading: rushLoading,
    error,
  } = useGetRushHoursQuery(null);
  const [deleteRushHour] = useDeleteRushHourMutation();

  const handleDeleteRushHour = async (id: string) => {
    try {
      await deleteRushHour({ id }).unwrap();
      toast.success('Rush hour deleted successfully');
    } catch (error: any) {
      toast.error(error?.data?.message || 'Failed to delete rush hour');
    }
  };

  if (rushLoading) {
    return <LoadingIndicator />;
  }

  return (
    <AdminCardLayout
      title='Rush Hours Management'
      description='Configure special rate periods for peak hours'
      icon={Timer}
      iconColor='from-blue-500 to-blue-600'
      isLoading={rushLoading}
      error={error}
      className={className}
    >
      <AddRushHourForm />

      <RushHoursList
        rushHours={rushHoursData || []}
        onDelete={handleDeleteRushHour}
      />
    </AdminCardLayout>
  );
};

export default RushHoursManager;
