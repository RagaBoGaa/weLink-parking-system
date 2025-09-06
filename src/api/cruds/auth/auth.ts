import { createApi } from '@reduxjs/toolkit/query/react';
import { LoginRequest, LoginResponse, User } from '@/types/parking';
import customFetchBase from '@/api/middleware/customFetchBase';

export const AuthAPI = createApi({
  baseQuery: customFetchBase,
  reducerPath: 'authApi',
  tagTypes: ['Auth', 'User'],
  endpoints: (builder) => ({
    login: builder.mutation<LoginResponse, LoginRequest>({
      query: (credentials) => ({
        url: '/auth/login',
        method: 'POST',
        body: credentials,
      }),
      invalidatesTags: ['Auth'],
    }),

    // Admin endpoints
    createUser: builder.mutation<User, Partial<User>>({
      query: (userData) => ({
        url: '/admin/users',
        method: 'POST',
        body: userData,
      }),
      invalidatesTags: ['User'],
    }),

    getUsers: builder.query<User[], null>({
      query: () => ({
        url: '/admin/users',
        method: 'GET',
      }),
      providesTags: ['User'],
    }),

    updateUser: builder.mutation<
      User,
      { id: string | number; userData: Partial<User> }
    >({
      query: ({ id, userData }) => ({
        url: `/admin/users/${id}`,
        method: 'PUT',
        body: userData,
      }),
      invalidatesTags: ['User'],
    }),

    deleteUser: builder.mutation<void, string | number>({
      query: (id) => ({
        url: `/admin/users/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['User'],
    }),
  }),
});

export const {
  useLoginMutation,
  useCreateUserMutation,
  useGetUsersQuery,
  useUpdateUserMutation,
  useDeleteUserMutation,
} = AuthAPI;
