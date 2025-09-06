import { createApi } from '@reduxjs/toolkit/query/react';
import { Gate, Zone, Category } from '@/types/parking';
import customFetchBase from '@/api/middleware/customFetchBase';

export const MasterDataAPI = createApi({
  baseQuery: customFetchBase,
  reducerPath: 'masterData',
  tagTypes: ['Gate', 'Zone', 'Category'],
  endpoints: (builder) => ({
    // Master data endpoints (public)
    getGates: builder.query<Gate[], null>({
      query: () => ({
        url: '/master/gates',
        method: 'GET',
      }),
      providesTags: ['Gate'],
    }),

    getZonesByGate: builder.query<Zone[], { gateId: string }>({
      query: ({ gateId }) => ({
        url: `/master/zones?gateId=${gateId}`,
        method: 'GET',
      }),
      providesTags: ['Zone'],
    }),

    getCategories: builder.query<Category[], null>({
      query: () => ({
        url: '/master/categories',
        method: 'GET',
      }),
      providesTags: ['Category'],
    }),
  }),
});

export const {
  useGetGatesQuery,
  useGetZonesByGateQuery,
  useGetCategoriesQuery,
} = MasterDataAPI;
