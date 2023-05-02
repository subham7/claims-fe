import { CleaningServices } from "@mui/icons-material";
import { SafeFactory } from "@safe-global/protocol-kit";
import Web3Adapter from "@safe-global/protocol-kit";
import Router from "next/router";
import Web3 from "web3";

import FactoryContract from "../abis/newFactoryContract.json";
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
  console.log(owners);
  dispatch(setCreateSafeLoading(true));
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
  try {
    const safeSdk = await safeFactory.deploySafe({
      safeAccountConfig,
      options,
    });
    // const safeSdk = await safeFactory.deploySafe({ safeAccountConfig });
    const newSafeAddress = safeSdk.getAddress();
    dispatch(safeConnected(newSafeAddress, safeSdk));
    return newSafeAddress;
    // const safeSdk = await safeFactory.deploySafe({ safeAccountConfig });
  } catch (error) {
    if (error.code === 4001) {
      dispatch(setCreateSafeError(true));
      dispatch(setCreateSafeErrorCode(4001));
    } else {
      dispatch(setCreateSafeError(true));
    }
  }
}

// export async function initiateConnection(
//   clubTokenType,
//   owners,
//   threshold,
//   dispatch,
//   tokenName,
//   tokenSymbol,
//   totalDeposit,
//   minDeposit,
//   maxDeposit,
//   ownerFee,
//   closeDate,
//   feeUSDC,
//   quoram,
//   formThreshold,
//   factoryContractAddress,
//   usdcContractAddress,
//   gnosisTransactionUrl,
//   usdcConvertDecimal,
//   enableGovernance,
//   isTemplateErc721,
//   mintsPerUser = 0,
//   totalSupplyOfToken,
//   nftPrice,
//   transferableMembership,
//   isNftSupplyUnlimited,
//   tokenURI,
//   metadataURL,
// ) {
//   dispatch(setCreateDaoGnosisSigned(true));
//   console.log(isNftSupplyUnlimited, totalSupplyOfToken);
//   const web3 = new Web3(Web3.givenProvider);
//   const safeOwner = await web3.eth.getAccounts();
//   let daoAddress = null;
//   let tokenAddress = null;
//   let walletAddress = safeOwner[0];
//   let networkId = null;

//   await web3.eth.net
//     .getId()
//     .then((id) => {
//       networkId = id;
//     })
//     .catch((err) => {
//       console.log(err);
//     });

