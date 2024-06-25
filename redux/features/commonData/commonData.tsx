import { createSlice, PayloadAction } from '@reduxjs/toolkit';

// Define the initial state interface
interface SignUpState {
  commonData: any;
}

// Define the initial state
const initialState: SignUpState = {
  commonData: {},
};

// Create the sign up slice
const commonDataSlice = createSlice({
  name: 'commonData',
  initialState,
  reducers: {
    // Action to add sign up data
    addData: (state, action: PayloadAction<{ key: string; data: any, id?: any }>) => {
      state.commonData[action.payload.key] = action.payload.data;

    },

  },
});

// Export actions and reducer
export const { addData } = commonDataSlice.actions;
export default commonDataSlice.reducer;
