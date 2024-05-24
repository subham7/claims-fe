import { DEFI_PROPOSALS_ETH_POOLS } from "utils/proposalConstants";

export const executionIdsForStakeETH = [
  24, 17, 26, 39, 45, 35, 31, 33, 37, 41, 47, 57, 51, 53,
];

export const executionIdsForUnstakeETH = [
  65, 18, 27, 40, 46, 36, 32, 34, 38, 42, 48, 58, 52, 54,
];

export const findUsdcPoolByExecutionId = (executionId) => {
  const ethPools = DEFI_PROPOSALS_ETH_POOLS({
    networkId,
  });

  const poolDetails = [];

  ethPools.forEach((pool) => {
    if (
      pool.executionIds.Stake === executionId ||
      pool.executionIds.Unstake === executionId
    ) {
      poolDetails.push({
        poolName: pool.name,
        token: pool.token,
        logo: pool.logo,
      });
    }
  });

  return poolDetails.length > 0
    ? poolDetails
    : "No pool found with this execution ID.";
};

export const getProposalType = (executionId) => {
  if (executionIdsForStakeETH.includes(executionId)) {
    return "Stake";
  }

  if (executionIdsForUnstakeETH.includes(executionId)) {
    return "Unstake";
  }

  // remaining - send NFT, totalNFT supply, whitelist custom address, threshold
  switch (executionId) {
    case 0:
      return "Distribute";
    case 1:
      return "Mint station tokens";
    case 3:
      return "Set raise amount to ";
    case 4:
      return "Send";
    case 6:
      return "Add signer";
    case 7:
      return "Remove signer";
    case 13:
      return "Update price of token to";
    case 60:
      return "Update minimum deposit amount to";
    case 61:
      return "Update maximum deposit amount to";
    case 62:
      return "Update signing threshold to";
    default:
      "Action";
  }
};

export const proposalItemVerb = (executionId) => {
  if (executionIdsForStakeETH.includes(executionId)) {
    return "on";
  }

  if (executionIdsForUnstakeETH.includes(executionId)) {
    return "from";
  }

  switch (executionId) {
    case 0:
    case 1:
    case 4:
      return "to";
    default:
      "";
  }
};

export const proposalAmount = (proposalData) => {};
