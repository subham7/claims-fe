import {
  convertFromWeiGovernance,
  convertToWeiGovernance,
} from "./globalFunctions";
import { extractNftAdressAndId } from "./helper";

export const proposalData = async ({ data, decimals, factoryData }) => {
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
        "Raise Amount":
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
        Recipient:
          customTokenAddresses[0].substring(0, 6) +
          "....." +
          customTokenAddresses[0].substring(customTokenAddresses[0].length - 4),
      };
    case 5:
      return {
        Nft:
          customNft?.substring(0, 6) +
          ".........." +
          customNft?.substring(customNft?.length - 4),
        Recipient:
          customTokenAddresses[0].substring(0, 6) +
          "....." +
          customTokenAddresses[0].substring(customTokenAddresses[0].length - 4),
      };
    case 6:
    case 7:
      return {
        "Owner Address":
          ownerAddress.slice(0, 6) +
          "...." +
          ownerAddress.slice(ownerAddress.length - 4),
      };
    case 8:
    case 9:
      return {
        "NFT address": `${extractNftAdressAndId(nftLink).nftAddress.slice(
          0,
          6,
        )}}
      ....
      ${extractNftAdressAndId(nftLink).nftAddress.slice(-6)}`,
        " Token Id": `${extractNftAdressAndId(nftLink).tokenId}`,
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
        "Withdraw Amount": convertFromWeiGovernance(withdrawAmount, decimals),
      };
  }
};
