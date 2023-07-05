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
      membersCount: null,
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
    factoryData: {
      assetsStoredOnGnosis: null,
      depositCloseTime: null,
      depositTokenAddress: null,
      distributionAmount: null,
      gnosisAddress: null,
      isDeployedByFactory: null,
      isTokenGatingApplied: null,
      maxDepositPerUser: null,
      merkleRoot: null,
      minDepositPerUser: null,
      ownerFeePerDepositPercent: null,
      pricePerToken: null,
    },
    nftsOwnedByDao: null,
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
      state.clubData.membersCount = action.payload.membersCount;
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
    addFactoryData: (state, action) => {
      state.factoryData.assetsStoredOnGnosis =
        action.payload.assetsStoredOnGnosis;
      state.factoryData.depositCloseTime = action.payload.depositCloseTime;
      state.factoryData.depositTokenAddress =
        action.payload.depositTokenAddress;
      state.factoryData.distributionAmount = action.payload.distributionAmount;
      state.factoryData.gnosisAddress = action.payload.gnosisAddress;
      state.factoryData.isDeployedByFactory =
        action.payload.isDeployedByFactory;
      state.factoryData.isTokenGatingApplied =
        action.payload.isTokenGatingApplied;
      state.factoryData.maxDepositPerUser = action.payload.maxDepositPerUser;
      state.factoryData.minDepositPerUser = action.payload.minDepositPerUser;
      state.factoryData.merkleRoot = action.payload.merkleRoot;
      state.factoryData.ownerFeePerDepositPercent =
        action.payload.ownerFeePerDepositPercent;
      state.factoryData.pricePerToken = action.payload.pricePerToken;
    },
    addNftsOwnedByDao: (state, action) => {
      state.nftsOwnedByDao = action.payload;
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
  addFactoryData,
  addNftsOwnedByDao,
} = slice.actions;

export default slice.reducer;
