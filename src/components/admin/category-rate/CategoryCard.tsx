import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import {
  Edit3,
  Save,
  X,
  Clock,
  Star,
  Loader2,
  AlertCircle,
} from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Category } from '@/types/parking';
import { categoryFormSchema } from '@/utils/schema';

type CategoryFormData = z.infer<typeof categoryFormSchema>;

interface CategoryCardProps {
  category: Category;
  onUpdateRates: (
    categoryId: string,
    rates: { rateNormal: number; rateSpecial: number }
  ) => Promise<void>;
  isLoading?: boolean;
}

const CategoryCard = ({
  category,
  onUpdateRates,
  isLoading = false,
}: CategoryCardProps) => {
  const [isEditing, setIsEditing] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors, isValid },
    reset,
  } = useForm<CategoryFormData>({
    resolver: zodResolver(categoryFormSchema),
    mode: 'onChange',
    defaultValues: {
      rateNormal: category.rateNormal,
      rateSpecial: category.rateSpecial,
    },
  });

  const handleStartEdit = () => {
    setIsEditing(true);
    reset({
      rateNormal: category.rateNormal,
      rateSpecial: category.rateSpecial,
    });
  };

  const handleCancel = () => {
    setIsEditing(false);
    reset();
  };

  const onSubmit = async (data: CategoryFormData) => {
    try {
      await onUpdateRates(category.id, {
        rateNormal: data.rateNormal,
        rateSpecial: data.rateSpecial,
      });
      setIsEditing(false);
    } catch (error) {
      console.error('Error updating rates', error);
    }
  };

  const hasValidationErrors = Object.keys(errors).length > 0;

  return (
    <div>
      <Card
        className={`
        group relative overflow-hidden py-4 px-3 lg:px-8
        ${
          isEditing
            ? 'ring-2 ring-blue-500/50  bg-gradient-to-br from-blue-50/50 to-indigo-50/30'
            : 'bg-white border border-gray-200/60'
        }
        ${hasValidationErrors ? 'ring-2 ring-red-500/50' : ''}
      `}
      >
        <CardContent className='relative pt-6 pb-6'>
          {/* Header Section */}
          <div className='flex justify-between items-start mb-6'>
            <div className='space-y-2 flex-1'>
              <div className='flex items-center gap-3'>
                <div
                  className={`
                w-2 h-8 rounded-full transition-all duration-300
                ${
                  isEditing
                    ? 'bg-gradient-to-b from-blue-500 to-indigo-600'
                    : 'bg-gradient-to-b from-gray-300 to-gray-400'
                }
              `}
                />
                <h3 className='font-bold text-xl text-gray-900 tracking-tight'>
                  {category.name}
                </h3>
              </div>
              <p className='text-sm text-gray-600 ml-5 leading-relaxed'>
                {category.description}
              </p>
            </div>

            {/* Action Buttons */}
            <div className='flex gap-2 flex-wrap'>
              {isEditing ? (
                <div className='flex gap-2 animate-in slide-in-from-right-2 duration-200 flex-'>
                  <Button
                    onClick={handleSubmit(onSubmit)}
                    disabled={isLoading || !isValid}
                    size='sm'
                    className={`
                    gap-2 transition-all duration-200 min-w-[90px]
                    ${
                      !isValid
                        ? 'bg-gray-400 hover:bg-gray-400 cursor-not-allowed'
                        : 'bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800'
                    }
                  `}
                  >
                    {isLoading ? (
                      <Loader2 className='h-4 w-4 animate-spin' />
                    ) : (
                      <Save className='h-4 w-4' />
                    )}
                    {isLoading ? 'Saving...' : 'Save'}
                  </Button>
                  <Button
                    onClick={handleCancel}
                    variant='outline'
                    size='sm'
                    className='gap-2 border-gray-300 hover:bg-gray-50 hover:border-gray-400 transition-all duration-200'
                    disabled={isLoading}
                  >
                    <X className='h-4 w-4' />
                    Cancel
                  </Button>
                </div>
              ) : (
                <Button
                  onClick={handleStartEdit}
                  variant='outline'
                  size='sm'
                  className='gap-2 hover:bg-blue-50 hover:border-blue-300 hover:text-blue-700 transition-all duration-200 group-hover:shadow-md'
                >
                  <Edit3 className='h-4 w-4 transition-transform group-hover:scale-110' />
                  Edit Rates
                </Button>
              )}
            </div>
          </div>

          {/* Validation Errors */}
          {hasValidationErrors && (
            <div className='mb-4 p-3 bg-red-50 border border-red-200 rounded-lg animate-in slide-in-from-top-2 duration-200'>
              <div className='flex items-center gap-2 text-red-800'>
                <AlertCircle className='h-4 w-4' />
                <span className='text-sm font-medium'>
                  Please fix the following errors:
                </span>
              </div>
              <ul className='mt-2 ml-6 space-y-1'>
                {Object.values(errors).map(
                  (error, index) =>
                    error?.message && (
                      <li key={index} className='text-sm text-red-600'>
                        {error.message}
                      </li>
                    )
                )}
              </ul>
            </div>
          )}

          {/* Rates Section */}
          {isEditing ? (
            <form onSubmit={handleSubmit(onSubmit)}>
              <div className='grid grid-cols-1 lg:grid-cols-2 gap-6'>
                <div className='space-y-2'>
                  <Input
                    label='Normal Rate'
                    type='number'
                    step='0.5'
                    min='0'
                    max='1000'
                    {...register('rateNormal', { valueAsNumber: true })}
                    icon={<Clock className='h-4 w-4 text-blue-600' />}
                    rightIcon={
                      <span className='text-xs text-gray-500 font-medium'>
                        $/hr
                      </span>
                    }
                    variant='modern'
                    className={
                      errors.rateNormal
                        ? 'border-red-300 focus:ring-red-500'
                        : 'bg-white border-gray-200'
                    }
                  />
                  {errors.rateNormal && (
                    <p className='text-xs text-red-600 mt-1 animate-in slide-in-from-top-1 duration-200'>
                      {errors.rateNormal.message}
                    </p>
                  )}
                </div>

                <div className='space-y-2'>
                  <Input
                    label='Special Rate'
                    type='number'
                    step='0.5'
                    min='0'
                    max='1000'
                    {...register('rateSpecial', { valueAsNumber: true })}
                    icon={<Star className='h-4 w-4 text-orange-600' />}
                    rightIcon={
                      <span className='text-xs text-gray-500 font-medium'>
                        $/hr
                      </span>
                    }
                    variant='modern'
                    className={
                      errors.rateSpecial
                        ? 'border-red-300 focus:ring-red-500'
                        : 'bg-white border-gray-200'
                    }
                  />
                  {errors.rateSpecial && (
                    <p className='text-xs text-red-600 mt-1 animate-in slide-in-from-top-1 duration-200'>
                      {errors.rateSpecial.message}
                    </p>
                  )}
                </div>
              </div>
            </form>
          ) : (
            <div className='grid grid-cols-1 lg:grid-cols-2 gap-6'>
              {/* Normal Rate Display */}
              <div className='group/rate relative overflow-hidden'>
                <div className='flex items-center gap-4 p-4 bg-gradient-to-br from-gray-50 to-gray-100/80 rounded-xl border border-gray-200/50'>
                  <div className='p-3 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl shadow-lg'>
                    <Clock className='h-5 w-5 text-white' />
                  </div>
                  <div className='flex-1'>
                    <p className='text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1'>
                      Normal Rate
                    </p>
                    <p className='text-2xl font-bold text-gray-900 tracking-tight'>
                      ${category.rateNormal.toFixed(2)}
                      <span className='text-sm font-medium text-gray-600 ml-1'>
                        /hr
                      </span>
                    </p>
                  </div>
                </div>
              </div>

              {/* Special Rate Display */}
              <div className='group/rate relative overflow-hidden'>
                <div className='flex items-center gap-4 p-4 bg-gradient-to-br from-orange-50 to-amber-50/80 rounded-xl border border-orange-200/50'>
                  <div className='p-3 bg-gradient-to-br from-orange-500 to-amber-600 rounded-xl shadow-lg'>
                    <Star className='h-5 w-5 text-white' />
                  </div>
                  <div className='flex-1'>
                    <p className='text-xs font-semibold text-orange-600 uppercase tracking-wider mb-1'>
                      Special Rate
                    </p>
                    <p className='text-2xl font-bold text-orange-900 tracking-tight'>
                      ${category.rateSpecial.toFixed(2)}
                      <span className='text-sm font-medium text-orange-700 ml-1'>
                        /hr
                      </span>
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default CategoryCard;
