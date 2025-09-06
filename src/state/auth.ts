import { LoginResponse, User } from '@/types/parking';
import { createSlice } from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit';
import Cookies from 'js-cookie';

export interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  token: string | null;
}

const getInitialState = (): AuthState => {
  const token = Cookies.get('token') || null;
  const userStr = Cookies.get('user');
  let user = null;

  try {
    if (userStr) {
      user = JSON.parse(userStr);
    }
  } catch (error) {
    console.error('Failed to parse user from cookies', error);
  }

  return {
    user,
    isAuthenticated: !!token && !!user,
    token,
  };
};

const initialState: AuthState = getInitialState();

export const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setUser: (state, action: PayloadAction<User>) => {
      state.user = action.payload;
      state.isAuthenticated = true;
    },
    setCredentials: (state, action: PayloadAction<LoginResponse>) => {
      const { user, token } = action.payload;

      state.user = user;
      state.token = token;
      state.isAuthenticated = true;

      Cookies.set('token', token);
      Cookies.set('user', JSON.stringify(user));
    },
    logout: (state) => {
      state.user = null;
      state.token = null;
      state.isAuthenticated = false;

      Cookies.remove('token');
      Cookies.remove('user');
    },
  },
});

export const { setUser, setCredentials, logout } = authSlice.actions;

export default authSlice.reducer;
