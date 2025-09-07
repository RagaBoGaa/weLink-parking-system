import { toast } from 'react-hot-toast';
import { DollarSign } from 'lucide-react';

import {
  useGetCategoriesQuery,
  useUpdateCategoryRatesMutation,
} from '@/api/cruds';
import { MasterDataAPI } from '@/api/cruds/masterDataAPI';
import { useAppDispatch } from '@/api/store/store';

import LoadingIndicator from '@/components/LoadingIndicator';
import CategoryCard from './category-rate/CategoryCard';
import { AdminCardLayout } from '../shared/AdminCardLayout';

interface CategoryRateManagerProps {
  className?: string;
}

const CategoryRateManager = ({ className }: CategoryRateManagerProps) => {
  const dispatch = useAppDispatch();
  const {
    data: categoriesData,
    isLoading: categoriesLoading,
    error,
  } = useGetCategoriesQuery(null);
  const [updateCategoryRates, { isLoading: updateCategoryLoading }] =
    useUpdateCategoryRatesMutation();

  const handleUpdateCategoryRates = async (
    categoryId: string,
    rates: { rateNormal: number; rateSpecial: number }
  ) => {
    try {
      await updateCategoryRates({
        id: categoryId,
        data: rates,
      }).unwrap();

      // Manually invalidate the MasterDataAPI cache to refresh the categories
      dispatch(MasterDataAPI.util.invalidateTags(['Category']));

      toast.success('Category rates updated successfully');
    } catch (error: any) {
      toast.error(error?.data?.message || 'Failed to update category rates');
      throw error;
    }
  };

  if (categoriesLoading) {
    return <LoadingIndicator />;
  }

  return (
    <AdminCardLayout
      title='Category Rate Management'
      description='Update hourly rates for parking categories'
      icon={DollarSign}
      iconColor='from-blue-500 to-blue-600'
      isLoading={categoriesLoading}
      error={error}
      className={className}
    >
      {categoriesData?.map((category) => (
        <CategoryCard
          key={category.id}
          category={category}
          onUpdateRates={handleUpdateCategoryRates}
          isLoading={updateCategoryLoading}
        />
      ))}
    </AdminCardLayout>
  );
};

export default CategoryRateManager;
