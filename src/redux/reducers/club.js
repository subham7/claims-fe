import { createSlice } from "@reduxjs/toolkit";

export const slice = createSlice({
  name: "club",
  initialState: {
    clubData: {
      gnosisAddress: null,
      isGtTransferable: null,
      name: null,
      ownerAddress: null,
      symbol: null,
      tokenType: null,
      membersCount: null,
      deployedTime: null,
      imgUrl: null,
      minDepositAmount: null,
      maxDepositAmount: null,
      pricePerToken: null,
      isGovernanceActive: null,
      quorum: null,
      threshold: null,
      raiseAmount: null,
      totalAmountRaised: null,
      distributionAmount: null,
      maxTokensPerUser: null,
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
    addClubData: (state, action) => {
      state.clubData.gnosisAddress = action.payload.gnosisAddress;
      state.clubData.isGtTransferable = action.payload.isGtTransferable;
      state.clubData.name = action.payload.name;
      state.clubData.ownerAddress = action.payload.ownerAddress;
      state.clubData.symbol = action.payload.symbol;
      state.clubData.tokenType = action.payload.tokenType;
      state.clubData.membersCount = action.payload.membersCount;
      state.clubData.deployedTime = action.payload.deployedTime;
      state.clubData.minDepositAmount = action.payload.minDepositAmount;
      state.clubData.maxDepositAmount = action.payload.maxDepositAmount;
      state.clubData.pricePerToken = action.payload.pricePerToken;
      state.clubData.threshold = action.payload.threshold;
      state.clubData.isGovernanceActive = action.payload.isGovernanceActive;
      state.clubData.raiseAmount = action.payload.raiseAmount;
      state.clubData.maxTokensPerUser = action.payload.maxTokensPerUser;
      state.clubData.distributionAmount = action.payload.distributionAmount;
      state.clubData.totalAmountRaised = action.payload.totalAmountRaised;
      state.clubData.quorum = action.payload.quorum;
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
  addClubData,
  addErc20ClubDetails,
  addErc721ClubDetails,
  addFactoryData,
  addNftsOwnedByDao,
} = slice.actions;

export default slice.reducer;
