import Router from "next/router";

import Web3 from "web3";
import { Web3Adapter } from "@safe-global/protocol-kit";
import Safe, {
  SafeFactory,
  SafeAccountConfig,
} from "@safe-global/protocol-kit";

import FactoryContract from "../abis/newArch/factoryContract.json";
import { createClub, fetchClub } from "../api/club";
import { SmartContract } from "../api/contract";
import { createUser } from "../api/user";
import { addClubID, addDaoAddress } from "../redux/reducers/create";
import {
  safeConnected,
  setCreateDaoAuthorized,
  setCreateDaoGnosisSigned,
  setCreateSafeError,
  setCreateSafeErrorCode,
  setCreateSafeLoading,
  setRedirectToCreate,
} from "../redux/reducers/gnosis";

async function gnosisSafePromise(owners, threshold, dispatch) {
  dispatch(setCreateSafeLoading(true));
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

  const gasPrice = await web3.eth.getGasPrice();
  const increasedGasPrice = +gasPrice + 30000000000;

  const options = {
    gasPrice: increasedGasPrice,
  };

  const safeSdk = await safeFactory.deploySafe({ safeAccountConfig, options });
  try {
    const newSafeAddress = await safeSdk.getAddress();
    dispatch(safeConnected(newSafeAddress, safeSdk));
    return newSafeAddress;
  } catch (error) {
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
  const web3 = new Web3(Web3.givenProvider);
  let daoAddress = null;
  let networkId = null;

  await web3.eth.net
    .getId()
    .then((id) => {
      networkId = id;
    })
    .catch((err) => {
      console.log(err);
    });

  await gnosisSafePromise(
    addressList,
    Math.ceil(addressList.length * (params.threshold / 10000)),
    dispatch,
  )
    .then((treasuryAddress) => {
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
        value = factorySmartContract.createERC721DAO(
          params.clubName,
          params.clubSymbol,
          tokenURI,
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
        value = factorySmartContract.createERC20DAO(
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
      value
        .then((result) => {
          daoAddress = result.events[0].address;
          dispatch(addDaoAddress(result.events[0].address));

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

          const data = {
            name: params.clubName,
            daoAddress: daoAddress,
            gnosisAddress: treasuryAddress,
            networkId: networkId,
            tokenType:
              clubTokenType === "Non Transferable ERC20 Token"
                ? "erc20NonTransferable"
                : "erc721",
            nftImageUrl:
              clubTokenType !== "Non Transferable ERC20 Token"
                ? modifiedTokenURI
                : "",
            nftMetadataUrl:
              clubTokenType !== "Non Transferable ERC20 Token"
                ? metadataURL
                : "",
          };
          // const club = createClub(data);
          // club
          //   .then(async (result) => {
          //     if (result.status !== 201) {
          //       console.log(result.statusText);
          //     } else {
          //       let walletAddress = await web3.eth.getAccounts();

          //       const data = {
          //         userAddress: walletAddress,
          //         clubs: [
          //           {
          //             clubId: result.data.clubId,
          //             isAdmin: 1,
          //           },
          //         ],
          //       };
          //       const createuser = createUser(data);
          //       createuser.then((result) => {
          //         if (result.error) {
          //           console.log(result.error);
          //         }
          //       });

          //       let admins = addressList;
          //       admins.shift();

          //       if (admins.length) {
          //         for (let i in admins) {
          //           const data = {
          //             userAddress: Web3.utils.toChecksumAddress(admins[i]),
          //             clubs: [
          //               {
          //                 clubId: result.data.clubId,
          //                 isAdmin: 1,
          //               },
          //             ],
          //           };
          //           //     const createuser = createUser(data);
          //           //     createuser.then((result) => {
          //           //       if (result.error) {
          //           //         console.log(result.error);
          //           //       }
          //           //     });
          //         }
          //       }

          //       dispatch(
          //         addDaoAddress(
          //           Web3.utils.toChecksumAddress(result.data.daoAddress),
          //         ),
          //       );
          //       dispatch(addClubID(result.data.clubId));

          //       const { pathname } = Router;
          //       if (pathname == "/create") {
          //         Router.push(
          //           `/dashboard/${Web3.utils.toChecksumAddress(
          //             result.data.daoAddress,
          //           )}?clubCreate=true`,
          //           undefined,
          //           {
          //             shallow: true,
          //           },
          //         );
          //       }
          //     }
          //   })
          //   .catch((error) => {
          //     dispatch(setCreateDaoAuthorized(false));
          //     dispatch(setCreateSafeError(true));
          //     console.error(error);
          //   });
        })
        .catch((error) => {
          dispatch(setCreateDaoAuthorized(false));
          dispatch(setCreateSafeError(true));
          console.error(error);
          if (error.code === 4001) {
            dispatch(setCreateSafeErrorCode(4001));
          }
        });
    })
    .catch((error) => {
      console.error("error");
      dispatch(setCreateSafeLoading(false));
      dispatch(setCreateDaoAuthorized(false));
      dispatch(setCreateSafeError(true));
      return "Gnosis safe connection cannot be established!";
    });
}
