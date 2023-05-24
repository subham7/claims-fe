import { createSlice } from "@reduxjs/toolkit";

export const slice = createSlice({
  name: "createClaim",
  initialState: {
    claimContractData: null,
    claimEnabled: true,
    claimsOn: null,
  },
  reducers: {
    addClaimContractData: (state, action) => {
      state.claimContractData = action.payload;
    },
    addClaimsOn: (state, action) => {
      state.claimsOn = action.payload;
    },
    addClaimEnabled: (state, action) => {
      state.claimEnabled = action.payload;
    },
  },
});

export const { addClaimContractData, addClaimsOn, addClaimEnabled } =
  slice.actions;

export default slice.reducer;