//   const smartContract = new SmartContract(
//     FactoryContract,
//     factoryContractAddress,
//     undefined,
//     usdcContractAddress,
//     gnosisTransactionUrl,
//   );
//   console.log("smartContract", smartContract);
//   await gnosisSafePromise(owners, threshold, dispatch)
//     .then((treasuryAddress) => {
//       console.log("treasuryAddress", treasuryAddress);
//       dispatch(setCreateDaoGnosisSigned(false));
//       dispatch(setCreateDaoAuthorized(true));
//       let value;
//       console.log("clubTokenType", clubTokenType);
//       if (clubTokenType === "NFT") {
//         value = smartContract.createDAO(
//           owners,
//           threshold,
//           dispatch,
//           tokenName,
//           tokenSymbol,
//           totalDeposit,
//           minDeposit,
//           maxDeposit,
//           ownerFee,
//           closeDate,
//           feeUSDC,
//           treasuryAddress,
//           quoram,
//           formThreshold,
//           usdcConvertDecimal,
//           enableGovernance,
//           isTemplateErc721,
//           mintsPerUser,
//           totalSupplyOfToken,
//           nftPrice,
//           transferableMembership,
//           isNftSupplyUnlimited,
//           // owners,
//           // threshold,
//           // dispatch,
//           // tokenName,
//           // tokenSymbol,
//           // totalDeposit,
//           // minDeposit,
//           // maxDeposit,
//           // ownerFee,
//           // closeDate,
//           // feeUSDC,
//           // treasuryAddress,
//           // quoram,
//           // formThreshold,
//           // usdcConvertDecimal,
//           // enableGovernance,
//           // isTemplateErc721,
//           // mintsPerUser,
//           // totalSupplyOfToken,
//         );
//       } else {
//         value = smartContract.createDAO(
//           owners,
//           threshold,
//           dispatch,
//           tokenName,
//           tokenSymbol,
//           totalDeposit,
//           minDeposit,
//           maxDeposit,
//           (ownerFee = 0),
//           closeDate,
//           feeUSDC,
//           treasuryAddress,
//           quoram,
//           formThreshold,
//           usdcConvertDecimal,
//           enableGovernance,
//           (isTemplateErc721 = false),
//           (mintsPerUser = 1),
//           (totalSupplyOfToken = 1),
//           (nftPrice = 1),
//           (transferableMembership = true),
//           (isNftSupplyUnlimited = true),
//         );
//       }
//       console.log("value", value);
//       value.then(
//         (result) => {
//           console.log("clubTokenType", clubTokenType);
//           daoAddress = result.events[0].address;
//           dispatch(addDaoAddress(result.events[0].address));
//           //change the type of url for ipfs token uri
//           let modifiedTokenURI;
//           if (clubTokenType === "NFT") {
//             if (
//               tokenURI.slice(tokenURI.indexOf("/"), tokenURI?.lastIndexOf("//"))
//             ) {
//               let imgUrl = tokenURI?.split("//");
//               modifiedTokenURI = `https://${imgUrl[1]}.ipfs.dweb.link/${imgUrl[2]}`;
//               console.log(
//                 "imgUrl, ",
//                 `https://${imgUrl[1]}.ipfs.dweb.link/${imgUrl[2]}`,
//               );
//             } else {
//               let imgUrl = tokenURI?.split("/");
//               modifiedTokenURI = `https://${imgUrl[2]}.ipfs.dweb.link/${imgUrl[3]}`;
//               console.log(
//                 "imgUrl, ",
//                 `https://${imgUrl[2]}.ipfs.dweb.link/${imgUrl[3]}`,
//               );
//             }
//           }
//           // TODO: as of now, setting the tokenType to be static, by default erc20NonTransferable will be the contract
//           const data = {
//             name: tokenName,
//             daoAddress: daoAddress,
//             gnosisAddress: treasuryAddress,
//             networkId: networkId,
//             tokenType:
//               clubTokenType === "Non Transferable ERC20 Token"
//                 ? "erc20NonTransferable"
//                 : "erc721",
//             nftImageUrl:
//               clubTokenType !== "Non Transferable ERC20 Token"
//                 ? modifiedTokenURI
//                 : "",
//             nftMetadataUrl: metadataURL,
//           };
//           const club = createClub(data);
//           club.then((result) => {
//             if (result.status !== 201) {
//               console.log(result.statusText);
//             } else {
//               // create user in the API
//               const data = {
//                 userAddress: walletAddress.toLocaleLowerCase(),
//                 clubs: [
//                   {
//                     clubId: result.data.clubId,
//                     isAdmin: 1,
//                   },
//                 ],
//               };
//               const createuser = createUser(data);
//               createuser.then((result) => {
//                 if (result.error) {
//                   console.log(result.error);
//                 }
//               });

//               let admins = owners;
//               admins.shift();
//               console.log("admin", admins.length, admins, owners);
//               if (admins.length) {
//                 for (let i in admins) {
//                   const data = {
//                     userAddress: admins[i].toLocaleLowerCase(),
//                     clubs: [
//                       {
//                         clubId: result.data.clubId,
//                         isAdmin: 1,
//                       },
//                     ],
//                   };
//                   const createuser = createUser(data);
//                   createuser.then((result) => {
//                     if (result.error) {
//                       console.log(result.error);
//                     }
//                   });
//                 }
//               }

//               dispatch(addDaoAddress(result.data.daoAddress));
//               dispatch(addClubID(result.data.clubId));

