import Web3 from "web3";
import Web3Adapter from "@safe-global/safe-web3-lib";
import { SafeFactory } from "@safe-global/safe-core-sdk";

import {
  safeConnected,
  setCreateDaoAuthorized,
  setCreateDaoGnosisSigned,
  setRedirectToCreate,
} from "../redux/reducers/gnosis";

import { addDaoAddress, addClubID } from "../redux/reducers/create";
import store from "../redux/store";
import { SmartContract } from "../api/contract";
import { createClub, fetchClub } from "../api/club";
import FactoryContract from "../abis/factoryContract.json";
import Router from "next/router";
import { createUser } from "../api/user";

async function gnosisSafePromise(owners, threshold, dispatch) {
  try {
    const web3 = new Web3(Web3.givenProvider);
    const safeOwner = await web3.eth.getAccounts();
    const ethAdapter = new Web3Adapter({
      web3,
      signerAddress: safeOwner[0],
    });
    const safeFactory = await SafeFactory.create({ ethAdapter });
    const safeAccountConfig = {
      owners,
      threshold: owners.length,
    };
    const options = {
      maxPriorityFeePerGas: null,
      maxFeePerGas: null,
      // from, // Optional
      // gas, // Optional
      // gasPrice, // Optional
      // maxFeePerGas, // Optional
      // maxPriorityFeePerGas // Optional
      // nonce // Optional
    };

    const safeSdk = await safeFactory.deploySafe({
      safeAccountConfig,
      options,
    });
    // const safeSdk = await safeFactory.deploySafe({ safeAccountConfig });
    const newSafeAddress = safeSdk.getAddress();
    dispatch(safeConnected(newSafeAddress, safeSdk));
    return newSafeAddress;
  } catch {
    return "Gnosis safe connection cannot be established!";
  }
}

export async function initiateConnection(
  clubTokenType,
  owners,
  threshold,
  dispatch,
  tokenName,
  tokenSymbol,
  totalDeposit,
  minDeposit,
  maxDeposit,
  ownerFee,
  closeDate,
  feeUSDC,
  quoram,
  formThreshold,
  factoryContractAddress,
  usdcContractAddress,
  gnosisTransactionUrl,
  usdcConvertDecimal,
  enableGovernance,
  isTemplateErc721,
  mintsPerUser = 0,
  totalSupplyOfToken,
  nftPrice,
  transferableMembership,
  isNftSupplyUnlimited,
  tokenURI,
) {
  dispatch(setCreateDaoGnosisSigned(true));
  const web3 = new Web3(Web3.givenProvider);
  const safeOwner = await web3.eth.getAccounts();
  let daoAddress = null;
  let tokenAddress = null;
  let walletAddress = safeOwner[0];
  let networkId = null;

  await web3.eth.net
    .getId()
    .then((id) => {
      networkId = id;
    })
    .catch((err) => {
      console.log(err);
    });

  const smartContract = new SmartContract(
    FactoryContract,
    factoryContractAddress,
    undefined,
    usdcContractAddress,
    gnosisTransactionUrl,
  );
  console.log("smartContract", smartContract);
  await gnosisSafePromise(owners, threshold, dispatch)
    .then((treasuryAddress) => {
      console.log("treasuryAddress", treasuryAddress);
      dispatch(setCreateDaoGnosisSigned(false));
      dispatch(setCreateDaoAuthorized(true));
      let value;
      console.log("clubTokenType", clubTokenType);
      if (clubTokenType === "NFT") {
        value = smartContract.createDAO(
          owners,
          threshold,
          dispatch,
          tokenName,
          tokenSymbol,
          totalDeposit,
          minDeposit,
          maxDeposit,
          ownerFee,
          closeDate,
          feeUSDC,
          treasuryAddress,
          quoram,
          formThreshold,
          usdcConvertDecimal,
          enableGovernance,
          isTemplateErc721,
          mintsPerUser,
          totalSupplyOfToken,
          nftPrice,
          transferableMembership,
          isNftSupplyUnlimited,
          // owners,
          // threshold,
          // dispatch,
          // tokenName,
          // tokenSymbol,
          // totalDeposit,
          // minDeposit,
          // maxDeposit,
          // ownerFee,
          // closeDate,
          // feeUSDC,
          // treasuryAddress,
          // quoram,
          // formThreshold,
          // usdcConvertDecimal,
          // enableGovernance,
          // isTemplateErc721,
          // mintsPerUser,
          // totalSupplyOfToken,
        );
      } else {
        value = smartContract.createDAO(
          owners,
          threshold,
          dispatch,
          tokenName,
          tokenSymbol,
          totalDeposit,
          minDeposit,
          maxDeposit,
          (ownerFee = 0),
          closeDate,
          feeUSDC,
          treasuryAddress,
          quoram,
          formThreshold,
          usdcConvertDecimal,
          enableGovernance,
          (isTemplateErc721 = false),
          (mintsPerUser = 1),
          (totalSupplyOfToken = 1),
          (nftPrice = 1),
          (transferableMembership = true),
          (isNftSupplyUnlimited = true),
        );
      }
      console.log("value", value);
      value.then(
        (result) => {
          daoAddress = result.events[0].address;
          dispatch(addDaoAddress(result.events[0].address));
          // TODO: as of now, setting the tokenType to be static, by default erc20NonTransferable will be the contract
          const data = {
            name: tokenName,
            daoAddress: daoAddress,
            gnosisAddress: treasuryAddress,
            networkId: networkId,
            tokenType:
              clubTokenType === "Non Transferable ERC20 Token"
                ? "erc20NonTransferable"
                : "erc721",
            nftImageUrl:
              clubTokenType !== "Non Transferable ERC20 Token" ? tokenURI : "",
          };
          const club = createClub(data);
          club.then((result) => {
            if (result.status !== 201) {
              console.log(result.statusText);
            } else {
              // create user in the API
              const data = {
                userAddress: walletAddress,
                clubs: [
                  {
                    clubId: result.data.clubId,
                    isAdmin: 1,
                  },
                ],
              };
              const createuser = createUser(data);
              createuser.then((result) => {
                if (result.error) {
                  console.log(result.error);
                }
              });

              let admins = owners;
              admins.shift();
              console.log("admin", admins.length, admins, owners);
              if (admins.length) {
                for (let i in admins) {
                  const data = {
                    userAddress: admins[i],
                    clubs: [
                      {
                        clubId: result.data.clubId,
                        isAdmin: 1,
                      },
                    ],
                  };
                  const createuser = createUser(data);
                  createuser.then((result) => {
                    if (result.error) {
                      console.log(result.error);
                    }
                  });
                }
              }

              dispatch(addDaoAddress(result.data.daoAddress));
              dispatch(addClubID(result.data.clubId));

              const { pathname } = Router;
              if (pathname == "/create") {
                Router.push(`/dashboard/${result.data.clubId}`, undefined, {
                  shallow: true,
                });
              }
            }
          });
        },
        (error) => {
          console.log(error);
          // dispatch(setRedirectToCreate(true));
          // dispatch(setCreateDaoGnosisSigned(false));
          // dispatch(setCreateDaoAuthorized(false));
          // Router.push(`/create`, undefined, {
          //   shallow: true,
          // });
        },
      );
    })
    .catch((errorMsg) => {
      console.log("error2", error);
      // dispatch(setRedirectToCreate(true));
      // dispatch(setCreateDaoGnosisSigned(false));
      // dispatch(setCreateDaoAuthorized(false));
      // Router.push(`/create`, undefined, {
      //   shallow: true,
      // });
    });
}
