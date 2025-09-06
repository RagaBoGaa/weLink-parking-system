import { createApi } from '@reduxjs/toolkit/query/react';
import { Zone, Category } from '@/types/parking';
import customFetchBase from '@/api/middleware/customFetchBase';

export const AdminAPI = createApi({
  baseQuery: customFetchBase,
  reducerPath: 'admin',
  tagTypes: ['Report', 'Category', 'Zone'],
  endpoints: (builder) => ({
    // Admin endpoints
    getParkingStateReport: builder.query<Zone[], null>({
      query: () => ({
        url: '/admin/reports/parking-state',
        method: 'GET',
      }),
      providesTags: ['Report'],
    }),

    updateCategoryRates: builder.mutation<
      Category,
      { id: string; data: Partial<Category> }
    >({
      query: ({ id, data }) => ({
        url: `/admin/categories/${id}`,
        method: 'PUT',
        body: data,
      }),
      invalidatesTags: ['Category', 'Zone'],
    }),

    updateZoneStatus: builder.mutation<Zone, { id: string; open: boolean }>({
      query: ({ id, open }) => ({
        url: `/admin/zones/${id}/open`,
        method: 'PUT',
        body: { open },
      }),
      invalidatesTags: ['Zone'],
    }),
  }),
});

export const {
  useGetParkingStateReportQuery,
  useUpdateCategoryRatesMutation,
  useUpdateZoneStatusMutation,
} = AdminAPI;
