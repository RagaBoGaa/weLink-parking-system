import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { toast } from 'react-hot-toast';
import {
  User,
  Mail,
  Lock,
  UserCircle,
  Eye,
  EyeOff,
  Edit3,
  UserPlus,
} from 'lucide-react';
import { useState, useEffect } from 'react';

import { userFormSchema, UserFormData } from '@/lib/schemas';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card } from '@/components/ui/card';
import {
  useCreateUserMutation,
  useUpdateUserMutation,
} from '@/api/cruds/auth/auth';
import { User as UserType } from './types';

interface CreateUserFormProps {
  onSuccess: () => void;
  onCancel: () => void;
  editUser?: UserType; // Optional user to edit
}

export const CreateUserForm = ({
  onSuccess,
  onCancel,
  editUser,
}: CreateUserFormProps) => {
  const [showPassword, setShowPassword] = useState(false);
  const [createUser, { isLoading: isCreating }] = useCreateUserMutation();
  const [updateUser, { isLoading: isUpdating }] = useUpdateUserMutation();

  const isEditMode = !!editUser;
  const isLoading = isCreating || isUpdating;

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
  } = useForm<UserFormData>({
    resolver: zodResolver(userFormSchema),
    defaultValues: {
      username: editUser?.username || '',
      password: '',
      role: editUser?.role || 'employee',
      name: editUser?.name || '',
      email: editUser?.email || '',
    },
  });

  // Reset form when editUser changes
  useEffect(() => {
    reset({
      username: editUser?.username || '',
      password: '',
      role: editUser?.role || 'employee',
      name: editUser?.name || '',
      email: editUser?.email || '',
    });
  }, [editUser, reset]);

  const onSubmit = async (data: UserFormData) => {
    try {
      if (isEditMode && editUser) {
        // For edit mode, only send password if it's provided
        const updateData = { ...data };
        if (!updateData.password) {
          delete updateData.password;
        }
        await updateUser({ id: editUser.id, userData: updateData }).unwrap();
        toast.success('User updated successfully!');
      } else {
        // For create mode, password is required
        if (!data.password) {
          toast.error('Password is required for new users');
          return;
        }
        await createUser(data).unwrap();
        toast.success('User created successfully!');
      }
      reset();
      onSuccess();
    } catch (error: any) {
      toast.error(
        error?.data?.message ||
          `Failed to ${isEditMode ? 'update' : 'create'} user`
      );
    }
  };

  return (
    <Card className='p-6'>
      <div className='flex items-center gap-3 mb-6'>
        <div className='p-2 bg-blue-100 rounded-lg'>
          {isEditMode ? (
            <Edit3 className='h-6 w-6 text-blue-600' />
          ) : (
            <UserPlus className='h-6 w-6 text-blue-600' />
          )}
        </div>
        <div>
          <h3 className='text-xl font-semibold text-gray-900'>
            {isEditMode ? 'Edit User' : 'Create New User'}
          </h3>
          <p className='text-sm text-gray-600'>
            {isEditMode
              ? 'Update user information and permissions'
              : 'Add a new team member to the system'}
          </p>
        </div>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className='space-y-5'>
        {/* Username Field */}
        <div className='space-y-2'>
          <label className='text-sm font-medium text-gray-700 flex items-center gap-2'>
            <User className='h-4 w-4' />
            Username *
          </label>
          <Input
            {...register('username')}
            placeholder='Enter username'
            className={
              errors.username
                ? 'border-red-300 focus:border-red-500 focus:ring-red-500'
                : ''
            }
          />
          {errors.username && (
            <p className='text-sm text-red-600'>{errors.username.message}</p>
          )}
        </div>

        {/* Password Field */}
        <div className='space-y-2'>
          <label className='text-sm font-medium text-gray-700 flex items-center gap-2'>
            <Lock className='h-4 w-4' />
            Password {isEditMode ? '(leave blank to keep current)' : '*'}
          </label>
          <div className='relative'>
            <Input
              {...register('password')}
              type={showPassword ? 'text' : 'password'}
              placeholder={
                isEditMode ? 'Enter new password (optional)' : 'Enter password'
              }
              className={
                errors.password
                  ? 'border-red-300 focus:border-red-500 focus:ring-red-500 pr-10'
                  : 'pr-10'
              }
            />
            <button
              type='button'
              onClick={() => setShowPassword(!showPassword)}
              className='absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600'
            >
              {showPassword ? (
                <EyeOff className='h-4 w-4' />
              ) : (
                <Eye className='h-4 w-4' />
              )}
            </button>
          </div>
          {errors.password && (
            <p className='text-sm text-red-600'>{errors.password.message}</p>
          )}
        </div>

        {/* Role Field */}
        <div className='space-y-2'>
          <label className='text-sm font-medium text-gray-700 flex items-center gap-2'>
            <UserCircle className='h-4 w-4' />
            Role *
          </label>
          <select
            {...register('role')}
            className={`w-full border rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
              errors.role ? 'border-red-300' : 'border-gray-300'
            }`}
          >
            <option value='employee'>Employee</option>
            <option value='admin'>Admin</option>
          </select>
          {errors.role && (
            <p className='text-sm text-red-600'>{errors.role.message}</p>
          )}
        </div>

        {/* Name Field (Required) */}
        <div className='space-y-2'>
          <label className='text-sm font-medium text-gray-700 flex items-center gap-2'>
            <User className='h-4 w-4' />
            Full Name *
          </label>
          <Input
            {...register('name')}
            placeholder='Enter full name'
            className={
              errors.name
                ? 'border-red-300 focus:border-red-500 focus:ring-red-500'
                : ''
            }
          />
          {errors.name && (
            <p className='text-sm text-red-600'>{errors.name.message}</p>
          )}
        </div>

        {/* Email Field (Required) */}
        <div className='space-y-2'>
          <label className='text-sm font-medium text-gray-700 flex items-center gap-2'>
            <Mail className='h-4 w-4' />
            Email Address *
          </label>
          <Input
            {...register('email')}
            type='email'
            placeholder='Enter email address'
            className={
              errors.email
                ? 'border-red-300 focus:border-red-500 focus:ring-red-500'
                : ''
            }
          />
          {errors.email && (
            <p className='text-sm text-red-600'>{errors.email.message}</p>
          )}
        </div>

        {/* Action Buttons */}
        <div className='flex gap-3 pt-4 border-t'>
          <Button
            type='submit'
            disabled={isLoading || isSubmitting}
            className='flex-1 bg-blue-600 hover:bg-blue-700'
          >
            {isLoading || isSubmitting
              ? isEditMode
                ? 'Updating...'
                : 'Creating...'
              : isEditMode
              ? 'Update User'
              : 'Create User'}
          </Button>
          <Button
            type='button'
            variant='outline'
            onClick={onCancel}
            className='flex-1'
            disabled={isLoading || isSubmitting}
          >
            Cancel
          </Button>
        </div>
      </form>
    </Card>
  );
};
