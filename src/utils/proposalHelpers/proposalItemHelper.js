import { CHAIN_CONFIG } from "utils/constants";
import { convertFromWeiGovernance } from "utils/globalFunctions";
import { shortAddress } from "utils/helper";
import {
  DEFI_PROPOSALS_ETH_POOLS,
  DEFI_PROPOSALS_PAIR_POOLS,
  DEFI_PROPOSALS_USDC_POOLS,
} from "utils/proposalConstants";

export const executionIdsForStakeETH = [
  24, 17, 26, 39, 45, 35, 31, 33, 37, 41, 47, 57, 51, 63,
];

export const executionIdsForUnstakeETH = [
  65, 18, 27, 40, 46, 36, 32, 34, 38, 42, 48, 58, 52, 64,
];

export const executionIdsForStakeUSDC = [55, 49];

export const executionIdsForUnstakeUSDC = [56, 50];

export const getProposalType = (executionId) => {
  if (
    executionIdsForStakeETH.includes(executionId) ||
    executionIdsForStakeUSDC.includes(executionId)
  ) {
    return "Stake";
  }

  if (
    executionIdsForUnstakeETH.includes(executionId) ||
    executionIdsForUnstakeUSDC.includes(executionId)
  ) {
    return "Unstake";
  }

  // remaining - send NFT, totalNFT supply, whitelist custom address, threshold
  switch (executionId) {
    case 0:
      return "Distribute";
    case 1:
      return "Mint";
    case 3:
      return "Set raise amount to ";
    case 4:
      return "Send";
    case 6:
      return "Add signer";
    case 7:
      return "Remove signer";
    case 10:
      return "Allowlist users";
    case 13:
      return "Update price of token to";
    case 60:
      return "Update minimum deposit amount to";
    case 61:
      return "Update maximum deposit amount to";
    case 62:
      return "Update signing threshold to";
    default:
      return "Action";
  }
};

export const proposalItemVerb = (executionId) => {
  if (
    executionIdsForStakeETH.includes(executionId) ||
    executionIdsForStakeUSDC.includes(executionId)
  ) {
    return "on";
  }

  if (
    executionIdsForUnstakeETH.includes(executionId) ||
    executionIdsForUnstakeUSDC.includes(executionId)
  ) {
    return "from";
  }

  switch (executionId) {
    case 0:
    case 4:
      return "to";
    case 1:
      return "station tokens to";
    default:
      return "";
  }
};

export const proposalItemObject = ({ executionId, proposal }) => {
  const { customTokenAddresses, ownerAddress, safeThreshold, mintGTAddresses } =
    proposal?.commands[0] ?? {};

  if (executionId === 63 || executionId === 64) {
    return findPoolNameByExecutionId(
      executionId,
      DEFI_PROPOSALS_PAIR_POOLS({}),
    );
  }

  if (
    executionIdsForStakeETH.includes(executionId) ||
    executionIdsForUnstakeETH.includes(executionId)
  ) {
    return findPoolNameByExecutionId(executionId, DEFI_PROPOSALS_ETH_POOLS({}));
  } else if (
    executionIdsForStakeUSDC.includes(executionId) ||
    executionIdsForUnstakeUSDC.includes(executionId)
  ) {
    return findPoolNameByExecutionId(
      executionId,
      DEFI_PROPOSALS_USDC_POOLS({}),
    );
  }

  switch (executionId) {
    case 0:
      return "Members";
    case 1:
      return `${mintGTAddresses[0]} ...`;
    case 4:
      return shortAddress(customTokenAddresses[0]);
    case 6:
    case 7:
      return shortAddress(ownerAddress);
    case 62:
      return safeThreshold;
    case 65:
      return "hello";
    default:
      return "";
  }
};

export const getProposalImage = (executionId) => {
  if (executionId === 63 || executionId === 64) {
    return findPoolLogoByExecutionId(
      executionId,
      DEFI_PROPOSALS_PAIR_POOLS({}),
    );
  }

  if (
    executionIdsForStakeETH.includes(executionId) ||
    executionIdsForUnstakeETH.includes(executionId)
  ) {
    return findPoolLogoByExecutionId(executionId, DEFI_PROPOSALS_ETH_POOLS({}));
  } else if (
    executionIdsForStakeUSDC.includes(executionId) ||
    executionIdsForUnstakeUSDC.includes(executionId)
  ) {
    return findPoolLogoByExecutionId(
      executionId,
      DEFI_PROPOSALS_USDC_POOLS({}),
    );
  }

  switch (executionId) {
    case 0:
    case 1:
    case 4:
    case 6:
    case 7:
    case 62:
      return "/assets/icons/avatar2.png";
    default:
      return "";
  }
};

