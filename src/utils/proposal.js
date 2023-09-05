import { getProposal } from "../api/proposal";
import SafeApiKit from "@safe-global/api-kit";
import Safe, { Web3Adapter } from "@safe-global/protocol-kit";
import { createCancelProposal, getProposalTxHash } from "api/proposal";
import Web3 from "web3";
import { getIncreaseGasPrice } from "./helper";
import { factoryContractABI } from "abis/factoryContract.js";
import { erc721DaoABI } from "abis/erc721Dao";
import { erc20DaoABI } from "abis/erc20Dao";
import { seaportABI } from "abis/seaport";
import { erc20AaveABI } from "abis/erc20AaveABI";
import { subgraphQuery } from "./subgraphs";
import { convertToWeiGovernance } from "./globalFunctions";
import { Interface } from "ethers";
import { fulfillOrder } from "api/assets";
import { SEAPORT_CONTRACT_ADDRESS } from "api";
import {
  AAVE_MATIC_POOL_ADDRESS,
  AAVE_POOL_ADDRESS,
  AAVE_WRAPPED_MATIC_ADDRESS,
  AAVE_WRAPPED_USDC_ADDRESS,
  CHAIN_CONFIG,
} from "./constants";
import {
  QUERY_ALL_MEMBERS,
  QUERY_STATION_DETAILS,
} from "api/graphql/stationQueries";

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

    const safeSdk = await Safe.create({
      ethAdapter: ethAdapter,
      safeAddress: Web3.utils.toChecksumAddress(gnosisAddress),
    });

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

    const safeSdk = await Safe.create({
      ethAdapter: ethAdapter,
      safeAddress: Web3.utils.toChecksumAddress(gnosisAddress),
    });

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

    const safeSdk = await Safe.create({
      ethAdapter: ethAdapter,
      safeAddress: Web3.utils.toChecksumAddress(gnosisAddress),
    });

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

export const fetchABI = async (proposalData, clubData) => {
  const executionId = proposalData.commands[0].executionId;
  const tokenType = clubData.tokenType;
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
      if (clubData.tokenType === "erc721") return erc721DaoABI;
      else return erc20DaoABI;
    case 3:
    case 10:
    case 11:
    case 12:
    case 13:
      return factoryContractABI;
    case 8:
      return seaportABI;
    case 9:
      if (tokenType === "erc721") return erc721DaoABI;
      else if (tokenType === "erc20") return erc20DaoABI;
    case 14:
    case 15:
      return erc20AaveABI;
  }
};