//               const { pathname } = Router;
//               if (pathname == "/create") {
//                 Router.push(
//                   `/dashboard/${result.data.clubId}?clubCreate=true`,
//                   undefined,
//                   {
//                     shallow: true,
//                   },
//                 );
//               }
//             }
//           });
//         },
//         (error) => {
//           console.log(error);
//           // dispatch(setRedirectToCreate(true));
//           // dispatch(setCreateDaoGnosisSigned(false));
//           // dispatch(setCreateDaoAuthorized(false));
//           // Router.push(`/create`, undefined, {
//           //   shallow: true,
//           // });
//         },
//       );
//     })
//     .catch((errorMsg) => {
//       console.log("error2", error);
//       // dispatch(setRedirectToCreate(true));
//       // dispatch(setCreateDaoGnosisSigned(false));
//       // dispatch(setCreateDaoAuthorized(false));
//       // Router.push(`/create`, undefined, {
//       //   shallow: true,
//       // });
//     });
// }

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
      console.log(id);
      networkId = id;
    })
    .catch((err) => {
      console.log(err);
    });
  await gnosisSafePromise(addressList, params.threshold, dispatch)
    .then((treasuryAddress) => {
      console.log("treasuryAddress", treasuryAddress);
      dispatch(setCreateSafeLoading(false));
      dispatch(setCreateDaoAuthorized(true));

      const smartContract = new SmartContract(
        FactoryContract,
        factoryContractAddress,
        undefined,
        params.depositTokenAddress,
        gnosisTransactionUrl,
      );
      let value;
      if (clubTokenType === "NFT") {
        console.log("NFT");
        value = smartContract.createERC721DAO(
          params.clubName,
          params.clubSymbol,
          params.ownerFeePerDepositPercent,
          params.depositClose,
          params.quorum,
          params.threshold,
          params.depositTokenAddress,
          treasuryAddress,
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
        value = smartContract.createERC20DAO(
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
          params.isGovernanceActive,
          params.isGtTransferable,
          params.allowWhiteList,
          false, // assets Stored on Gnosis
          params.merkleRoot,
        );
      }
      console.log(value);
      value
        .then((result) => {
          console.log(result);
          daoAddress = result.events[0].address;
          dispatch(addDaoAddress(result.events[0].address));

          let modifiedTokenURI;
          if (clubTokenType === "NFT") {
            if (
              tokenURI.slice(tokenURI.indexOf("/"), tokenURI?.lastIndexOf("//"))
            ) {
              let imgUrl = tokenURI?.split("//");
              modifiedTokenURI = `https://${imgUrl[1]}.ipfs.dweb.link/${imgUrl[2]}`;
              console.log(
                "imgUrl, ",
                `https://${imgUrl[1]}.ipfs.dweb.link/${imgUrl[2]}`,
              );
            } else {
              let imgUrl = tokenURI?.split("/");
              modifiedTokenURI = `https://${imgUrl[2]}.ipfs.dweb.link/${imgUrl[3]}`;
              console.log(
                "imgUrl, ",
                `https://${imgUrl[2]}.ipfs.dweb.link/${imgUrl[3]}`,
              );
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
          const club = createClub(data);
          club
            .then(async (result) => {
              if (result.status !== 201) {
                console.log(result.statusText);
              } else {
                let walletAddress = await web3.eth.getAccounts();
                console.log("walletAddress", walletAddress);

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

                let admins = addressList;
                admins.shift();

                if (admins.length) {
                  for (let i in admins) {
                    const data = {
                      userAddress: Web3.utils.toChecksumAddress(admins[i]),
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

                dispatch(
                  addDaoAddress(
                    Web3.utils.toChecksumAddress(result.data.daoAddress),
                  ),
                );
                dispatch(addClubID(result.data.clubId));

                const { pathname } = Router;
                if (pathname == "/create") {
                  Router.push(
                    `/dashboard/${Web3.utils.toChecksumAddress(
                      result.data.daoAddress,
                    )}?clubCreate=true`,
                    undefined,
                    {
                      shallow: true,
                    },
                  );
                }
              }
            })
            .catch((error) => {
              dispatch(setCreateDaoAuthorized(false));
              dispatch(setCreateSafeError(true));
              console.error(error);
            });
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
