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
    adminUser: false,
    tokenSymbol: null,
    tokenDecimal: null,
    governanceTokenDecimal: null,
    createDaoGnosisSigned: false,
    createDaoAuthorized: false,
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
    },
    setAdminUser: (state, action) => {
      state.adminUser = action.payload;
    },
    setGovernanceTokenDetails: (state, action) => {
      state.governanceTokenDecimal = action.payload;
    },
    setUSDCTokenDetails: (state, action) => {
      state.tokenSymbol = action.payload.tokenSymbol;
      state.tokenDecimal = action.payload.tokenDecimal;
    },
    setCreateDaoGnosisSigned: (state, action) => {
      state.createDaoGnosisSigned = action.payload;
    },
    setCreateDaoAuthorized: (state, action) => {
      state.createDaoAuthorized = action.payload;
    }
  },
});

export const {
  safeConnected,
  safeDisconnected,
  addSafeAddress,
  addContractAddress,
  setAdminUser,
  setGovernanceTokenDetails,
  setUSDCTokenDetails,
  setCreateDaoGnosisSigned,
  setCreateDaoAuthorized
} = slice.actions;

export default slice.reducer;