export const getEncodedData = async (
  proposalData,
  SUBGRAPH_URL,
  daoAddress,
  AIRDROP_ACTION_ADDRESS,
  clubData,
  factoryData,
  ABI,
) => {
  const executionId = proposalData.commands[0].executionId;
  let membersArray = [];
  let airDropAmountArray = [];
  let approvalData;
  let data;

  let iface = new Interface(ABI);

  switch (executionId) {
    case 0:
      const membersData = await subgraphQuery(
        SUBGRAPH_URL,
        QUERY_ALL_MEMBERS(daoAddress),
      );
      setMembers(membersData);
      membersData.users.map((member) => membersArray.push(member.userAddress));

      approvalData = iface.encodeFunctionData("approve", [
        AIRDROP_ACTION_ADDRESS,
        proposalData.commands[0].airDropAmount,
      ]);
      if (proposalData.commands[0].airDropCarryFee !== 0) {
        const carryFeeAmount =
          (proposalData.commands[0].airDropAmount *
            proposalData.commands[0].airDropCarryFee) /
          100;
        airDropAmountArray = await Promise.all(
          membersArray.map(async (member) => {
            const balance = await getNftBalance(
              clubData.tokenType,
              Web3.utils.toChecksumAddress(member),
            );

            let clubTokensMinted;
            if (clubData.tokenType === "erc20") {
              clubTokensMinted = await getERC20TotalSupply();
            } else {
              clubTokensMinted = await getNftOwnersCount();
            }

            return (
              ((proposalData.commands[0].airDropAmount - carryFeeAmount) *
                balance) /
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
            const balance = await getNftBalance(
              clubData.tokenType,
              Web3.utils.toChecksumAddress(member),
            );

            let clubTokensMinted;
            if (clubData.tokenType === "erc20") {
              clubTokensMinted = await getERC20TotalSupply();
            } else {
              clubTokensMinted = await getNftOwnersCount();
            }

            return (
              (proposalData.commands[0].airDropAmount * balance) /
              clubTokensMinted
            )
              .toFixed(0)
              .toString();
          }),
        );
      }

      data = iface.encodeFunctionData("airDropToken", [
        proposalData.commands[0].airDropToken,
        airDropAmountArray,
        membersArray,
      ]);

      return { data, approvalData, membersArray, airDropAmountArray };

    case 1:
      if (clubData.tokenType === "erc20") {
        data = iface.encodeFunctionData("mintGTToAddress", [
          [proposalData.commands[0].mintGTAmounts.toString()],
          proposalData.commands[0].mintGTAddresses,
        ]);
      } else {
        const clubDetails = await subgraphQuery(
          SUBGRAPH_URL,
          QUERY_STATION_DETAILS(daoAddress),
        );
        const tokenURI = clubDetails?.stations[0].imageUrl;
        data = iface.encodeFunctionData("mintGTToAddress", [
          proposalData.commands[0].mintGTAmounts,
          [tokenURI],
          proposalData.commands[0].mintGTAddresses,
        ]);
      }

      console.log(data);
      return { data };

    case 2:
      data = iface.encodeFunctionData("updateGovernanceSettings", [
        proposalData.commands[0].quorum * 100,
        proposalData.commands[0].threshold * 100,
      ]);
      return { data };
    case 3:
      data = iface.encodeFunctionData("updateTotalRaiseAmount", [
        convertToWeiGovernance(
          convertToWeiGovernance(proposalData.commands[0].totalDeposits, 6) /
            factoryData?.pricePerToken,
          18,
        ),
        factoryData?.pricePerToken,
        daoAddress,
      ]);
      return { data };
    case 4:
      approvalData = iface.encodeFunctionData("approve", [
        AIRDROP_ACTION_ADDRESS,
        proposalData.commands[0].customTokenAmounts[0],
      ]);

      data = iface.encodeFunctionData("airDropToken", [
        proposalData.commands[0].customToken,
        proposalData.commands[0].customTokenAmounts,
        proposalData.commands[0].customTokenAddresses,
      ]);

      membersArray = proposalData.commands[0].customTokenAddresses;
      airDropAmountArray = proposalData.commands[0].customTokenAmounts;

      return { data, approvalData, membersArray, airDropAmountArray };

    case 5:
      data = iface.encodeFunctionData("transferNft", [
        proposalData?.commands[0].customNft,
        proposalData?.commands[0].customTokenAddresses[0],
        proposalData?.commands[0].customNftToken,
      ]);
      return { data };
    case 8:
      const parts = proposalData?.commands[0].nftLink.split("/");

      const linkData = parts.slice(-3);
      const nftdata = await retrieveNftListing(
        linkData[0],
        linkData[1],
        linkData[2],
      );

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
        let iface = new Interface(ABI);

        data = iface.encodeFunctionData("fulfillBasicOrder_efficient_6GL6yc", [
          [
            transactionData.fulfillment_data.transaction.input_data.parameters
              .considerationToken,
            transactionData.fulfillment_data.transaction.input_data.parameters
              .considerationIdentifier,
            transactionData.fulfillment_data.transaction.input_data.parameters
              .considerationAmount,
            transactionData.fulfillment_data.transaction.input_data.parameters
              .offerer,
            transactionData.fulfillment_data.transaction.input_data.parameters
              .zone,
            transactionData.fulfillment_data.transaction.input_data.parameters
              .offerToken,
            transactionData.fulfillment_data.transaction.input_data.parameters
              .offerIdentifier,
            transactionData.fulfillment_data.transaction.input_data.parameters
              .offerAmount,
            transactionData.fulfillment_data.transaction.input_data.parameters
              .basicOrderType,
            transactionData.fulfillment_data.transaction.input_data.parameters
              .startTime,
            transactionData.fulfillment_data.transaction.input_data.parameters
              .endTime,
            transactionData.fulfillment_data.transaction.input_data.parameters
              .zoneHash,
            transactionData.fulfillment_data.transaction.input_data.parameters
              .salt,
            transactionData.fulfillment_data.transaction.input_data.parameters
              .offererConduitKey,
            transactionData.fulfillment_data.transaction.input_data.parameters
              .fulfillerConduitKey,
            transactionData.fulfillment_data.transaction.input_data.parameters
              .totalOriginalAdditionalRecipients,
            transactionData.fulfillment_data.transaction.input_data.parameters
              .additionalRecipients,
            transactionData.fulfillment_data.transaction.input_data.parameters
              .signature,
          ],
        ]);
      }
      return { data, transactionData };
    case 10:
    case 11:
    case 12:
      let iface2 = new Interface(erc20DaoABI);

      approvalData = iface2.encodeFunctionData("toggleOnlyAllowWhitelist", []);

      data = iface.encodeFunctionData("changeMerkleRoot", [
        daoAddress,
        proposalData.commands[0]?.merkleRoot?.merkleRoot,
      ]);
      return { data };
    case 13:
      data = iface.encodeFunctionData("updateTotalRaiseAmount", [
        factoryData?.distributionAmount,
        convertToWeiGovernance(proposalData.commands[0]?.pricePerToken, 6),
        daoAddress,
      ]);
      return { data };
    case 14:
    case 15:
      return { data: "" };
  }
};

