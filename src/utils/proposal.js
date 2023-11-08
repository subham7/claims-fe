import { getProposal } from "../api/proposal";
import SafeApiKit from "@safe-global/api-kit";
import { Web3Adapter } from "@safe-global/protocol-kit";
import { createCancelProposal, getProposalTxHash } from "api/proposal";
import Web3 from "web3";
import { getIncreaseGasPrice, getSafeSdk } from "./helper";
import { factoryContractABI } from "abis/factoryContract.js";
import { erc721DaoABI } from "abis/erc721Dao";
import { erc20DaoABI } from "abis/erc20Dao";
import { seaportABI } from "abis/seaport";
import { subgraphQuery } from "./subgraphs";
import { convertToWeiGovernance } from "./globalFunctions";
import { Interface } from "ethers";
import { fulfillOrder, retrieveNftListing } from "api/assets";
import { SEAPORT_CONTRACT_ADDRESS } from "api";
import { CHAIN_CONFIG } from "./constants";
import {
  QUERY_ALL_MEMBERS,
  QUERY_STATION_DETAILS,
} from "api/graphql/stationQueries";
import { erc20TokenABI } from "abis/usdcTokenContract.js";
import { actionContractABI } from "abis/actionContract";
import { erc20AaveABI } from "abis/erc20AaveABI";
import { stargateStakeABI } from "abis/stargateStakeABI";
import { maticAaveABI } from "abis/MaticAaveABI";
import { uniswapABI } from "abis/uniswapABI";
import { encodeFunctionData } from "viem";

export const fetchProposals = async (clubId, type) => {
  let proposalData;
  if (type === "all") proposalData = await getProposal(clubId);
  else proposalData = await getProposal(clubId, type);

  if (proposalData.status !== 200) {
    return null;
  } else return proposalData.data;
};

export const createRejectSafeTx = async ({
  pid,
  gnosisTransactionUrl,
  gnosisAddress,
  daoAddress,
  network,
  walletAddress,
  networkId,
}) => {
  try {
    const web3 = new Web3(window.ethereum);
    const ethAdapter = new Web3Adapter({
      web3: web3,
      signerAddress: Web3.utils.toChecksumAddress(walletAddress),
    });

    const txServiceUrl = gnosisTransactionUrl;

    const safeService = new SafeApiKit({
      txServiceUrl,
      ethAdapter,
    });

    const proposalTxHash = await getProposalTxHash(pid);

    const safetx = await safeService.getTransaction(
      proposalTxHash.data[0].txHash,
    );

    const safeSdk = await getSafeSdk(
      Web3.utils.toChecksumAddress(gnosisAddress),
      Web3.utils.toChecksumAddress(walletAddress),
      networkId,
    );

    const rejectionTransaction = await safeSdk.createRejectionTransaction(
      safetx.nonce,
    );

    const safeTxHash = await safeSdk.getTransactionHash(rejectionTransaction);

    const proposeTxn = await safeService.proposeTransaction({
      safeAddress: Web3.utils.toChecksumAddress(gnosisAddress),
      safeTransactionData: rejectionTransaction.data,
      safeTxHash: safeTxHash,
      senderAddress: Web3.utils.toChecksumAddress(walletAddress),
    });

    const senderSignature = await safeSdk.signTypedData(
      rejectionTransaction,
      "v4",
    );

    await safeService.confirmTransaction(safeTxHash, senderSignature.data);

    const cancelPayload = {
      proposalData: {
        createdBy: walletAddress,
        commands: [
          {
            proposalId: pid,
          },
        ],
        daoAddress,
      },
      txHash: safeTxHash,
    };

    await createCancelProposal(cancelPayload, network);

    return true;
  } catch (e) {
    console.error(e);
  }
};

