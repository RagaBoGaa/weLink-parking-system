import { createApi } from '@reduxjs/toolkit/query/react';
import { RushHour } from '@/types/parking';
import customFetchBase from '@/api/middleware/customFetchBase';

export const RushHourAPI = createApi({
  baseQuery: customFetchBase,
  reducerPath: 'rushHour',
  tagTypes: ['RushHour'],
  endpoints: (builder) => ({
    // Rush hours management
    getRushHours: builder.query<RushHour[], null>({
      query: () => ({
        url: '/admin/rush-hours',
        method: 'GET',
      }),
      providesTags: ['RushHour'],
    }),

    createRushHour: builder.mutation<RushHour, Omit<RushHour, 'id'>>({
      query: (data) => ({
        url: '/admin/rush-hours',
        method: 'POST',
        body: data,
      }),
      invalidatesTags: ['RushHour'],
    }),

    updateRushHour: builder.mutation<
      RushHour,
      { id: string; data: Partial<RushHour> }
    >({
      query: ({ id, data }) => ({
        url: `/admin/rush-hours/${id}`,
        method: 'PUT',
        body: data,
      }),
      invalidatesTags: ['RushHour'],
    }),

    deleteRushHour: builder.mutation<null, { id: string }>({
      query: ({ id }) => ({
        url: `/admin/rush-hours/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['RushHour'],
    }),
  }),
});

export const {
  useGetRushHoursQuery,
  useCreateRushHourMutation,
  useUpdateRushHourMutation,
  useDeleteRushHourMutation,
} = RushHourAPI;
