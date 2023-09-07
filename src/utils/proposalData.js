import {
  convertFromWeiGovernance,
  convertToWeiGovernance,
} from "./globalFunctions";
import { extractNftAdressAndId, shortAddress } from "./helper";

export const proposalData = ({ data, decimals, factoryData }) => {
  const {
    executionId,
    airDropAmount,
    quorum,
    threshold,
    totalDeposits,
    customTokenAmounts,
    customTokenAddresses,
    customNft,
    ownerAddress,
    nftLink,
    lensId,
    lensPostLink,
    pricePerToken,
    depositAmount,
    depositToken,
    withdrawToken,
    withdrawAmount,
  } = data;

  switch (executionId) {
    case 0:
      return {
        Amount: convertFromWeiGovernance(airDropAmount, decimals),
      };
    case 2:
      return {
        Quorum: quorum,
        Threshold: threshold,
      };
    case 3:
      return {
        "Raise Amount :":
          (convertToWeiGovernance(
            convertToWeiGovernance(totalDeposits, 6) /
              factoryData?.pricePerToken,
            18,
          ) /
            10 ** 18) *
          convertFromWeiGovernance(factoryData?.pricePerToken, 6),
      };
    case 4:
      return {
        Amount: customTokenAmounts[0] / 10 ** decimals,
        Recipient: shortAddress(customTokenAddresses[0]),
      };
    case 5:
      return {
        "NFT address": shortAddress(customNft),
        Recipient: shortAddress(customTokenAddresses[0]),
      };
    case 6:
    case 7:
      return {
        "Owner address": shortAddress(ownerAddress),
      };
    case 8:
    case 9:
      return {
        "NFT address": shortAddress(extractNftAdressAndId(nftLink).nftAddress),
        "Token Id": `${extractNftAdressAndId(nftLink).tokenId}`,
      };
    case 10:
      return { "Enable whitelisting": "" };
    case 11:
      return { "Lens profile id": lensId };
    case 12:
      return { "Lens profile link": lensPostLink };
    case 13:
      return { "Price per token": `${pricePerToken} USDC` };
    case 14:
      return {
        Token: depositToken,
        Amount: convertFromWeiGovernance(depositAmount, decimals),
      };
    case 15:
      return {
        "Withdraw token": withdrawToken,
        "Withdraw amount": convertFromWeiGovernance(withdrawAmount, decimals),
      };
    default:
      return {};
  }
};