export const executeRejectTx = async ({
  pid,
  walletAddress,
  gnosisTransactionUrl,
  gnosisAddress,
  networkId,
}) => {
  try {
    const web3 = new Web3(window.ethereum);
    const ethAdapter = new Web3Adapter({
      web3: web3,
      signerAddress: Web3.utils.toChecksumAddress(walletAddress),
    });

    const txServiceUrl = gnosisTransactionUrl;

    const safeService = new SafeApiKit({
      txServiceUrl,
      ethAdapter,
    });

    const proposalTxHash = await getProposalTxHash(pid);

    const safetx = await safeService.getTransaction(
      proposalTxHash.data[0].txHash,
    );

    const safeSdk = await getSafeSdk(
      Web3.utils.toChecksumAddress(gnosisAddress),
      Web3.utils.toChecksumAddress(walletAddress),
      networkId,
    );

    const options = {
      gasPrice: await getIncreaseGasPrice(),
    };

    await safeSdk.executeTransaction(safetx, options);

    return true;
  } catch (e) {
    console.error(e);
  }
};

export const signRejectTx = async ({
  pid,
  walletAddress,
  gnosisTransactionUrl,
  gnosisAddress,
  networkId,
}) => {
  try {
    const web3 = new Web3(window.ethereum);
    const ethAdapter = new Web3Adapter({
      web3: web3,
      signerAddress: Web3.utils.toChecksumAddress(walletAddress),
    });

    const txServiceUrl = gnosisTransactionUrl;

    const safeService = new SafeApiKit({
      txServiceUrl,
      ethAdapter,
    });

    const proposalTxHash = await getProposalTxHash(pid);
    const safetx = await safeService.getTransaction(
      proposalTxHash.data[0].txHash,
    );

    const safeSdk = await getSafeSdk(
      Web3.utils.toChecksumAddress(gnosisAddress),
      Web3.utils.toChecksumAddress(walletAddress),
      networkId,
    );

    const safeTransaction = await safeSdk.createRejectionTransaction(
      safetx.nonce,
    );

    const senderSignature = await safeSdk.signTypedData(safeTransaction, "v4");

    await safeService.confirmTransaction(
      safetx.safeTxHash,
      senderSignature.data,
    );

    return true;
  } catch (e) {
    console.error(e);
  }
};

export const fetchABI = async (executionId, tokenType) => {
  switch (executionId) {
    case 0:
    case 4:
      return [
        "function approve(address spender, uint256 amount)",
        "function contractCalls(address _to, bytes memory _data)",
        "function airDropToken(address _airdropTokenAddress,uint256[] memory _airdropAmountArray,address[] memory _members)",
      ];
    case 1:
    case 2:
    case 5:
    case 9:
      if (tokenType === "erc721") return erc721DaoABI;
      else return erc20DaoABI;
    case 3:
    case 10:
    case 11:
    case 12:
    case 16:
    case 13:
      return factoryContractABI;
    case 8:
      return seaportABI;
    default:
      return null;
  }
};

