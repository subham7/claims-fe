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
      maxTokensPerUser: null,
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
      depositTokenDecimal: null,
      depositTokenSymbol: null,
      adminAddresses: null,
      currentSafeThreshold: null,
      pricePerTokenFormatted: {
        formattedValue: null,
        actualValue: null,
        bigNumberValue: null,
      },
      minDepositAmountFormatted: {
        formattedValue: null,
        actualValue: null,
        bigNumberValue: null,
      },
      maxDepositAmountFormatted: {
        formattedValue: null,
        actualValue: null,
        bigNumberValue: null,
      },
      raiseAmountFormatted: {
        formattedValue: null,
        actualValue: null,
        bigNumberValue: null,
      },
      totalAmountRaisedFormatted: {
        formattedValue: null,
        actualValue: null,
        bigNumberValue: null,
      },
      distributionAmountFormatted: {
        formattedValue: null,
        actualValue: null,
        bigNumberValue: null,
      },
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
      state.clubData.imgUrl = action.payload.imgUrl;
      state.clubData.depositTokenAddress = action.payload.depositTokenAddress;
      state.clubData.assetsStoredOnGnosis = action.payload.assetsStoredOnGnosis;
      state.clubData.depositCloseTime = action.payload.depositCloseTime;
      state.clubData.isDeployedByFactory = action.payload.isDeployedByFactory;
      state.clubData.isTokenGatingApplied = action.payload.isTokenGatingApplied;
      state.clubData.maxDepositPerUser = action.payload.maxDepositPerUser;
      state.clubData.minDepositPerUser = action.payload.minDepositPerUser;
      state.clubData.ownerFeePerDepositPercent =
        action.payload.ownerFeePerDepositPercent;
      state.clubData.merkleRoot = action.payload.merkleRoot;
      state.clubData.pricePerTokenFormatted =
        action.payload.pricePerTokenFormatted;
      state.clubData.minDepositAmountFormatted =
        action.payload.minDepositAmountFormatted;
      state.clubData.maxDepositAmountFormatted =
        action.payload.maxDepositAmountFormatted;
      state.clubData.raiseAmountFormatted = action.payload.raiseAmountFormatted;
      state.clubData.totalAmountRaisedFormatted =
        action.payload.totalAmountRaisedFormatted;
      state.clubData.distributionAmountFormatted =
        action.payload.distributionAmountFormatted;

      state.clubData.depositTokenDecimal = action.payload.depositTokenDecimal;
      state.clubData.depositTokenSymbol = action.payload.depositTokenSymbol;
      state.clubData.adminAddresses = action.payload.adminAddresses;
      state.clubData.currentSafeThreshold = action.payload.currentSafeThreshold;
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
  addNftsOwnedByDao,
} = slice.actions;

export default slice.reducer;
