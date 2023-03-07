import { createSlice } from "@reduxjs/toolkit";

export const slice = createSlice({
  name: "user",
  initialState: {
    wallet: null,
  },
  reducers: {
    addWalletAddress: (state, action) => {
      state.wallet = action.payload;
    },
  },
});

export const { addWalletAddress } = slice.actions;

export default slice.reducer;