export const getEncodedData = async ({
  proposalData,
  daoAddress,
  clubData,
  factoryData,
  contractABI,
  setMembers,
  getBalance,
  getERC20TotalSupply,
  getNftOwnersCount,
  networkId,
  gnosisAddress,
}) => {
  let membersArray = [];
  let airDropAmountArray = [];
  let approvalData;
  let data;

  const {
    executionId,
    airDropAmount,
    airDropCarryFee,
    airDropToken,
    mintGTAmounts,
    mintGTAddresses,
    quorum,
    threshold,
    totalDeposits,
    customTokenAmounts,
    customToken,
    customTokenAddresses,
    customNft,
    customNftToken,
    nftLink,
    merkleRoot,
    pricePerToken,
  } = proposalData.commands[0];
  let iface;

  if (contractABI) iface = new Interface(contractABI);

  switch (executionId) {
    case 0:
      const membersData = await subgraphQuery(
        CHAIN_CONFIG[networkId]?.stationSubgraphUrl,
        QUERY_ALL_MEMBERS(daoAddress),
      );

      setMembers(membersData);
      membersData.users.map((member) => membersArray.push(member.userAddress));

      approvalData = iface.encodeFunctionData("approve", [
        CHAIN_CONFIG[networkId]?.airdropContractAddress,
        airDropAmount,
      ]);
      if (airDropCarryFee !== 0) {
        const carryFeeAmount = (airDropAmount * airDropCarryFee) / 100;
        airDropAmountArray = await Promise.all(
          membersArray.map(async (member) => {
            const balance = await getBalance(
              daoAddress,
              Web3.utils.toChecksumAddress(member),
            );

            let clubTokensMinted;
            if (clubData.tokenType === "erc20") {
              clubTokensMinted = await getERC20TotalSupply();
            } else {
              clubTokensMinted = await getNftOwnersCount();
            }

            return (
              ((airDropAmount - carryFeeAmount) * balance) /
              clubTokensMinted
            )
              .toFixed(0)
              .toString();
          }),
        );
        airDropAmountArray.unshift(carryFeeAmount.toString());
        membersArray.unshift(
          Web3.utils.toChecksumAddress(proposalData.createdBy),
        );
      } else {
        airDropAmountArray = await Promise.all(
          membersArray.map(async (member) => {
            const balance = await getBalance(
              daoAddress,
              Web3.utils.toChecksumAddress(member),
            );

            let clubTokensMinted;
            if (clubData.tokenType === "erc20") {
              clubTokensMinted = await getERC20TotalSupply();
            } else {
              clubTokensMinted = await getNftOwnersCount();
            }

            return ((airDropAmount * balance) / clubTokensMinted)
              .toFixed(0)
              .toString();
          }),
        );
      }

      data = iface.encodeFunctionData("airDropToken", [
        airDropToken,
        airDropAmountArray,
        membersArray,
      ]);

      return { data, approvalData, membersArray, airDropAmountArray };

    case 1:
      if (clubData.tokenType === "erc20") {
        data = iface.encodeFunctionData("mintGTToAddress", [
          mintGTAmounts,
          mintGTAddresses,
        ]);
      } else {
        const clubDetails = await subgraphQuery(
          CHAIN_CONFIG[networkId]?.stationSubgraphUrl,
          QUERY_STATION_DETAILS(daoAddress),
        );
        const tokenURI = clubDetails?.stations[0].imageUrl;
        data = iface.encodeFunctionData("mintGTToAddress", [
          mintGTAmounts,
          [tokenURI],
          mintGTAddresses,
        ]);
      }

      return { data };

    case 2:
      data = iface.encodeFunctionData("updateGovernanceSettings", [
        quorum * 100,
        threshold * 100,
      ]);
      return { data };

    case 3:
      data = iface.encodeFunctionData("updateTotalRaiseAmount", [
        convertToWeiGovernance(
          convertToWeiGovernance(totalDeposits, 6) / factoryData?.pricePerToken,
          18,
        ),
        factoryData?.pricePerToken,
        daoAddress,
      ]);
      return { data };

    case 4:
      if (customToken === CHAIN_CONFIG[networkId].nativeToken) {
        return {};
      } else {
        approvalData = iface.encodeFunctionData("approve", [
          CHAIN_CONFIG[networkId]?.airdropContractAddress,
          customTokenAmounts[0],
        ]);

        data = iface.encodeFunctionData("airDropToken", [
          customToken,
          customTokenAmounts,
          customTokenAddresses,
        ]);

        membersArray = customTokenAddresses;
        airDropAmountArray = customTokenAmounts;

        return { data, approvalData, membersArray, airDropAmountArray };
      }

    case 5:
      data = iface.encodeFunctionData("transferNft", [
        customNft,
        customTokenAddresses[0],
        customNftToken,
      ]);
      return { data };

    case 8:
      const parts = nftLink.split("/");

      const linkData = parts.slice(-3);
      const nftdata = await retrieveNftListing(
        linkData[0],
        linkData[1],
        linkData[2],
      );
      let transactionData;
      if (nftdata) {
        const offer = {
          hash: nftdata.data.orders[0].order_hash,
          chain: linkData[0],
          protocol_address: nftdata.data.orders[0].protocol_address,
        };

        const fulfiller = {
          address: daoAddress,
        };
        const consideration = {
          asset_contract_address: linkData[1],
          token_id: linkData[2],
        };
        transactionData = await fulfillOrder(offer, fulfiller, consideration);

        const {
          considerationToken,
          considerationIdentifier,
          considerationAmount,
          offerer,
          zone,
          offerToken,
          offerIdentifier,
          offerAmount,
          basicOrderType,
          startTime,
          endTime,
          zoneHash,
          salt,
          offererConduitKey,
          fulfillerConduitKey,
          totalOriginalAdditionalRecipients,
          additionalRecipients,
          signature,
        } = transactionData.fulfillment_data.transaction.input_data.parameters;

        data = iface.encodeFunctionData("fulfillBasicOrder_efficient_6GL6yc", [
          [
            considerationToken,
            considerationIdentifier,
            considerationAmount,
            offerer,
            zone,
            offerToken,
            offerIdentifier,
            offerAmount,
            basicOrderType,
            startTime,
            endTime,
            zoneHash,
            salt,
            offererConduitKey,
            fulfillerConduitKey,
            totalOriginalAdditionalRecipients,
            additionalRecipients,
            signature,
          ],
        ]);
      }
      return { data, transactionData };
    case 10:
    case 11:
    case 12:
    case 16:
      let iface2 = new Interface(erc20DaoABI);
      approvalData = iface2.encodeFunctionData("toggleOnlyAllowWhitelist", []);

      data = iface.encodeFunctionData("changeMerkleRoot", [
        daoAddress,
        merkleRoot?.merkleRoot,
      ]);
      return { data, approvalData };
    case 13:
      data = iface.encodeFunctionData("updateTotalRaiseAmount", [
        factoryData?.distributionAmount,
        convertToWeiGovernance(pricePerToken, 6),
        daoAddress,
      ]);
      return { data };

    default:
      return {};
  }
};

