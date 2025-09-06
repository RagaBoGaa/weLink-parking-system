import {
  BaseQueryFn,
  FetchArgs,
  fetchBaseQuery,
  FetchBaseQueryError,
} from '@reduxjs/toolkit/query';
import Cookies from 'js-cookie';

const getToken = () => {
  const token = Cookies.get('token');
  return token;
};

const baseQuery = fetchBaseQuery({
  baseUrl: 'http://localhost:3000/api/v1',
  prepareHeaders: (headers) => {
    const token = getToken();
    if (token) {
      headers.set('Authorization', `Bearer ${token}`);
    }

    return headers;
  },
});

const customFetchBase: BaseQueryFn<
  string | FetchArgs,
  any,
  FetchBaseQueryError
> = async (args, api, extraOptions) => {
  const result = await baseQuery(args, api, extraOptions);

  if (result.error && result.error.status === 401) {
    Cookies.remove('token');
    Cookies.remove('user');

    if (window.location.pathname !== '/login') {
      window.location.href = '/login';
    }
  }

  return result;
};

export default customFetchBase;
