import { useSelector } from "react-redux";
import Web3 from "web3";
import {
  getIncreaseGasPrice,
  getSafeSdk,
  readContractFunction,
  writeContractFunction,
} from "utils/helper";
import { createProposalTxHash, getProposalTxHash } from "../api/proposal";
import { useAccount, useNetwork } from "wagmi";
import { factoryContractABI } from "abis/factoryContract.js";
import { createSafeTransactionData, getTransaction } from "utils/proposal";
import { erc20DaoABI } from "abis/erc20Dao";
import { erc721DaoABI } from "abis/erc721Dao";
import { encodeFunctionData } from "viem";
import { CHAIN_CONFIG } from "utils/constants";

const useAppContractMethods = (params) => {
  const { daoAddress } = params ?? {};

  const { address: walletAddress } = useAccount();

  const { chain } = useNetwork();
  const networkId = "0x" + chain?.id.toString(16);

  const isAssetsStoredOnGnosis = useSelector((state) => {
    return state.club.factoryData.assetsStoredOnGnosis;
  });

  const getDaoDetails = async () => {
    const response = await readContractFunction({
      address: CHAIN_CONFIG[networkId].factoryContractAddress,
      abi: factoryContractABI,
      functionName: "getDAOdetails",
      args: [daoAddress],
      account: walletAddress,
      networkId,
    });

    return response
      ? {
          ...response,
          depositCloseTime: Number(response?.depositCloseTime),
          distributionAmount: Number(response?.distributionAmount),
          maxDepositPerUser: Number(response?.maxDepositPerUser),
          minDepositPerUser: Number(response?.minDepositPerUser),
          ownerFeePerDepositPercent: Number(
            response?.ownerFeePerDepositPercent,
          ),
          pricePerToken: Number(response?.pricePerToken),
        }
      : {};
  };

  const getERC20DAOdetails = async () => {
    const response = await readContractFunction({
      address: daoAddress,
      abi: erc20DaoABI,
      functionName: "getERC20DAOdetails",
      args: [],
      account: walletAddress,
      networkId,
    });

    return response
      ? {
          ...response,
          quorum: Number(response?.quorum),
          threshold: Number(response?.threshold),
        }
      : {};
  };

  const getERC721DAOdetails = async () => {
    const response = await readContractFunction({
      address: daoAddress,
      abi: erc721DaoABI,
      functionName: "getERC721DAOdetails",
      args: [],
      account: walletAddress,
      networkId,
    });

    return response
      ? {
          ...response,
          quorum: Number(response?.quorum),
          threshold: Number(response?.threshold),
          maxTokensPerUser: Number(response?.maxTokensPerUser),
        }
      : {};
  };

  const getTokenGatingDetails = async () => {
    let response = await readContractFunction({
      address: CHAIN_CONFIG[networkId].factoryContractAddress,
      abi: factoryContractABI,
      functionName: "getTokenGatingDetails",
      args: [daoAddress],
      account: walletAddress,
      networkId,
    });

    response = response?.map((item) => {
      return {
        ...item,
        value: item.value.map((val) => Number(val)),
      };
    });

    return response ?? [];
  };

  const getDaoBalance = async (is721) => {
    const response = await readContractFunction({
      address: daoAddress,
      abi: is721 ? erc721DaoABI : erc20DaoABI,
      functionName: "balanceOf",
      args: [walletAddress],
      account: walletAddress,
      networkId,
    });

    return Number(response ?? 0);
  };

  const getERC20TotalSupply = async () => {
    const response = await readContractFunction({
      address: daoAddress,
      abi: erc20DaoABI,
      functionName: "totalSupply",
      args: [],
      account: walletAddress,
      networkId,
    });

    return Number(response ?? 0);
  };

  const getNftOwnersCount = async () => {
    const response = await readContractFunction({
      address: daoAddress,
      abi: erc721DaoABI,
      functionName: "_tokenIdTracker",
      args: [],
      account: walletAddress,
      networkId,
    });

    return Number(response ?? 0);
  };

  const buyGovernanceTokenERC721DAO = async (
    userAddress,
    tokenUriOfNFT,
    numOfTokens,
    merkleProof,
  ) => {
    try {
      const res = await writeContractFunction({
        address: CHAIN_CONFIG[networkId].factoryContractAddress,
        abi: factoryContractABI,
        functionName: "buyGovernanceTokenERC721DAO",
        args: [
          userAddress,
          daoAddress,
          tokenUriOfNFT,
          numOfTokens,
          merkleProof,
        ],
        account: walletAddress,
        networkId,
      });
      return res;
    } catch (error) {
      throw error;
    }
  };

  const buyGovernanceTokenERC20DAO = async (
    userAddress,
    numOfTokens,
    merkleProof,
  ) => {
    try {
      const res = await writeContractFunction({
        address: CHAIN_CONFIG[networkId].factoryContractAddress,
        abi: factoryContractABI,
        functionName: "buyGovernanceTokenERC20DAO",
        args: [userAddress, daoAddress, numOfTokens, merkleProof],
        account: walletAddress,
        networkId,
      });
      return res;
    } catch (error) {
      throw error;
    }
  };

  const updateOwnerFee = async (ownerFeePerDeposit) => {
    try {
      const res = await writeContractFunction({
        address: CHAIN_CONFIG[networkId].factoryContractAddress,
        abi: factoryContractABI,
        functionName: "updateOwnerFee",
        args: [ownerFeePerDeposit, daoAddress],
        account: walletAddress,
        networkId,
      });
      return res;
    } catch (error) {
      throw error;
    }
  };

  const updateDepositTime = async (depositTime) => {
    try {
      const res = await writeContractFunction({
        address: CHAIN_CONFIG[networkId].factoryContractAddress,
        abi: factoryContractABI,
        functionName: "updateDepositTime",
        args: [depositTime, daoAddress],
        account: walletAddress,
        networkId,
      });
      return res;
    } catch (error) {
      throw error;
    }
  };

  const setupTokenGating = async (
    tokenA,
    tokenB,
    operator,
    comparator,
    value,
  ) => {
    try {
      const res = await writeContractFunction({
        address: CHAIN_CONFIG[networkId].factoryContractAddress,
        abi: factoryContractABI,
        functionName: "setupTokenGating",
        args: [tokenA, tokenB, operator, comparator, value, daoAddress],
        account: walletAddress,
        networkId,
      });
      return res;
    } catch (error) {
      throw error;
    }
  };

  const disableTokenGating = async () => {
    try {
      const res = await writeContractFunction({
        address: CHAIN_CONFIG[networkId].factoryContractAddress,
        abi: factoryContractABI,
        functionName: "disableTokenGating",
        args: [daoAddress],
        account: walletAddress,
        networkId,
      });
      return res;
    } catch (error) {
      throw error;
    }
  };

  const toggleWhitelist = async () => {
    const res = encodeFunctionData({
      abi: erc20DaoABI,
      functionName: "toggleOnlyAllowWhitelist",
    });

    return res;
  };

  const createERC721DAO = async ({
    clubName,
    clubSymbol,
    metadataURL,
    ownerFeePerDepositPercent,
    depositClose,
    quorum,
    threshold,
    safeThreshold,
    depositTokenAddress,
    treasuryAddress,
    addressList,
    maxTokensPerUser,
    distributeAmount,
    pricePerToken,
    isNftTransferable,
    isNftTotalSupplyUnlimited,
    isGovernanceActive,
    allowWhiteList,
    assetsStoredOnGnosis,
    merkleRoot,
  }) => {
    try {
      const res = await writeContractFunction({
        address: CHAIN_CONFIG[networkId].factoryContractAddress,
        abi: factoryContractABI,
        functionName: "createERC721DAO",
        args: [
          clubName,
          clubSymbol,
          metadataURL,
          ownerFeePerDepositPercent,
          depositClose,
          quorum,
          threshold,
          safeThreshold,
          depositTokenAddress,
          treasuryAddress,
          addressList,
          maxTokensPerUser,
          distributeAmount,
          pricePerToken,
          isNftTransferable,
          isNftTotalSupplyUnlimited,
          isGovernanceActive,
          allowWhiteList,
          assetsStoredOnGnosis,
          merkleRoot,
        ],
        account: walletAddress,
        networkId,
      });
      return res;
    } catch (error) {
      throw error;
    }
  };

  const createERC20DAO = async ({
    clubName,
    clubSymbol,
    distributeAmount,
    pricePerToken,
    minDepositPerUser,
    maxDepositPerUser,
    ownerFeePerDepositPercent,
    depositClose,
    quorum,
    threshold,
    safeThreshold,
    depositTokenAddress,
    treasuryAddress,
    addressList,
    isGovernanceActive,
    isGtTransferable,
    allowWhiteList,
    assetsStoredOnGnosis,
    merkleRoot,
  }) => {
    try {
      const res = await writeContractFunction({
        address: CHAIN_CONFIG[networkId].factoryContractAddress,
        abi: factoryContractABI,
        functionName: "createERC20DAO",
        args: [
          clubName,
          clubSymbol,
          distributeAmount,
          pricePerToken,
          minDepositPerUser,
          maxDepositPerUser,
          ownerFeePerDepositPercent,
          depositClose,
          quorum,
          threshold,
          safeThreshold,
          depositTokenAddress,
          treasuryAddress,
          addressList,
          isGovernanceActive,
          isGtTransferable,
          allowWhiteList,
          assetsStoredOnGnosis,
          merkleRoot,
        ],
        account: walletAddress,
        networkId,
      });
      return res;
    } catch (error) {
      console.log(error);
      throw error;
    }
  };

  const updateProposalAndExecution = async (
    data,
    approvalData = "",
    gnosisAddress = "",
    pid,
    tokenData,
    executionStatus,
    factoryContractAddress = "",
    proposalData,
    membersArray,
    airDropAmountArray,
    transactionData = "",
  ) => {
    const { executionId, safeThreshold } = proposalData.commands[0];
    const airdropContractAddress =
      CHAIN_CONFIG[networkId].airdropContractAddress;

    const parameters = data;

    const { safeSdk, safeService } = await getSafeSdk(
      gnosisAddress,
      walletAddress,
      CHAIN_CONFIG[networkId].gnosisTxUrl,
    );

    const proposalTxHash = await getProposalTxHash(pid);
    const txHash = proposalTxHash?.data[0]?.txHash ?? "";

    const tx = txHash ? await safeService.getTransaction(txHash) : null;

    const { transaction, approvalTransaction } = await getTransaction({
      proposalData,
      daoAddress,
      factoryContractAddress,
      approvalData,
      safeThreshold,
      transactionData,
      airdropContractAddress,
      tokenData,
      gnosisAddress,
      parameters,
      isAssetsStoredOnGnosis,
      networkId,
      membersArray,
      airDropAmountArray,
    });

    if (executionStatus !== "executed") {
      if (txHash === "") {
        const nonce = await safeService.getNextNonce(gnosisAddress);
        const safeTransactionData = createSafeTransactionData({
          approvalTransaction,
          transaction,
          nonce,
        });

        let safeTransaction;

        if (executionId === 6) {
          safeTransaction = await safeSdk.createAddOwnerTx(transaction);
        } else if (executionId === 7) {
          safeTransaction = await safeSdk.createRemoveOwnerTx(transaction);
        } else {
          safeTransaction = await safeSdk.createTransaction({
            safeTransactionData,
          });
        }

        const safeTxHash = await safeSdk.getTransactionHash(safeTransaction);

        const payload = {
          proposalId: pid,
          txHash: safeTxHash,
        };

        await createProposalTxHash(payload);

        const proposeTxn = await safeService.proposeTransaction({
          safeAddress: Web3.utils.toChecksumAddress(gnosisAddress),
          safeTransactionData: safeTransaction.data,
          safeTxHash: safeTxHash,
          senderAddress: Web3.utils.toChecksumAddress(walletAddress),
        });

        const senderSignature = await safeSdk.signTypedData(
          safeTransaction,
          "v4",
        );
        await safeService.confirmTransaction(safeTxHash, senderSignature.data);
        return proposeTxn;
      }
      //case for remaining signatures
      else {
        const safeTransactionData = createSafeTransactionData({
          approvalTransaction: approvalTransaction
            ? tx.dataDecoded.parameters[0].valueDecoded[0]
            : undefined,
          transaction: approvalTransaction
            ? tx.dataDecoded.parameters[0].valueDecoded[1]
            : tx,
          nonce: tx.nonce,
        });

        const safeTxHash = tx.safeTxHash;

        let safeTransaction;
        let rejectionTransaction;

        if (executionId === 6) {
          safeTransaction = await safeSdk.createAddOwnerTx(transaction);
        } else if (executionId === 7) {
          safeTransaction = await safeSdk.createRemoveOwnerTx(transaction);
        } else {
          safeTransaction = await safeSdk.createTransaction({
            safeTransactionData,
          });
          if (executionStatus === "cancel") {
            rejectionTransaction = await safeSdk.createRejectionTransaction(
              safeTransaction.data.nonce,
            );
          }
        }

        const senderSignature = await safeSdk.signTypedData(
          executionStatus === "cancel" ? rejectionTransaction : safeTransaction,
          "v4",
        );

        await safeService.confirmTransaction(safeTxHash, senderSignature.data);
        return tx;
      }
    } else {
      const options = {
        gasPrice: await getIncreaseGasPrice(networkId),
      };

      const executeTxResponse = await safeSdk.executeTransaction(tx, options);

      const receipt =
        executeTxResponse.transactionResponse &&
        (await executeTxResponse.transactionResponse.wait());

      return executeTxResponse;
    }
  };

  return {
    createERC20DAO,
    createERC721DAO,
    buyGovernanceTokenERC721DAO,
    buyGovernanceTokenERC20DAO,
    getDaoDetails,
    getERC20DAOdetails,
    getERC721DAOdetails,
    getDaoBalance,
    getNftOwnersCount,
    getERC20TotalSupply,
    updateOwnerFee,
    updateDepositTime,
    setupTokenGating,
    disableTokenGating,
    getTokenGatingDetails,
    updateProposalAndExecution,
    toggleWhitelist,
  };
};

export default useAppContractMethods;
