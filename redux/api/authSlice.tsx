// src/authSlice.ts
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

interface AuthState {
  isAuthenticated: boolean;
  status: 'idle' | 'loading' | 'succeeded' | 'failed';
  error: string | null | undefined;
}

const initialState: AuthState = {
  isAuthenticated: false,
  status: 'idle',
  error: null,
};

// Async thunk for signing in user
export const signIn = createAsyncThunk('auth/signIn', async (userData: any) => {
  try {
    const response = await axios.post('https://your.api/endpoint/signin', userData);
    return response.data;
  } catch (error) {
    // throw new Error(error.response.data.message || 'An error occurred while signing in');
  }
});

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    // Action to sign out user
    signOut(state) {
      state.isAuthenticated = false;
      state.status = 'idle';
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(signIn.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(signIn.fulfilled, (state) => {
        state.isAuthenticated = true;
        state.status = 'succeeded';
        state.error = null;
      })
      .addCase(signIn.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.error.message;
      });
  },
});

export const { signOut } = authSlice.actions;

export default authSlice.reducer;
