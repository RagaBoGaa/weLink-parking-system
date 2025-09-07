import { useState } from 'react';
import { toast } from 'react-hot-toast';
import { Plus, Users, Shield, Settings } from 'lucide-react';

import { useGetUsersQuery, useDeleteUserMutation } from '@/api/cruds/auth/auth';
import LoadingIndicator from '@/components/LoadingIndicator';
import ErrorComponent from '@/components/shared/ErrorComponent';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import DeleteConfirmation from '@/components/shared/DeleteConfirmation';
import { User } from '@/components/admin/employee/types';
import { UsersTable } from '@/components/admin/employee/UsersTable';
import { CreateUserModal } from '@/components/admin/employee/CreateUserModal';

const EmployeeManagement = () => {
  const [showUserModal, setShowUserModal] = useState(false);
  const [editingUser, setEditingUser] = useState<User | null>(null);
  const [userToDelete, setUserToDelete] = useState<string | null>(null);
  const [deletingUserId, setDeletingUserId] = useState<string | number | null>(
    null
  );

  const { data: usersData, isLoading, error, refetch } = useGetUsersQuery(null);
  const [deleteUser, { isLoading: isDeleting }] = useDeleteUserMutation();

  const handleEditUser = (user: User) => {
    setEditingUser(user);
    setShowUserModal(true);
  };

  const handleCreateUser = () => {
    setEditingUser(null);
    setShowUserModal(true);
  };

  const handleDeleteUser = (user: User) => {
    setUserToDelete(user.username);
    setDeletingUserId(user.id);
  };

  const handleConfirmDelete = async () => {
    if (!deletingUserId) return;

    try {
      await deleteUser(deletingUserId).unwrap();
      toast.success('User deleted successfully!');
      handleCancelDelete();
    } catch (error: any) {
      toast.error(error?.data?.message || 'Failed to delete user');
    }
  };

  const handleCancelDelete = () => {
    setUserToDelete(null);
    setDeletingUserId(null);
  };

  const handleUserModalSuccess = () => {
    refetch(); // Refresh the users list
  };

  const handleCloseUserModal = () => {
    setShowUserModal(false);
    setEditingUser(null);
  };

  if (isLoading) return <LoadingIndicator />;

  if (error) {
    return <ErrorComponent error={error} onRetry={refetch} />;
  }

  return (
    <div className='space-y-8'>
      {/* Enhanced Header Section */}
      <Card className='p-6'>
        <div className='flex flex-col sm:flex-row sm:items-center justify-between gap-4'>
          <div className='space-y-2'>
            <div className='flex items-center gap-3'>
              <div className='p-2 bg-blue-100 rounded-lg'>
                <Users className='h-6 w-6 text-blue-600' />
              </div>
              <div>
                <h1 className='text-2xl font-bold text-gray-900'>
                  Employee Management
                </h1>
                <p className='text-sm text-gray-600'>
                  Manage your team members and their access levels
                </p>
              </div>
            </div>

            {/* Stats Cards */}
            <div className='flex gap-4 mt-4'>
              <div className='flex items-center gap-2 text-sm'>
                <Shield className='h-4 w-4 text-purple-600' />
                <span className='text-gray-600'>
                  {usersData?.filter((user) => user.role === 'admin').length ||
                    0}{' '}
                  Admins
                </span>
              </div>
              <div className='flex items-center gap-2 text-sm'>
                <Users className='h-4 w-4 text-blue-600' />
                <span className='text-gray-600'>
                  {usersData?.filter((user) => user.role === 'employee')
                    .length || 0}{' '}
                  Employees
                </span>
              </div>
              <div className='flex items-center gap-2 text-sm'>
                <Settings className='h-4 w-4 text-gray-600' />
                <span className='text-gray-600'>
                  {usersData?.length || 0} Total Users
                </span>
              </div>
            </div>
          </div>

          <Button
            onClick={handleCreateUser}
            className='bg-blue-600 hover:bg-blue-700 shrink-0'
          >
            <Plus className='h-4 w-4 mr-2' />
            Add New User
          </Button>
        </div>
      </Card>

      {/* Users Table */}
      <UsersTable
        users={usersData || []}
        onEditUser={handleEditUser}
        onDisableUser={handleDeleteUser}
      />

      {/* User Modal (Create/Edit) */}
      <CreateUserModal
        isOpen={showUserModal}
        onClose={handleCloseUserModal}
        onSuccess={handleUserModalSuccess}
        editUser={editingUser || undefined}
      />

      {/* Delete User Confirmation */}
      {userToDelete && (
        <DeleteConfirmation
          handleCancelDelete={handleCancelDelete}
          itemToDelete={userToDelete}
          handleConfirmDelete={handleConfirmDelete}
          isDeleting={isDeleting}
        />
      )}
    </div>
  );
};

export default EmployeeManagement;
