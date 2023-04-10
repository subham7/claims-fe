import { createSlice } from "@reduxjs/toolkit";

export const slice = createSlice({
  name: "createClaim",
  initialState: {
    userData: null,
    claimContractData: null,
    claimContractAddress: null,
    merkleLeaves: [],
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

    addMerkleLeaves: (state, action) => {
      state.merkleLeaves = action.payload;
    },
  },
});

export const {
  addUserData,
  addClaimContractData,
  addClaimContractAddress,
  addMerkleLeaves,
} = slice.actions;

export default slice.reducer;
