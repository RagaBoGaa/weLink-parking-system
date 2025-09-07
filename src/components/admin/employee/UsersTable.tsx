import { Card } from '@/components/ui/card';
import { UserRow } from './UserRow';
import { User } from './types';

interface UsersTableProps {
  users: User[];
  onEditUser: (user: User) => void;
  onDisableUser: (user: User) => void;
}

export const UsersTable = ({
  users,
  onEditUser,
  onDisableUser,
}: UsersTableProps) => {
  if (!users || users.length === 0) {
    return (
      <Card className='p-12'>
        <div className='text-center'>
          <div className='text-gray-400 text-6xl mb-4'>👥</div>
          <h3 className='text-lg font-semibold text-gray-900 mb-2'>
            No users found
          </h3>
          <p className='text-gray-600'>
            Get started by creating your first user account.
          </p>
        </div>
      </Card>
    );
  }

  return (
    <div className='overflow-x-auto border rounded-2xl shadow-soft'>
      <table className='w-full'>
        <thead className='bg-gray-50 border-b border-gray-200'>
          <tr>
            <th className='px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider'>
              User Information
            </th>
            <th className='px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider'>
              Role
            </th>
            <th className='px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider'>
              Status
            </th>
            <th className='px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider'>
              Actions
            </th>
          </tr>
        </thead>
        <tbody className='bg-white divide-y divide-gray-200'>
          {users.map((user) => (
            <UserRow
              key={user.id}
              user={user}
              onEdit={onEditUser}
              onDisable={onDisableUser}
            />
          ))}
        </tbody>
      </table>
    </div>
  );
};