export const findPoolNameByExecutionId = (executionId, pools) => {
  const pool = pools.find(
    (pool) =>
      pool.executionIds.Stake === executionId ||
      pool.executionIds.Unstake === executionId,
  );

  if (pool) {
    return pool.name;
  } else {
    return { message: "No pool found with the given execution ID." };
  }
};

export const findPoolLogoByExecutionId = (executionId, pools) => {
  const pool = pools.find(
    (pool) =>
      pool.executionIds.Stake === executionId ||
      pool.executionIds.Unstake === executionId,
  );

  if (pool) {
    return pool.logo;
  } else {
    return { message: "No pool found with the given execution ID." };
  }
};

export const getProposalAmount = async ({
  executionId,
  proposal,
  getDecimals,
  getTokenSymbol,
  isNativeToken,
  routeNetworkId,
}) => {
  const {
    airDropToken,
    airDropAmount,
    mintGTAmounts,
    customTokenAmounts,
    customToken,
    depositToken,
    depositAmount,
    updatedMinimumDepositAmount,
    updatedMaximumDepositAmount,
    pricePerToken,
    unstakeToken,
    unstakeAmount,
    withdrawAmount,
    withdrawToken,
    totalDeposits,
    stakeAmount,
    stakeToken1Amount,
    stakeToken2Amount,
  } = proposal?.commands[0] ?? {};

  switch (executionId) {
    case 0:
      const airdropTokenSymbol = await getTokenSymbol(airDropToken);
      const airdropTokenDecimal = await getDecimals(airDropToken);
      return `${convertFromWeiGovernance(
        airDropAmount,
        airdropTokenDecimal,
      )} ${airdropTokenSymbol}`;
    case 1:
      return mintGTAmounts;
    case 3:
      return `${totalDeposits} ${
        isNativeToken
          ? CHAIN_CONFIG[routeNetworkId].nativeCurrency.symbol
          : "USDC"
      }`;
    case 4:
      const sendTokenSymbol = await getTokenSymbol(customToken);
      const customTokenDecimal = await getDecimals(customToken);
      return `${convertFromWeiGovernance(
        customTokenAmounts[0],
        customTokenDecimal,
      )} ${sendTokenSymbol}`;
    case 13:
      return `${pricePerToken} ${
        isNativeToken
          ? CHAIN_CONFIG[routeNetworkId].nativeCurrency.symbol
          : "USDC"
      }`;
    case 17:
      return `${convertFromWeiGovernance(stakeAmount, 18)} ETH`;
    case 18:
    case 48:
    case 50:
    case 56:
    case 58:
    case 65:
      const unstakeSymbol = await getTokenSymbol(unstakeToken);
      const unstakeDecimals = await getDecimals(unstakeToken);
      return `${convertFromWeiGovernance(
        unstakeAmount,
        unstakeDecimals,
      )} ${unstakeSymbol}`;
    case 14:
    case 24:
      const tokenSymbol = await getTokenSymbol(depositToken);
      const decimals = await getDecimals(depositToken);
      return `${convertFromWeiGovernance(
        depositAmount,
        decimals,
      )} ${tokenSymbol}`;
    case 15:
      const withdrawDecimals = await getDecimals(withdrawToken);
      const withdrawSymbol = await getTokenSymbol(withdrawToken);

      return `${convertFromWeiGovernance(
        withdrawAmount,
        withdrawDecimals,
      )} ${withdrawSymbol}`;
    case 26:
    case 31:
    case 33:
    case 35:
    case 37:
    case 39:
    case 41:
    case 43:
    case 45:
    case 47:
    case 51:
    case 53:
    case 57:
      return `${depositAmount} ETH`;
    case 49:
    case 55:
      return `${depositAmount} USDC`;
    case 60:
      return `${updatedMinimumDepositAmount} ${
        isNativeToken
          ? CHAIN_CONFIG[routeNetworkId].nativeCurrency.symbol
          : "USDC"
      }`;
    case 61:
      return `${updatedMaximumDepositAmount} ${
        isNativeToken
          ? CHAIN_CONFIG[routeNetworkId].nativeCurrency.symbol
          : "USDC"
      }`;
    case 63:
      return `~ ${stakeToken1Amount?.toFixed(5)} ezETH`;
    default:
      return "";
  }
};

export const getNileAmount2 = ({ executionId, proposal }) => {
  const { stakeToken2Amount } = proposal?.commands[0] ?? {};

  if (executionId === 63 || executionId === 64) {
    return `~ ${stakeToken2Amount?.toFixed(5)} ETH`;
  }
};
