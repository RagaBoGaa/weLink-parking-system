import { createApi } from '@reduxjs/toolkit/query/react';
import { Subscription } from '@/types/parking';
import customFetchBase from '@/api/middleware/customFetchBase';

export const SubscriptionAPI = createApi({
  baseQuery: customFetchBase,
  reducerPath: 'subscription',
  tagTypes: ['Subscription'],
  endpoints: (builder) => ({
    // Subscription endpoints
    getSubscription: builder.query<Subscription, { id: string }>({
      query: ({ id }) => ({
        url: `/subscriptions/${id}`,
        method: 'GET',
      }),
      providesTags: (_result, _error, { id }) => [{ type: 'Subscription', id }],
    }),

    // Subscription management
    getSubscriptions: builder.query<Subscription[], null>({
      query: () => ({
        url: '/admin/subscriptions',
        method: 'GET',
      }),
      providesTags: ['Subscription'],
    }),

    createSubscription: builder.mutation<
      Subscription,
      Omit<Subscription, 'id'>
    >({
      query: (data) => ({
        url: '/admin/subscriptions',
        method: 'POST',
        body: data,
      }),
      invalidatesTags: ['Subscription'],
    }),

    updateSubscription: builder.mutation<
      Subscription,
      { id: string; data: Partial<Subscription> }
    >({
      query: ({ id, data }) => ({
        url: `/admin/subscriptions/${id}`,
        method: 'PUT',
        body: data,
      }),
      invalidatesTags: ['Subscription'],
    }),
  }),
});

export const {
  useGetSubscriptionQuery,
  useGetSubscriptionsQuery,
  useLazyGetSubscriptionsQuery,
  useCreateSubscriptionMutation,
  useUpdateSubscriptionMutation,
} = SubscriptionAPI;
