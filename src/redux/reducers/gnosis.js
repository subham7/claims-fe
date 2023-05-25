import { createSlice } from "@reduxjs/toolkit";

export const slice = createSlice({
  name: "gnosis",
  initialState: {
    factoryContractAddress: null,
    usdcContractAddress: null,
    actionContractAddress: null,
    subgraphUrl: null,
    transactionUrl: null,
    networkHex: null,
    networkId: null,
    networkName: null,
    clubNetworkId: null,
    adminUser: false,
    memberUser: false,
    setUploadNFTLoading: false,
    setCreateSafeLoading: false,
    setCreateSafeError: false,
    setCreateSafeErrorCode: null,
    createDaoAuthorized: false,
    wrongNetwork: false,
  },
  reducers: {
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
    setWrongNetwork: (state, action) => {
      state.wrongNetwork = action.payload;
    },
  },
});

export const {
  addContractAddress,
  setAdminUser,
  setMemberUser,
  setGovernanceTokenDetails,
  setUploadNFTLoading,
  setCreateSafeLoading,
  setCreateSafeError,
  setCreateSafeErrorCode,
  setCreateDaoAuthorized,
  setWrongNetwork,
} = slice.actions;

export default slice.reducer;
