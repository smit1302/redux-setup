import { createSlice, PayloadAction } from '@reduxjs/toolkit';

// Define the initial state interface
interface SignUpState {
  signUpData: any;
}

// Define the initial state
const initialState: SignUpState = {
  signUpData: {},
};

// Create the sign up slice
const signUpSlice = createSlice({
  name: 'signUp',
  initialState,
  reducers: {
    // Action to add sign up data
    addSignUpData(state, action: PayloadAction<{ key: string; data: any }>) {
      if (state.signUpData[action.payload.key]) {
        console.log("signUpData in slice :",JSON.stringify(initialState.signUpData))
        state.signUpData[action.payload.key] = {
          ...state.signUpData[action.payload.key],
          ...action.payload.data,
        };
      }
    },
    // Action to compile sign up data
  },
});

// Export actions and reducer
export const { addSignUpData } = signUpSlice.actions;
export default signUpSlice.reducer;
