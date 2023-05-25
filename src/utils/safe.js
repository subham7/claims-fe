import Router from "next/router";
import Web3 from "web3";
import FactoryContract from "../abis/newArch/factoryContract.json";
import { SmartContract } from "../api/contract";
import {
  setCreateDaoAuthorized,
  setCreateSafeError,
  setCreateSafeErrorCode,
  setCreateSafeLoading,
} from "../redux/reducers/gnosis";
import { addClubData, addDaoAddress } from "../redux/reducers/club";

export async function initiateConnection(
  params,
  dispatch,
  gnosisTransactionUrl,
  addressList,
  clubTokenType,
  factoryContractAddress,
  tokenURI = "",
  metadataURL = "",
) {
  dispatch(setCreateSafeLoading(true));
  dispatch(setCreateDaoAuthorized(false));

  let daoAddress = null;

  try {
    dispatch(setCreateSafeLoading(false));
    dispatch(setCreateDaoAuthorized(true));

    const factorySmartContract = new SmartContract(
      FactoryContract,
      factoryContractAddress,
      undefined,
      params.depositTokenAddress,
      gnosisTransactionUrl,
      true,
    );
    let value;
    if (clubTokenType === "NFT") {
      let modifiedTokenURI;
      if (clubTokenType === "NFT") {
        if (
          tokenURI.slice(tokenURI.indexOf("/"), tokenURI?.lastIndexOf("//"))
        ) {
          let imgUrl = tokenURI?.split("//");
          modifiedTokenURI = `https://${imgUrl[1]}.ipfs.dweb.link/${imgUrl[2]}`;
        } else {
          let imgUrl = tokenURI?.split("/");
          modifiedTokenURI = `https://${imgUrl[2]}.ipfs.dweb.link/${imgUrl[3]}`;
        }
      }

      value = await factorySmartContract.createERC721DAO(
        params.clubName,
        params.clubSymbol,
        metadataURL,
        params.ownerFeePerDepositPercent,
        params.depositClose,
        params.quorum,
        params.threshold,
        params.safeThreshold,
        params.depositTokenAddress,
        params.treasuryAddress,
        addressList,
        params.maxTokensPerUser,
        params.distributeAmount,
        params.pricePerToken,
        params.isNftTransferable,
        params.isNftTotalSupplyUnlimited,
        params.isGovernanceActive,
        params.allowWhiteList,
        false, // assets Stored on Gnosis
        params.merkleRoot,
      );
    } else {
      value = await factorySmartContract.createERC20DAO(
        params.clubName,
        params.clubSymbol,
        params.distributeAmount,
        params.pricePerToken,
        params.minDepositPerUser,
        params.maxDepositPerUser,
        params.ownerFeePerDepositPercent,
        params.depositClose,
        params.quorum,
        params.threshold,
        params.safeThreshold,
        params.depositTokenAddress,
        params.treasuryAddress,
        addressList,
        params.isGovernanceActive,
        params.isGtTransferable,
        params.allowWhiteList,
        false, // assets Stored on Gnosis
        params.merkleRoot,
      );
    }
    try {
      dispatch(
        addClubData({
          gnosisAddress:
            params.treasuryAddress ===
            "0x0000000000000000000000000000000000000000"
              ? value.events[0].address
              : params.treasuryAddress,
          isGtTransferable: params.isGtTransferable,
          name: params.clubName,
          ownerAddress: addressList,
          symbol: params.clubSymbol,
          tokenType: clubTokenType === "NFT" ? "erc721" : "erc20",
        }),
      );

      daoAddress =
        params.treasuryAddress === "0x0000000000000000000000000000000000000000"
          ? value.events[2].address
          : value.events[0].address;
      dispatch(addDaoAddress(daoAddress));
      const { pathname } = Router;
      if (pathname == "/create") {
        Router.push(
          `/dashboard/${Web3.utils.toChecksumAddress(
            daoAddress,
          )}?clubCreate=true`,
          undefined,
          {
            shallow: true,
          },
        );
      }
    } catch (error) {
      dispatch(setCreateDaoAuthorized(false));
      dispatch(setCreateSafeError(true));
      console.error(error);
      if (error.code === 4001) {
        dispatch(setCreateSafeErrorCode(4001));
      }
    }
  } catch (error) {
    console.error("error");
    dispatch(setCreateSafeLoading(false));
    dispatch(setCreateDaoAuthorized(false));
    dispatch(setCreateSafeError(true));
    return "Gnosis safe connection cannot be established!";
  }
}
