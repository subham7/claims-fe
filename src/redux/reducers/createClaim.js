import { createSlice } from "@reduxjs/toolkit";

export const slice = createSlice({
  name: "createClaim",
  initialState: {
    userData: null
  },
  reducers: {
    addUserData: (state, action) => {
      state.userData = action.payload;
    },
   
  },
});

export const { addUserData } = slice.actions;

export default slice.reducer;
