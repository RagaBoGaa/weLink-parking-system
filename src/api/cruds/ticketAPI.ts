import { createApi } from '@reduxjs/toolkit/query/react';
import {
  Ticket,
  CheckinRequest,
  CheckinResponse,
  CheckoutRequest,
  CheckoutResponse,
} from '@/types/parking';
import customFetchBase from '@/api/middleware/customFetchBase';

export const TicketAPI = createApi({
  baseQuery: customFetchBase,
  reducerPath: 'ticket',
  tagTypes: ['Ticket', 'Zone'],
  endpoints: (builder) => ({
    // Ticket endpoints
    checkinTicket: builder.mutation<CheckinResponse, CheckinRequest>({
      query: (checkinData) => ({
        url: '/tickets/checkin',
        method: 'POST',
        body: checkinData,
      }),
      invalidatesTags: ['Zone', 'Ticket'],
    }),

    checkoutTicket: builder.mutation<CheckoutResponse, CheckoutRequest>({
      query: (checkoutData) => ({
        url: '/tickets/checkout',
        method: 'POST',
        body: checkoutData,
      }),
      invalidatesTags: ['Zone', 'Ticket'],
    }),

    getTicket: builder.query<Ticket, { id: string }>({
      query: ({ id }) => ({
        url: `/tickets/${id}`,
        method: 'GET',
      }),
      providesTags: (_result, _error, { id }) => [{ type: 'Ticket', id }],
    }),
  }),
});

export const {
  useCheckinTicketMutation,
  useCheckoutTicketMutation,
  useGetTicketQuery,
  useLazyGetTicketQuery,
} = TicketAPI;
