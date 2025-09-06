export { MasterDataAPI } from './masterDataAPI';
export { TicketAPI } from './ticketAPI';
export { SubscriptionAPI } from './subscriptionAPI';
export { AdminAPI } from './adminAPI';
export { RushHourAPI } from './rushHourAPI';
export { VacationAPI } from './vacationAPI';

export {
  useGetGatesQuery,
  useGetZonesByGateQuery,
  useGetCategoriesQuery,
} from './masterDataAPI';

export {
  useCheckinTicketMutation,
  useCheckoutTicketMutation,
  useGetTicketQuery,
  useLazyGetTicketQuery,
} from './ticketAPI';

export {
  useGetSubscriptionQuery,
  useGetSubscriptionsQuery,
  useLazyGetSubscriptionsQuery,
  useCreateSubscriptionMutation,
  useUpdateSubscriptionMutation,
} from './subscriptionAPI';

export {
  useGetParkingStateReportQuery,
  useUpdateCategoryRatesMutation,
  useUpdateZoneStatusMutation,
} from './adminAPI';

export {
  useGetRushHoursQuery,
  useCreateRushHourMutation,
  useUpdateRushHourMutation,
  useDeleteRushHourMutation,
} from './rushHourAPI';

export {
  useGetVacationsQuery,
  useCreateVacationMutation,
  useUpdateVacationMutation,
  useDeleteVacationMutation,
} from './vacationAPI';
