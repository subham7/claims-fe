import { createSlice } from "@reduxjs/toolkit";

export const slice = createSlice({
  name: "createClaim",
  initialState: {
    claimContractData: null,
    claimEnabled: true,
  },
  reducers: {
    addClaimContractData: (state, action) => {
      state.claimContractData = action.payload;
    },

    addClaimEnabled: (state, action) => {
      state.claimEnabled = action.payload;
    },
  },
});

export const {
  addClaimContractData,

  addClaimEnabled,
} = slice.actions;

export default slice.reducer;