export const getTransaction = async (
  proposalData,
  daoAddress,
  factoryContractAddress,
  approvalData,
  ownerAddress,
  safeThreshold,
  transactionData,
  airdropContractAddress,
  tokenData,
  gnosisAddress,
  contractInstances,
  parameters,
  isAssetsStoredOnGnosis,
  networkId,
  approveDepositWithEncodeABI,
  transferNFTfromSafe,
  airdropTokenMethodEncoded,
  depositErc20TokensToAavePool,
  depositEthMethodEncoded,
  withdrawEthMethodEncoded,
  withdrawErc20MethodEncoded,
) => {
  const executionId = proposalData.commands[0].executionId;
  let approvalTransaction;
  let transaction;

  const { erc20DaoContractCall } = contractInstances;

  switch (executionId) {
    case 0:
    case 4:
      if (isAssetsStoredOnGnosis) {
        approvalTransaction = {
          to: Web3.utils.toChecksumAddress(tokenData),
          // data: tokenData.methods.approve(dao / action).encodeABI(), // for send/airdrop -> action & send NFT -> daoAddress
          data: approveDepositWithEncodeABI(
            tokenData,
            airdropContractAddress,
            proposalData.commands[0].executionId === 0
              ? proposalData.commands[0].airDropAmount
              : proposalData.commands[0].customTokenAmounts[0],
          ),
          value: "0",
        };
        transaction = {
          to: Web3.utils.toChecksumAddress(airdropContractAddress),
          data: airdropTokenMethodEncoded(
            airdropContractAddress,
            tokenData,
            airDropAmountArray,
            membersArray,
          ),
          value: 0,
        };
      } else {
        approvalTransaction = {
          to: Web3.utils.toChecksumAddress(daoAddress),
          data: erc20DaoContractCall.methods
            .updateProposalAndExecution(
              //usdc address
              tokenData,
              approvalData,
            )
            .encodeABI(),
          value: "0",
        };
        transaction = {
          to: Web3.utils.toChecksumAddress(daoAddress),
          data: erc20DaoContractCall.methods
            .updateProposalAndExecution(
              //airdrop address
              airdropContractAddress,
              parameters,
            )
            .encodeABI(),
          value: "0",
        };
      }
      return { transaction, approvalTransaction };
    case 1:
    case 2:
    case 3:
    case 13:
      transaction = {
        //dao
        to: Web3.utils.toChecksumAddress(daoAddress),
        data: erc20DaoContractCall.methods
          .updateProposalAndExecution(
            //factory
            factoryContractAddress ? factoryContractAddress : daoAddress,
            parameters,
          )
          .encodeABI(),
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
          proposalData.commands[0].customTokenAddresses[0],
          proposalData.commands[0].customNftToken,
        ),
        value: "0",
      };
      return { transaction };
    case 6:
      transaction = {
        ownerAddress,
      };
      return { transaction };
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
          data: erc20DaoContractCall.methods
            .updateProposalAndExecution(
              Web3.utils.toChecksumAddress(SEAPORT_CONTRACT_ADDRESS),
              parameters,
            )
            .encodeABI(),
          value: "10000000000000000",
        };
      }
      return { transaction };
    case 10:
    case 11:
    case 12:
      approvalTransaction = {
        to: Web3.utils.toChecksumAddress(daoAddress),
        data: erc20DaoContractCall.methods
          .updateProposalAndExecution(
            //usdc address
            daoAddress,
            approvalData,
          )
          .encodeABI(),
        value: "0",
      };
      transaction = {
        //dao
        to: Web3.utils.toChecksumAddress(daoAddress),
        data: erc20DaoContractCall.methods
          .updateProposalAndExecution(
            //factory
            factoryContractAddress ? factoryContractAddress : daoAddress,
            parameters,
          )
          .encodeABI(),
        value: "0",
      };
      return { transaction, approvalTransaction };
    case 14:
      if (isAssetsStoredOnGnosis) {
        if (tokenData === CHAIN_CONFIG[networkId].nativeToken) {
          transaction = {
            to: Web3.utils.toChecksumAddress(AAVE_MATIC_POOL_ADDRESS),
            data: depositEthMethodEncoded(AAVE_POOL_ADDRESS, gnosisAddress, 0),
            value: proposalData.commands[0].depositAmount.toString(),
          };

          return { transaction };
        } else {
          approvalTransaction = {
            to: Web3.utils.toChecksumAddress(tokenData), // usdc address
            data: approveDepositWithEncodeABI(
              tokenData, // usdc
              AAVE_POOL_ADDRESS, // erc20 pool
              proposalData.commands[0].depositAmount, // amount
            ),
            value: "0",
          };
          transaction = {
            to: Web3.utils.toChecksumAddress(AAVE_POOL_ADDRESS),
            data: depositErc20TokensToAavePool(
              tokenData, // address
              proposalData.commands[0].depositAmount, // amount
              gnosisAddress,
              0, // referall
            ),
            value: "0",
          };

          return { transaction, approvalTransaction };
        }
      }
    case 15:
      if (isAssetsStoredOnGnosis) {
        if (tokenData === CHAIN_CONFIG[networkId].nativeToken) {
          approvalTransaction = {
            to: Web3.utils.toChecksumAddress(AAVE_WRAPPED_MATIC_ADDRESS),
            data: approveDepositWithEncodeABI(
              AAVE_WRAPPED_MATIC_ADDRESS,
              AAVE_MATIC_POOL_ADDRESS,
              proposalData.commands[0].withdrawAmount,
            ),
            value: "0",
          };

          transaction = {
            to: Web3.utils.toChecksumAddress(AAVE_MATIC_POOL_ADDRESS), // abi address
            data: withdrawEthMethodEncoded(
              AAVE_POOL_ADDRESS, // pool address
              proposalData.commands[0].withdrawAmount,
              gnosisAddress,
            ),
            value: "0",
          };
        } else {
          approvalTransaction = {
            to: Web3.utils.toChecksumAddress(AAVE_WRAPPED_USDC_ADDRESS),
            data: approveDepositWithEncodeABI(
              AAVE_WRAPPED_USDC_ADDRESS,
              AAVE_POOL_ADDRESS,
              proposalData.commands[0].withdrawAmount,
            ),
            value: "0",
          };

          transaction = {
            to: Web3.utils.toChecksumAddress(AAVE_POOL_ADDRESS),
            data: withdrawErc20MethodEncoded(
              Web3.utils.toChecksumAddress(tokenData), //  usdc
              proposalData.commands[0].withdrawAmount,
              gnosisAddress,
            ),
            value: "0",
          };
        }

        return { approvalTransaction, transaction };
      }
  }
};
