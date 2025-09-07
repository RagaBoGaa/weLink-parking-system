import { useState } from 'react';
import { toast } from 'react-hot-toast';
import {
  Calendar,
  Plus,
  Plane,
  Loader2,
  RotateCcw,
  Sparkles,
} from 'lucide-react';

import { useCreateVacationMutation } from '@/api/cruds';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

interface VacationFormData {
  name: string;
  from: string;
  to: string;
}

interface VacationFormProps {
  onSuccess?: () => void;
  className?: string;
}

const VacationForm = ({ onSuccess, className }: VacationFormProps) => {
  const [formData, setFormData] = useState<VacationFormData>({
    name: '',
    from: '',
    to: '',
  });

  const [createVacation, { isLoading: isCreating }] =
    useCreateVacationMutation();

  const handleInputChange = (field: keyof VacationFormData, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const validateForm = (): boolean => {
    if (!formData.name?.trim()) {
      toast.error('Please enter a vacation name');
      return false;
    }

    if (!formData.from) {
      toast.error('Please select a start date');
      return false;
    }

    if (!formData.to) {
      toast.error('Please select an end date');
      return false;
    }

    if (formData.from >= formData.to) {
      toast.error('Start date must be before end date');
      return false;
    }

    // Check if start date is in the past (optional validation)
    const today = new Date().toISOString().split('T')[0];
    if (formData.from < today) {
      toast.error('Start date cannot be in the past');
      return false;
    }

    return true;
  };

  const handleSubmit = async () => {
    if (!validateForm()) return;

    try {
      await createVacation(formData).unwrap();
      toast.success('🎉 Vacation period created successfully!');
      resetForm();
      onSuccess?.();
    } catch (error: any) {
      toast.error(error?.data?.message || 'Failed to create vacation period');
    }
  };

  const resetForm = () => {
    setFormData({ name: '', from: '', to: '' });
  };

  const isFormValid = formData.name.trim() && formData.from && formData.to;

  return (
    <Card
      variant='glass'
      className={`border-dashed border-2 border-blue-200 hover:border-blue-300 transition-all duration-300 hover:shadow-lg ${className}`}
    >
      <CardHeader className='pb-4'>
        <div className='flex items-center gap-3'>
          <div className='p-3 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl text-white shadow-lg'>
            <Sparkles className='h-5 w-5' />
          </div>
          <div>
            <CardTitle className='text-xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent'>
              Add New Vacation Period
            </CardTitle>
            <p className='text-sm text-gray-500 mt-1'>
              Create special rate periods for holidays and vacations
            </p>
          </div>
        </div>
      </CardHeader>

      <CardContent className='space-y-6'>
        <div className='grid grid-cols-1 lg:grid-cols-3 gap-6'>
          <div className='space-y-2'>
            <Input
              label='Vacation Name'
              type='text'
              value={formData.name}
              onChange={(e) => handleInputChange('name', e.target.value)}
              placeholder='e.g., Eid Holiday, Christmas Break'
              icon={<Plane className='h-4 w-4' />}
              variant='modern'
              className='transition-all duration-200 focus-within:scale-[1.02]'
            />
            <p className='text-xs text-gray-400'>
              Give this vacation period a memorable name
            </p>
          </div>

          <div className='space-y-2'>
            <Input
              label='Start Date'
              type='date'
              value={formData.from}
              onChange={(e) => handleInputChange('from', e.target.value)}
              icon={<Calendar className='h-4 w-4' />}
              variant='modern'
              min={new Date().toISOString().split('T')[0]}
              className='transition-all duration-200 focus-within:scale-[1.02]'
            />
            <p className='text-xs text-gray-400'>
              When does the vacation period begin?
            </p>
          </div>

          <div className='space-y-2'>
            <Input
              label='End Date'
              type='date'
              value={formData.to}
              onChange={(e) => handleInputChange('to', e.target.value)}
              icon={<Calendar className='h-4 w-4' />}
              variant='modern'
              min={formData.from || new Date().toISOString().split('T')[0]}
              className='transition-all duration-200 focus-within:scale-[1.02]'
            />
            <p className='text-xs text-gray-400'>
              When does the vacation period end?
            </p>
          </div>
        </div>

        {/* Preview section */}
        {isFormValid && (
          <div className='bg-gradient-to-r from-blue-50 to-purple-50 rounded-xl p-4 border border-blue-100 animate-in slide-in-from-bottom-4 duration-300'>
            <div className='flex items-center gap-2 mb-2'>
              <Plane className='h-4 w-4 text-blue-600' />
              <span className='font-medium text-blue-900'>Preview</span>
            </div>
            <p className='text-sm text-blue-700'>
              <strong>{formData.name}</strong> from{' '}
              <strong>{new Date(formData.from).toLocaleDateString()}</strong> to{' '}
              <strong>{new Date(formData.to).toLocaleDateString()}</strong>
              {formData.from && formData.to && (
                <span className='text-blue-600'>
                  {' '}
                  (
                  {Math.ceil(
                    (new Date(formData.to).getTime() -
                      new Date(formData.from).getTime()) /
                      (1000 * 60 * 60 * 24)
                  ) + 1}{' '}
                  days)
                </span>
              )}
            </p>
          </div>
        )}

        <div className='flex gap-3 pt-2'>
          <Button
            onClick={handleSubmit}
            disabled={isCreating || !isFormValid}
            className='flex-1 gap-2 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-[1.02]'
            size='lg'
          >
            {isCreating ? (
              <>
                <Loader2 className='h-4 w-4 animate-spin' />
                Creating...
              </>
            ) : (
              <>
                <Plus className='h-4 w-4' />
                Add Vacation Period
              </>
            )}
          </Button>

          <Button
            onClick={resetForm}
            variant='outline'
            size='lg'
            className='gap-2 hover:bg-gray-50 transition-all duration-200 hover:scale-[1.02]'
            disabled={isCreating}
          >
            <RotateCcw className='h-4 w-4' />
            Reset
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default VacationForm;
