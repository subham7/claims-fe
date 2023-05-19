import Router from "next/router";
import Web3 from "web3";
import { Web3Adapter } from "@safe-global/protocol-kit";
import { SafeFactory } from "@safe-global/protocol-kit";
import FactoryContract from "../abis/newArch/factoryContract.json";
import { SmartContract } from "../api/contract";
import { addDaoAddress, addTokenURI } from "../redux/reducers/create";
import {
  safeConnected,
  setCreateDaoAuthorized,
  setCreateSafeError,
  setCreateSafeErrorCode,
  setCreateSafeLoading,
} from "../redux/reducers/gnosis";
import { addClubData } from "../redux/reducers/club";
import { getIncreaseGasPrice } from "./helper";

async function gnosisSafePromise(owners, threshold, dispatch) {
  try {
    const web3 = new Web3(window.ethereum);
    const ethAdapter = new Web3Adapter({
      web3,
      signerAddress: owners[0],
    });
    const safeFactory = await SafeFactory.create({ ethAdapter });
    const safeAccountConfig = {
      owners: owners,
      threshold,
      // ...
    };

    const increasedGasPrice = await getIncreaseGasPrice();

    const options = {
      gasPrice: increasedGasPrice,
    };

    const safeSdk = await safeFactory.deploySafe({
      safeAccountConfig,
      options,
    });

    const newSafeAddress = await safeSdk.getAddress();
    dispatch(safeConnected(newSafeAddress, safeSdk));
    return newSafeAddress;
  } catch (error) {
    console.error(error);
    if (error.code === 4001) {
      dispatch(setCreateSafeError(true));
      dispatch(setCreateSafeErrorCode(4001));
    } else {
      dispatch(setCreateSafeError(true));
    }
  }
}

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

  const treasuryAddress = await gnosisSafePromise(
    addressList,
    Math.ceil(addressList.length * (params.threshold / 10000)),
    dispatch,
  );
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

      dispatch(addTokenURI(modifiedTokenURI));

      value = await factorySmartContract.createERC721DAO(
        params.clubName,
        params.clubSymbol,
        metadataURL,
        params.ownerFeePerDepositPercent,
        params.depositClose,
        params.quorum,
        params.threshold,
        params.depositTokenAddress,
        treasuryAddress,
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
        params.depositTokenAddress,
        treasuryAddress,
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
          gnosisAddress: treasuryAddress,
          isGtTransferable: params.isGtTransferable,
          name: params.clubName,
          ownerAddress: addressList,
          symbol: params.clubSymbol,
          tokenType: clubTokenType === "NFT" ? "erc721" : "erc20",
        }),
      );
      daoAddress = value.events[0].address;
      dispatch(addDaoAddress(value.events[0].address));
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
