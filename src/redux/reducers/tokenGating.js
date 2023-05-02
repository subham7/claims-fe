import { createSlice } from "@reduxjs/toolkit";

export const slice = createSlice({
  name: "tokenGating",
  initialState: {
    tokenSymbol: null,
    tokenAmount: null,
    tokenAddress: null,
    tokens: [],
  },

  reducers: {
    addTokenSymbol: (state, action) => {
      state.tokenSymbol = action.payload;
    },
    addTokenAmount: (state, action) => {
      state.tokenAmount = action.payload;
    },
    addTokenAddress: (state, action) => {
      state.tokenAddress = action.payload;
    },
    addTokens: (state, action) => {
      state.tokens = action.payload;
    },
  },
});

export const { addTokenSymbol, addTokenAmount, addTokenAddress, addTokens } =
  slice.actions;
export default slice.reducer;
