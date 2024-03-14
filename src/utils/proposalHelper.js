import { isNative } from "./helper";

export const extractTokenDetails = async (
  proposal,
  clubData,
  tokenType,
  daoAddress,
  networkId,
  getDecimals,
  getTokenSymbol,
) => {
  if (!proposal) return { decimals: 0, symbol: "" };

  let decimal = 18;
  let symbol = "";
  const { commands } = proposal;
  const depositTokenAddress = clubData.depositTokenAddress;
  const executionId = commands[0].executionId;
  const isNativeToken = isNative(depositTokenAddress, networkId);
  const tokenAddress = getTokenAddressByExecutionId(
    executionId,
    commands[0],
    daoAddress,
    depositTokenAddress,
  );

  if (tokenType === "erc20" || executionId !== 1) {
    decimal = await getDecimals(tokenAddress);
  }

  symbol = await getTokenSymbol(tokenAddress);

  return {
    decimals: isNativeToken ? 18 : decimal,
    symbol: symbol,
  };
};

const getTokenAddressByExecutionId = (
  executionId,
  command,
  daoAddress,
  depositTokenAddress,
) => {
  const {
    airDropToken,
    customToken,
    depositToken,
    withdrawToken,
    stakeToken,
    unstakeToken,
    swapToken,
    sendToken,
  } = command;

  switch (executionId) {
    case 0:
      return airDropToken;
    case 1:
      return daoAddress;
    case 4:
      return customToken;
    case 14:
    case 24:
      return depositToken;
    case 15:
    case 25:
      return withdrawToken;
    case 17:
      return stakeToken;
    case 18:
    case 48:
    case 50:
      return unstakeToken;
    case 19:
      return swapToken;
    case 21:
    case 22:
    case 23:
      return sendToken;
    case 13:
      return depositTokenAddress;
    default:
      return "";
  }
};

const selectTokenAddress = (tokens) => tokens.find((token) => !!token);

const selectTokenAmount = (amounts) => amounts.find((amount) => !!amount);

export const extractContractDetails = async (
  proposalData,
  clubData,
  networkId,
  getDecimals,
  getTokenSymbol,
  convertFromWeiGovernance,
) => {
  const {
    airDropToken,
    customToken,
    depositToken,
    withdrawToken,
    stakeToken,
    unstakeToken,
    swapToken,
    sendToken,
    depositAmount,
    withdrawAmount,
    stakeAmount,
    unstakeAmount,
    swapAmount,
  } = proposalData.commands[0];

  const depositTokenAddress = clubData.depositTokenAddress;
  const isNativeToken = isNative(depositTokenAddress, networkId);
  const tokenAddress = selectTokenAddress([
    airDropToken,
    customToken,
    depositToken,
    withdrawToken,
    stakeToken,
    unstakeToken,
    swapToken,
    sendToken,
    depositTokenAddress,
  ]);

  if (!tokenAddress) return null;

  const decimal = await getDecimals(tokenAddress);
  const symbol = await getTokenSymbol(tokenAddress);
  const amount = convertFromWeiGovernance(
    selectTokenAmount([
      depositAmount,
      withdrawAmount,
      stakeAmount,
      unstakeAmount,
      swapAmount,
    ]),
    decimal,
  );

  return {
    decimals: isNativeToken ? 18 : decimal,
    symbol,
    amount,
  };
};
