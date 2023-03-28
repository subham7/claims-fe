import { createSlice } from "@reduxjs/toolkit";

export const slice = createSlice({
  name: "createClaim",
  initialState: {
    userData: null,
    claimContractData: null,
    claimContractAddress: null,
  },
  reducers: {
    addUserData: (state, action) => {
      state.userData = action.payload;
    },

    addClaimContractData: (state, action) => {
      state.claimContractData = action.payload;
    },

    addClaimContractAddress: (state, action) => {
      state.claimContractAddress = action.payload;
    },
  },
});

export const { addUserData, addClaimContractData, addClaimContractAddress } =
  slice.actions;

export default slice.reducer;