const approveDepositWithEncodeABI = (
  contractAddress,
  approvalContract,
  amount,
  web3Call,
) => {
  if (contractAddress) {
    const erc20TokenContractCall = new web3Call.eth.Contract(
      erc20TokenABI,
      contractAddress,
    );

    return erc20TokenContractCall?.methods
      ?.approve(approvalContract, amount)
      .encodeABI();
  }
};

const transferNFTfromSafe = (
  tokenAddress,
  gnosisAddress,
  receiverAddress,
  tokenId,
  web3Call,
) => {
  if (tokenAddress) {
    const erc20TokenContractCall = new web3Call.eth.Contract(
      erc20TokenABI,
      tokenAddress,
    );

    return erc20TokenContractCall?.methods
      ?.transferFrom(gnosisAddress, receiverAddress, tokenId)
      .encodeABI();
  }
};

const airdropTokenMethodEncoded = (
  actionContractAddress,
  airdropTokenAddress,
  amountArray,
  members,
  web3Call,
) => {
  if (actionContractAddress) {
    const actionContractSend = new web3Call.eth.Contract(
      actionContractABI,
      actionContractAddress,
    );

    return actionContractSend.methods
      .airDropToken(airdropTokenAddress, amountArray, members)
      .encodeABI();
  }
};

const depositErc20TokensToAavePool = (
  depositTokenAddress,
  depositAmount,
  addressWhereAssetsStored,
  referalCode = 0,
  web3Call,
  networkId,
) => {
  const depositInAavePoolCall = new web3Call.eth.Contract(
    erc20AaveABI,
    CHAIN_CONFIG[networkId].aavePoolAddress,
  );

  return depositInAavePoolCall.methods
    .supply(
      depositTokenAddress,
      depositAmount,
      addressWhereAssetsStored,
      referalCode,
    )
    .encodeABI();
};

const stakeErc20TokensToStargate = (
  stakeTokenAddress,
  stakeAmount,
  gnosisAddress,
  web3Call,
  networkId,
) => {
  const stakeInStargate = new web3Call.eth.Contract(
    stargateStakeABI,
    CHAIN_CONFIG[networkId].stargateRouterAddress,
  );
  return stakeInStargate.methods
    .addLiquidity(
      CHAIN_CONFIG[networkId].stargatePoolIds[stakeTokenAddress],
      stakeAmount,
      gnosisAddress,
    )
    .encodeABI();
};

const unstakeErc20TokensToStargate = (
  unstakeTokenAddress,
  unstakeAmount,
  gnosisAddress,
  web3Call,
  networkId,
) => {
  const stakeInStargate = new web3Call.eth.Contract(
    stargateStakeABI,
    CHAIN_CONFIG[networkId].stargateRouterAddress,
  );

  return stakeInStargate.methods
    .instantRedeemLocal(
      CHAIN_CONFIG[networkId].stargatePoolIds[unstakeTokenAddress],
      unstakeAmount,
      gnosisAddress,
    )
    .encodeABI();
};

