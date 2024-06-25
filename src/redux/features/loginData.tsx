import { createSlice, PayloadAction } from '@reduxjs/toolkit';

// Define the initial state interface
interface LoginState {
  loginData: any;
}

// Define the initial state
const initialState: LoginState = {
  loginData: {},
};

// Create the login slice
const loginSlice = createSlice({
    name: 'login',
    initialState,
    reducers: {
      addLoginData(state, action: PayloadAction<any>) {
        state.loginData = action.payload;
      },
    },
  });

// Export actions and reducer
export const { addLoginData } = loginSlice.actions;
export default loginSlice.reducer;
