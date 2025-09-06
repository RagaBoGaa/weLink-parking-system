import { combineReducers, configureStore } from '@reduxjs/toolkit';
import { TypedUseSelectorHook, useDispatch, useSelector } from 'react-redux';
import AuthReducer from '@/state/auth';
import {
  MasterDataAPI,
  TicketAPI,
  SubscriptionAPI,
  AdminAPI,
  RushHourAPI,
  VacationAPI,
} from '../cruds';
import { AuthAPI } from '../cruds/auth/auth';

const reducers = combineReducers({
  auth: AuthReducer,
  [MasterDataAPI.reducerPath]: MasterDataAPI.reducer,
  [TicketAPI.reducerPath]: TicketAPI.reducer,
  [SubscriptionAPI.reducerPath]: SubscriptionAPI.reducer,
  [AdminAPI.reducerPath]: AdminAPI.reducer,
  [RushHourAPI.reducerPath]: RushHourAPI.reducer,
  [VacationAPI.reducerPath]: VacationAPI.reducer,
  [AuthAPI.reducerPath]: AuthAPI.reducer,
});

const Store = configureStore({
  reducer: reducers,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(
      MasterDataAPI.middleware,
      TicketAPI.middleware,
      SubscriptionAPI.middleware,
      AdminAPI.middleware,
      RushHourAPI.middleware,
      VacationAPI.middleware,
      AuthAPI.middleware
    ),
});

export type RootState = ReturnType<typeof Store.getState>;
export type AppDispatch = typeof Store.dispatch;
export const useAppDispatch = () => useDispatch<AppDispatch>();
export const useTypedSelector: TypedUseSelectorHook<RootState> = useSelector;
export default Store;
