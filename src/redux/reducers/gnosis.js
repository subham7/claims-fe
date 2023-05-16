import { createSlice } from "@reduxjs/toolkit";

export const slice = createSlice({
  name: "gnosis",
  initialState: {
    safeAddress: null,
    safeSdk: null,
    factoryContractAddress: null,
    usdcContractAddress: null,
    actionContractAddress: null,
    subgraphUrl: null,
    transactionUrl: null,
    networkHex: null,
    networkId: null,
    networkName: null,
    adminUser: false,
    memberUser: false,
    tokenSymbol: null,
    tokenDecimal: null,
    governanceTokenDecimal: null,
    setUploadNFTLoading: false,
    setCreateSafeLoading: false,
    setCreateSafeError: false,
    setCreateSafeErrorCode: null,
    createDaoAuthorized: false,
    governanceAllowed: true,
    redirectToCreate: false,
    wrongNetwork: false,
    clubNetworkId: null,
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
      state.actionContractAddress = action.payload.actionContractAddress;
      state.subgraphUrl = action.payload.subgraphUrl;
      state.transactionUrl = action.payload.transactionUrl;
      state.networkHex = action.payload.networkHex;
      state.networkId = action.payload.networkId;
      state.networkName = action.payload.networkName;
      state.clubNetworkId = action.payload.clubNetworkId;
    },
    setAdminUser: (state, action) => {
      state.adminUser = action.payload;
    },
    setMemberUser: (state, action) => {
      state.memberUser = action.payload;
    },
    setGovernanceTokenDetails: (state, action) => {
      state.governanceTokenDecimal = action.payload;
    },
    setUSDCTokenDetails: (state, action) => {
      state.tokenSymbol = action.payload.tokenSymbol;
      state.tokenDecimal = action.payload.tokenDecimal;
    },
    setUploadNFTLoading: (state, action) => {
      state.setUploadNFTLoading = action.payload;
    },
    setCreateSafeLoading: (state, action) => {
      state.setCreateSafeLoading = action.payload;
    },
    setCreateSafeError: (state, action) => {
      state.setCreateSafeError = action.payload;
    },
    setCreateSafeErrorCode: (state, action) => {
      state.setCreateSafeErrorCode = action.payload;
    },
    setCreateDaoAuthorized: (state, action) => {
      state.createDaoAuthorized = action.payload;
    },
    setGovernanceAllowed: (state, action) => {
      state.governanceAllowed = action.payload;
    },
    setRedirectToCreate: (state, action) => {
      state.redirectToCreate = action.payload;
    },
    setWrongNetwork: (state, action) => {
      state.wrongNetwork = action.payload;
    },
  },
});

export const {
  safeConnected,
  safeDisconnected,
  addSafeAddress,
  addContractAddress,
  setAdminUser,
  setMemberUser,
  setGovernanceTokenDetails,
  setUSDCTokenDetails,
  setUploadNFTLoading,
  setCreateSafeLoading,
  setCreateSafeError,
  setCreateSafeErrorCode,
  setCreateDaoAuthorized,
  setGovernanceAllowed,
  setRedirectToCreate,
  setWrongNetwork,
} = slice.actions;

export default slice.reducer;
