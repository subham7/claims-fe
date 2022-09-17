import { createSlice } from "@reduxjs/toolkit";

export const slice = createSlice({
  name: "gnosis",
  initialState: {
    safeAddress: null,
    safeSdk: null,
    factoryContractAddress: null,
    usdcContractAddress: null,
    transactionUrl: null,
    networkHex: null,
    networkId: null,
    networkName: null,
  },
  reducers: {
    safeConnected: (state, action) => {
      state.safeAddress = action.payload.safeAddress;
      state.safeSdk = action.payload.safeSdk;
    },
    addSafeAddress: (state, action) => {
      state.safeAddress = action.payload;
    },
    safeDisconnected: (state, action) => {
      state.safeAddress = null;
      state.safeSdk = null;
    },
    addContractAddress: (state, action) => {
      state.factoryContractAddress = action.payload.factoryContractAddress;
      state.usdcContractAddress = action.payload.usdcContractAddress;
      state.transactionUrl = action.payload.transactionUrl;
      state.networkHex = action.payload.networkHex;
      state.networkId = action.payload.networkId;
      state.networkName = action.payload.networkName;
    }
  }
});

export const {
  safeConnected,
  safeDisconnected,
  addSafeAddress,
  addContractAddress,
} = slice.actions

export default slice.reducer