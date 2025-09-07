import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { User } from './types';

interface UserRowProps {
  user: User;
  onEdit: (user: User) => void;
  onDisable: (user: User) => void;
}

export const UserRow = ({ user, onEdit, onDisable }: UserRowProps) => {
  return (
    <tr className='hover:bg-gray-50 transition-colors'>
      <td className='px-6 py-4'>
        <div className='space-y-1'>
          <div className='font-semibold text-gray-900'>{user.username}</div>
          {user.name && (
            <div className='text-sm text-gray-600'>{user.name}</div>
          )}
          {user.email && (
            <div className='text-sm text-gray-500'>{user.email}</div>
          )}
        </div>
      </td>
      <td className='px-6 py-4'>
        <Badge
          variant={user.role === 'admin' ? 'default' : 'secondary'}
          className={
            user.role === 'admin'
              ? 'bg-purple-100 text-purple-800 hover:bg-purple-200'
              : 'bg-blue-100 text-blue-800 hover:bg-blue-200'
          }
        >
          {user.role.charAt(0).toUpperCase() + user.role.slice(1)}
        </Badge>
      </td>
      <td className='px-6 py-4'>
        <Badge
          variant='outline'
          className='bg-green-50 text-green-700 border-green-200'
        >
          Active
        </Badge>
      </td>
      <td className='px-6 py-4'>
        <div className='flex items-center gap-2'>
          <Button
            variant='ghost'
            size='sm'
            onClick={() => onEdit(user)}
            className='text-blue-600 hover:text-blue-800 hover:bg-blue-50'
          >
            Edit
          </Button>
          <Button
            variant='ghost'
            size='sm'
            onClick={() => onDisable(user)}
            className='text-red-600 hover:text-red-800 hover:bg-red-50'
          >
            Disable
          </Button>
        </div>
      </td>
    </tr>
  );
};
