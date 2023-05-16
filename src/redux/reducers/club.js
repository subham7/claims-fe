import { createSlice } from "@reduxjs/toolkit";

export const slice = createSlice({
  name: "club",
  initialState: {
    daoAddress: null,
    clubData: {
      gnosisAddress: null,
      isGtTransferable: null,
      name: null,
      ownerAddress: null,
      symbol: null,
      tokenType: null,
    },
    erc20ClubDetails: {
      quorum: null,
      threshold: null,
      isGovernanceActive: null,
      isTransferable: null,
      onlyAllowWhitelist: null,
      deployerAddress: null,
    },
    erc721ClubDetails: {
      quorum: null,
      threshold: null,
      isGovernanceActive: null,
      isTransferable: null,
      maxTokensPerUser: null,
      isNftTotalSupplyUnlimited: null,
      onlyAllowWhitelist: null,
      deployerAddress: null,
    },
    clubNetworkId: null,
  },
  reducers: {
    addDaoAddress: (state, action) => {
      state.daoAddress = action.payload;
    },
    addClubData: (state, action) => {
      state.clubData.gnosisAddress = action.payload.gnosisAddress;
      state.clubData.isGtTransferable = action.payload.isGtTransferable;
      state.clubData.name = action.payload.name;
      state.clubData.ownerAddress = action.payload.ownerAddress;
      state.clubData.symbol = action.payload.symbol;
      state.clubData.tokenType = action.payload.tokenType;
    },
    addErc20ClubDetails: (state, action) => {
      state.erc20ClubDetails.quorum = action.payload.quorum;
      state.erc20ClubDetails.threshold = action.payload.threshold;
      state.erc20ClubDetails.isGovernanceActive =
        action.payload.isGovernanceActive;
      state.erc20ClubDetails.isTransferable = action.payload.isTransferable;
      state.erc20ClubDetails.onlyAllowWhitelist =
        action.payload.onlyAllowWhitelist;
      state.erc20ClubDetails.deployerAddress = action.payload.deployerAddress;
    },
    addErc721ClubDetails: (state, action) => {
      state.erc721ClubDetails.quorum = action.payload.quorum;
      state.erc721ClubDetails.threshold = action.payload.threshold;
      state.erc721ClubDetails.isGovernanceActive =
        action.payload.isGovernanceActive;
      state.erc721ClubDetails.isTransferable = action.payload.isTransferable;
      state.erc721ClubDetails.maxTokensPerUser =
        action.payload.maxTokensPerUser;
      state.erc721ClubDetails.isNftTotalSupplyUnlimited =
        action.payload.isNftTotalSupplyUnlimited;
      state.erc721ClubDetails.onlyAllowWhitelist =
        action.payload.onlyAllowWhitelist;
      state.erc721ClubDetails.deployerAddress = action.payload.deployerAddress;
    },
    setClubNetworkId: (state, action) => {
      state.clubNetworkId = action.payload;
    },
  },
  middleware: (getDefaultMiddleware) => getDefaultMiddleware(),
});

export const {
  addDaoAddress,
  addClubData,
  addErc20ClubDetails,
  addErc721ClubDetails,
  setClubNetworkId,
} = slice.actions;

export default slice.reducer;
