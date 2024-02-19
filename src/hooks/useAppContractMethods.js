import { useSelector } from "react-redux";
import Web3 from "web3";
import { readContractFunction, writeContractFunction } from "utils/helper";
import { createProposalTxHash } from "../api/proposal";
import { useAccount, useNetwork } from "wagmi";
import { factoryContractABI } from "abis/factoryContract.js";
import { getTransaction } from "utils/proposal";
import { erc20DaoABI } from "abis/erc20Dao";
import { erc721DaoABI } from "abis/erc721Dao";
import { encodeFunctionData } from "viem";
import { CHAIN_CONFIG } from "utils/constants";
import {
  createOrUpdateSafeTransaction,
  getSafeTransaction,
  getTransactionHash,
  signAndConfirmTransaction,
} from "utils/proposalData";
import { eigenContractABI } from "abis/eigenContract";

const useAppContractMethods = (params) => {
  const { daoAddress } = params ?? {};

  const { address: walletAddress } = useAccount();

  const { chain } = useNetwork();
  const networkId = "0x" + chain?.id.toString(16);

  const isAssetsStoredOnGnosis = useSelector((state) => {
    return state.club.factoryData.assetsStoredOnGnosis;
  });

  const getDaoDetails = async (stationAddress = daoAddress) => {
    const response = await readContractFunction({
      address: CHAIN_CONFIG[networkId].factoryContractAddress,
      abi: factoryContractABI,
      functionName: "getDAOdetails",
      args: [stationAddress],
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
    try {
      const response = await readContractFunction({
        address: daoAddress,
        abi: erc721DaoABI,
        functionName: "_tokenIdTracker",
        args: [],
        account: walletAddress,
        networkId,
      });
      return Number(response ?? 0);
    } catch (error) {
      console.error(error);
    }
  };

  const buyGovernanceTokenERC721DAO = async (
    userAddress,
    tokenUriOfNFT,
    numOfTokens,
    merkleProof,
    value,
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
        value: value,
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
    value,
  ) => {
    console.log({
      address: CHAIN_CONFIG[networkId].factoryContractAddress,
      abi: factoryContractABI,
      functionName: "buyGovernanceTokenERC20DAO",
      args: [userAddress, daoAddress, numOfTokens, merkleProof],
      account: walletAddress,
      value: value,
      networkId,
    });
    try {
      const res = await writeContractFunction({
        address: CHAIN_CONFIG[networkId].factoryContractAddress,
        abi: factoryContractABI,
        functionName: "buyGovernanceTokenERC20DAO",
        args: [userAddress, daoAddress, numOfTokens, merkleProof],
        account: walletAddress,
        value: value,
        networkId,
      });
      return res;
    } catch (error) {
      console.log(error);
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

  const fetchEigenTokenBalance = async (gnosisAddress) => {
    try {
      const res = await readContractFunction({
        address: CHAIN_CONFIG[networkId].eigenLayerDepositPoolAddress,
        abi: eigenContractABI,
        functionName: "getDeposits",
        args: [gnosisAddress],
        account: walletAddress,
        networkId,
      });
      return res;
    } catch (error) {
      console.error(error);
      return [];
    }
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
    depositToken,
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
          depositToken,
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

  const updateProposalAndExecution = async ({
    data,
    approvalData = "",
    gnosisAddress = "",
    pid,
    tokenData,
    proposalStatus,
    proposalData,
    membersArray,
    airDropAmountArray,
    transactionData = "",
  }) => {
    const { executionId, safeThreshold } = proposalData.commands[0];
    const airdropContractAddress =
      CHAIN_CONFIG[networkId].airdropContractAddress;

    const factoryContractAddress =
      CHAIN_CONFIG[networkId]?.factoryContractAddress;
    const parameters = data;

    const { safeSdk, safeService } = await getSafeTransaction(
      gnosisAddress,
      walletAddress,
      CHAIN_CONFIG[networkId].gnosisTxUrl,
    );

    const { transaction, approvalTransaction, stakeETHTransaction } =
      await getTransaction({
        proposalData,
        daoAddress,
        walletAddress,
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
    const txHash = await getTransactionHash(pid);
    const tx = txHash ? await safeService.getTransaction(txHash) : null;

    if (proposalStatus !== "executed") {
      if (txHash === "") {
        const nonce = await safeService.getNextNonce(gnosisAddress);
        const { safeTransaction, safeTxHash } =
          await createOrUpdateSafeTransaction({
            safeSdk,
            executionId,
            transaction,
            approvalTransaction,
            stakeETHTransaction,
            nonce,
            proposalStatus,
          });

        const payload = { proposalId: pid, txHash: safeTxHash };
        await createProposalTxHash(payload);

        const proposeTxn = await safeService.proposeTransaction({
          safeAddress: Web3.utils.toChecksumAddress(gnosisAddress),
          safeTransactionData: safeTransaction.data,
          safeTxHash: safeTxHash,
          senderAddress: Web3.utils.toChecksumAddress(walletAddress),
        });

        await signAndConfirmTransaction({
          safeSdk,
          safeService,
          safeTransaction,
          rejectionTransaction: null,
          executionStatus: proposalStatus,
          safeTxHash,
        });
        return proposeTxn;
      } else {
        const { safeTransaction, rejectionTransaction, safeTxHash } =
          await createOrUpdateSafeTransaction({
            safeSdk,
            executionId,
            transaction,
            approvalTransaction,
            stakeETHTransaction,
            nonce: tx.nonce,
            executionStatus: proposalStatus,
          });

        await signAndConfirmTransaction({
          safeSdk,
          safeService,
          safeTransaction,
          rejectionTransaction,
          executionStatus: proposalStatus,
          safeTxHash,
        });
        return tx;
      }
    } else {
      // const options = { gasPrice: await getIncreaseGasPrice(networkId) };
      const executeTxResponse = await safeSdk.executeTransaction(tx);
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
    fetchEigenTokenBalance,
  };
};

export default useAppContractMethods;