const swapWithUniswap = (
  swapToken,
  destinationToken,

  gnosisAddress,

  swapAmount,
  web3Call,
  networkId,
) => {
  const uniswapContract = new web3Call.eth.Contract(
    uniswapABI,
    CHAIN_CONFIG[networkId].uniswapRouterAddress,
  );

  return uniswapContract.methods
    .exactInputSingle([
      swapToken,
      destinationToken,
      500,
      gnosisAddress,
      Date.now() + 120,
      swapAmount,
      0,
      0,
    ])
    .encodeABI();
};

const depositEthMethodEncoded = (
  poolAddress,
  addressWhereAssetsStored,
  referalCode,
  web3Call,
  networkId,
) => {
  const depositEthCall = new web3Call.eth.Contract(
    maticAaveABI,
    CHAIN_CONFIG[networkId].aavePoolAddress,
  );

  return depositEthCall.methods
    .depositETH(poolAddress, addressWhereAssetsStored, referalCode)
    .encodeABI();
};

const withdrawEthMethodEncoded = (
  poolAddress,
  withdrawAmount,
  addressWhereAssetsStored,
  web3Call,
  networkId,
) => {
  const withdrawEthCall = new web3Call.eth.Contract(
    maticAaveABI,
    CHAIN_CONFIG[networkId].aavePoolAddress,
  );

  return withdrawEthCall.methods
    .withdrawETH(poolAddress, withdrawAmount, addressWhereAssetsStored)
    .encodeABI();
};

const withdrawErc20MethodEncoded = (
  tokenAddress,
  withdrawAmount,
  addressWhereAssetsStored,
  web3Call,
  networkId,
) => {
  const withdrawEthCall = new web3Call.eth.Contract(
    erc20AaveABI,
    CHAIN_CONFIG[networkId].aavePoolAddress,
  );

  return withdrawEthCall.methods
    .withdraw(tokenAddress, withdrawAmount, addressWhereAssetsStored)
    .encodeABI();
};

