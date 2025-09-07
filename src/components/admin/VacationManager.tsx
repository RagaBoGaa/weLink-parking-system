import { toast } from 'react-hot-toast';
import { Calendar } from 'lucide-react';

import { useGetVacationsQuery, useDeleteVacationMutation } from '@/api/cruds';

import LoadingIndicator from '@/components/LoadingIndicator';
import { AdminCardLayout } from '@/components/shared/AdminCardLayout';

import VacationForm from './vacation/VacationForm';
import VacationStats from './vacation/VacationStats';
import VacationList from './vacation/VacationList';

interface VacationManagerProps {
  className?: string;
}

const VacationManager = ({ className }: VacationManagerProps) => {
  const {
    data: vacationsData,
    isLoading: vacationsLoading,
    error,
  } = useGetVacationsQuery(null);
  const [deleteVacation] = useDeleteVacationMutation();

  const handleDeleteVacation = async (id: string) => {
    try {
      await deleteVacation({ id }).unwrap();
      toast.success('🗑️ Vacation period deleted successfully');
    } catch (error: any) {
      toast.error(error?.data?.message || 'Failed to delete vacation period');
    }
  };

  if (vacationsLoading) {
    return <LoadingIndicator />;
  }

  const vacations = vacationsData || [];

  return (
    <AdminCardLayout
      title='Vacation Management'
      description='Manage vacation periods and rates for special occasions'
      icon={Calendar}
      iconColor='from-green-500 to-green-600'
      isLoading={vacationsLoading}
      error={error}
      className={className}
    >
      <VacationStats vacations={vacations} />

      <VacationForm />

      <VacationList vacations={vacations} onDelete={handleDeleteVacation} />
    </AdminCardLayout>
  );
};

export default VacationManager;
