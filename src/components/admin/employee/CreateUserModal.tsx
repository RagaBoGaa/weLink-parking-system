import { Dialog, DialogContent, DialogTrigger } from '@/components/ui/dialog';
import { CreateUserForm } from './CreateUserForm';
import { User } from './types';

interface CreateUserModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
  editUser?: User; // Optional user to edit
  trigger?: React.ReactNode;
}

export const CreateUserModal = ({
  isOpen,
  onClose,
  onSuccess,
  editUser,
  trigger,
}: CreateUserModalProps) => {
  const handleSuccess = () => {
    onSuccess();
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      {trigger && <DialogTrigger asChild>{trigger}</DialogTrigger>}
      <DialogContent className='max-w-lg p-0 gap-0 max-h-[90vh] overflow-y-auto'>
        <CreateUserForm
          onSuccess={handleSuccess}
          onCancel={onClose}
          editUser={editUser}
        />
      </DialogContent>
    </Dialog>
  );
};