export const getTransaction = async ({
  proposalData,
  daoAddress,
  factoryContractAddress,
  approvalData,
  transactionData,
  tokenData,
  gnosisAddress,
  parameters,
  isAssetsStoredOnGnosis,
  networkId,
  membersArray,
  airDropAmountArray,
}) => {
  const {
    executionId,
    safeThreshold,
    ownerAddress,
    airDropAmount,
    customTokenAmounts,
    customTokenAddresses,
    customNftToken,
    depositAmount,
    withdrawAmount,
    swapToken,
    destinationToken,
    swapAmount,
    stakeAmount,
    unstakeAmount,
  } = proposalData.commands[0];
  let approvalTransaction;
  let transaction;
  const web3Call = new Web3(CHAIN_CONFIG[networkId]?.appRpcUrl);

  switch (executionId) {
    case 0:
    case 4:
      if (tokenData === CHAIN_CONFIG[networkId].nativeToken) {
        transaction = {
          to: Web3.utils.toChecksumAddress(customTokenAddresses[0]),
          data: "0x",
          value: customTokenAmounts[0],
        };
        return { transaction };
      } else {
        approvalTransaction = {
          to: Web3.utils.toChecksumAddress(tokenData),
          data: approveDepositWithEncodeABI(
            tokenData,
            CHAIN_CONFIG[networkId]?.airdropContractAddress,
            executionId === 0 ? airDropAmount : customTokenAmounts[0],
            web3Call,
          ),
          value: "0",
        };
        transaction = {
          to: Web3.utils.toChecksumAddress(
            CHAIN_CONFIG[networkId]?.airdropContractAddress,
          ),
          data: airdropTokenMethodEncoded(
            CHAIN_CONFIG[networkId]?.airdropContractAddress,
            tokenData,
            airDropAmountArray,
            membersArray,
            web3Call,
          ),
          value: 0,
        };

        return { transaction, approvalTransaction };
      }

    case 1:
    case 2:
    case 3:
    case 13:
      transaction = {
        //dao
        to: Web3.utils.toChecksumAddress(daoAddress),
        data: encodeFunctionData({
          abi: erc20DaoABI,
          functionName: "updateProposalAndExecution",
          args: [
            factoryContractAddress ? factoryContractAddress : daoAddress,
            parameters,
          ],
        }),
        // erc20DaoContractCall.methods
        //   .updateProposalAndExecution(
        //     //factory
        //     factoryContractAddress ? factoryContractAddress : daoAddress,
        //     parameters,
        //   )
        //   .encodeABI(),
        value: "0",
      };
      return { transaction };

    case 5:
      transaction = {
        //dao
        to: Web3.utils.toChecksumAddress(tokenData),
        data: transferNFTfromSafe(
          tokenData,
          gnosisAddress,
          customTokenAddresses[0],
          customNftToken,
          web3Call,
        ),
        value: "0",
      };
      return { transaction };
    case 6:
    case 7:
      transaction = {
        ownerAddress,
        threshold: safeThreshold,
      };
      return { transaction };
    case 8:
      if (isAssetsStoredOnGnosis) {
        const seaportContract = new web3Call.eth.Contract(
          seaportABI,
          SEAPORT_CONTRACT_ADDRESS,
        );
        transaction = {
          to: Web3.utils.toChecksumAddress(SEAPORT_CONTRACT_ADDRESS),
          data: seaportContract.methods
            .fulfillBasicOrder_efficient_6GL6yc(
              transactionData.fulfillment_data.transaction.input_data
                .parameters,
            )
            .encodeABI(),
          value: transactionData.fulfillment_data.transaction.value.toString(),
        };
      } else {
        transaction = {
          to: Web3.utils.toChecksumAddress(daoAddress),
          data: encodeFunctionData({
            abi: erc20DaoABI,
            functionName: "updateProposalAndExecution",
            args: [
              Web3.utils.toChecksumAddress(SEAPORT_CONTRACT_ADDRESS),
              parameters,
            ],
          }),
          // erc20DaoContractCall.methods
          //   .updateProposalAndExecution(
          //     Web3.utils.toChecksumAddress(SEAPORT_CONTRACT_ADDRESS),
          //     parameters,
          //   )
          //   .encodeABI(),
          value: "10000000000000000",
        };
      }
      return { transaction };
    case 10:
    case 11:
    case 12:
    case 16:
      approvalTransaction = {
        to: Web3.utils.toChecksumAddress(daoAddress),
        data: encodeFunctionData({
          abi: erc20DaoABI,
          functionName: "updateProposalAndExecution",
          args: [daoAddress, approvalData],
        }),
        //  erc20DaoContractCall.methods
        //   .updateProposalAndExecution(
        //     //usdc address
        //     daoAddress,
        //     approvalData,
        //   )
        //   .encodeABI(),
        value: "0",
      };
      transaction = {
        //dao
        to: Web3.utils.toChecksumAddress(daoAddress),
        data: encodeFunctionData({
          abi: erc20DaoABI,
          functionName: "updateProposalAndExecution",
          args: [
            factoryContractAddress ? factoryContractAddress : daoAddress,
            parameters,
          ],
        }),
        // erc20DaoContractCall.methods
        //   .updateProposalAndExecution(
        //     //factory
        //     factoryContractAddress ? factoryContractAddress : daoAddress,
        //     parameters,
        //   )
        //   .encodeABI(),
        value: "0",
      };
      return { transaction, approvalTransaction };
    case 14:
      if (tokenData === CHAIN_CONFIG[networkId].nativeToken) {
        transaction = {
          to: Web3.utils.toChecksumAddress(
            CHAIN_CONFIG[networkId].aaveMaticPoolAddress,
          ),
          data: depositEthMethodEncoded(
            CHAIN_CONFIG[networkId]?.aavePoolAddress,
            gnosisAddress,
            0,
            web3Call,
            networkId,
          ),
          value: depositAmount.toString(),
        };

        return { transaction };
      } else {
        approvalTransaction = {
          to: Web3.utils.toChecksumAddress(tokenData),
          data: approveDepositWithEncodeABI(
            tokenData,
            CHAIN_CONFIG[networkId].aavePoolAddress,
            depositAmount,
            web3Call,
          ),
          value: "0",
        };
        transaction = {
          to: Web3.utils.toChecksumAddress(
            CHAIN_CONFIG[networkId].aavePoolAddress,
          ),
          data: depositErc20TokensToAavePool(
            tokenData,
            depositAmount,
            gnosisAddress,
            0,
            web3Call,
            networkId,
          ),
          value: "0",
        };

        return { transaction, approvalTransaction };
      }

    case 15:
      if (tokenData === CHAIN_CONFIG[networkId].nativeToken) {
        approvalTransaction = {
          to: Web3.utils.toChecksumAddress(
            CHAIN_CONFIG[networkId].aaveWrappedMaticAddress,
          ),
          data: approveDepositWithEncodeABI(
            CHAIN_CONFIG[networkId].aaveWrappedMaticAddress,
            CHAIN_CONFIG[networkId].aaveMaticPoolAddress,
            withdrawAmount,
            web3Call,
          ),
          value: "0",
        };

        transaction = {
          to: Web3.utils.toChecksumAddress(
            CHAIN_CONFIG[networkId].aaveMaticPoolAddress,
          ),
          data: withdrawEthMethodEncoded(
            CHAIN_CONFIG[networkId].aavePoolAddress,
            withdrawAmount,
            gnosisAddress,
            web3Call,
            networkId,
          ),
          value: "0",
        };
      } else {
        approvalTransaction = {
          to: Web3.utils.toChecksumAddress(
            CHAIN_CONFIG[networkId].aaveWrappedUsdcAddress,
          ),
          data: approveDepositWithEncodeABI(
            CHAIN_CONFIG[networkId].aaveWrappedUsdcAddress,
            CHAIN_CONFIG[networkId].aavePoolAddress,
            withdrawAmount,
            web3Call,
          ),
          value: "0",
        };

        transaction = {
          to: Web3.utils.toChecksumAddress(
            CHAIN_CONFIG[networkId].aavePoolAddress,
          ),
          data: withdrawErc20MethodEncoded(
            Web3.utils.toChecksumAddress(tokenData),
            withdrawAmount,
            gnosisAddress,
            web3Call,
            networkId,
          ),
          value: "0",
        };
      }
    case 19:
      approvalTransaction = {
        to: Web3.utils.toChecksumAddress(tokenData),
        data: approveDepositWithEncodeABI(
          tokenData,
          CHAIN_CONFIG[networkId].uniswapRouterAddress,
          swapAmount,
          web3Call,
        ),
        value: "0",
      };
      transaction = {
        to: Web3.utils.toChecksumAddress(
          CHAIN_CONFIG[networkId].uniswapRouterAddress,
        ),
        data: swapWithUniswap(
          swapToken,
          destinationToken,
          gnosisAddress,
          swapAmount,
          web3Call,
          networkId,
        ),
        value: "0",
      };
      return { approvalTransaction, transaction };
    case 17:
      approvalTransaction = {
        to: Web3.utils.toChecksumAddress(tokenData),
        data: approveDepositWithEncodeABI(
          tokenData,
          CHAIN_CONFIG[networkId].stargateRouterAddress,
          stakeAmount,
          web3Call,
        ),
        value: "0",
      };

      transaction = {
        to: Web3.utils.toChecksumAddress(
          CHAIN_CONFIG[networkId].stargateRouterAddress,
        ),
        data: stakeErc20TokensToStargate(
          tokenData,
          stakeAmount,
          gnosisAddress,
          web3Call,
          networkId,
        ),
        value: "0",
      };
      return { transaction, approvalTransaction };
    case 18:
      approvalTransaction = {
        to: Web3.utils.toChecksumAddress(tokenData),
        data: approveDepositWithEncodeABI(
          tokenData,
          CHAIN_CONFIG[networkId].stargateRouterAddress,
          unstakeAmount,
          web3Call,
        ),
        value: "0",
      };
      transaction = {
        to: Web3.utils.toChecksumAddress(
          CHAIN_CONFIG[networkId].stargateRouterAddress,
        ),
        data: unstakeErc20TokensToStargate(
          tokenData,
          unstakeAmount,
          gnosisAddress,
          web3Call,
          networkId,
        ),
        value: "0",
      };

      return { transaction, approvalTransaction };
  }
};
