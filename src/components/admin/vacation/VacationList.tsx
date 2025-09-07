import { CalendarDays } from 'lucide-react';
import { useState } from 'react';

import { Vacation } from '@/types/parking';
import VacationCard from './VacationCard';
import VacationEmptyState from './VacationEmptyState';
import DeleteConfirmation from '@/components/shared/DeleteConfirmation';

interface VacationListProps {
  vacations: Vacation[];
  onDelete: (id: string) => void;
  onAddClick?: () => void;
  className?: string;
}

const VacationList = ({
  vacations,
  onDelete,
  onAddClick,
  className,
}: VacationListProps) => {
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [vacationToDelete, setVacationToDelete] = useState<Vacation | null>(
    null
  );
  const [isDeleting, setIsDeleting] = useState(false);

  const handleDeleteRequest = (vacation: Vacation) => {
    setVacationToDelete(vacation);
    setShowDeleteConfirm(true);
  };

  const handleConfirmDelete = async () => {
    if (!vacationToDelete) return;

    setIsDeleting(true);
    try {
      await onDelete(vacationToDelete.id);
      setShowDeleteConfirm(false);
      setVacationToDelete(null);
    } catch (error) {
      console.error('Failed to delete vacation:', error);
    } finally {
      setIsDeleting(false);
    }
  };

  const handleCancelDelete = () => {
    setShowDeleteConfirm(false);
    setVacationToDelete(null);
    setIsDeleting(false);
  };

  if (vacations.length === 0) {
    return <VacationEmptyState onAddClick={onAddClick} className={className} />;
  }

  // Sort vacations by start date (earliest first)
  const sortedVacations = vacations
    .slice()
    .sort((a, b) => new Date(a.from).getTime() - new Date(b.from).getTime());

  return (
    <>
      <div className={`space-y-6 ${className}`}>
        {/* Header */}
        <div className='flex items-center gap-3'>
          <CalendarDays className='h-5 w-5 text-gray-600' />
          <h3 className='text-lg font-semibold text-gray-900'>
            Vacation Periods ({vacations.length})
          </h3>
        </div>

        {/* Vacation Cards Grid */}
        <div className='grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-4'>
          {sortedVacations.map((vacation) => (
            <VacationCard
              key={vacation.id}
              vacation={vacation}
              onDeleteRequest={handleDeleteRequest}
            />
          ))}
        </div>
      </div>

      {/* Delete Confirmation Modal */}
      {showDeleteConfirm && vacationToDelete && (
        <DeleteConfirmation
          handleCancelDelete={handleCancelDelete}
          itemToDelete={vacationToDelete.name}
          handleConfirmDelete={handleConfirmDelete}
          isDeleting={isDeleting}
        />
      )}
    </>
  );
};

export default VacationList;
