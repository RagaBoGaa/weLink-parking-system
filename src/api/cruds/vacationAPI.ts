import { createApi } from '@reduxjs/toolkit/query/react';
import { Vacation } from '@/types/parking';
import customFetchBase from '@/api/middleware/customFetchBase';

export const VacationAPI = createApi({
  baseQuery: customFetchBase,
  reducerPath: 'vacation',
  tagTypes: ['Vacation'],
  endpoints: (builder) => ({
    // Vacation management
    getVacations: builder.query<Vacation[], null>({
      query: () => ({
        url: '/admin/vacations',
        method: 'GET',
      }),
      providesTags: ['Vacation'],
    }),

    createVacation: builder.mutation<Vacation, Omit<Vacation, 'id'>>({
      query: (data) => ({
        url: '/admin/vacations',
        method: 'POST',
        body: data,
      }),
      invalidatesTags: ['Vacation'],
    }),

    updateVacation: builder.mutation<
      Vacation,
      { id: string; data: Partial<Vacation> }
    >({
      query: ({ id, data }) => ({
        url: `/admin/vacations/${id}`,
        method: 'PUT',
        body: data,
      }),
      invalidatesTags: ['Vacation'],
    }),

    deleteVacation: builder.mutation<null, { id: string }>({
      query: ({ id }) => ({
        url: `/admin/vacations/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['Vacation'],
    }),
  }),
});

export const {
  useGetVacationsQuery,
  useCreateVacationMutation,
  useUpdateVacationMutation,
  useDeleteVacationMutation,
} = VacationAPI;
