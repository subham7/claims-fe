import { useSelector } from "react-redux";
import Web3 from "web3";
import {
  getIncreaseGasPrice,
  getSafeSdk,
  readContractFunction,
  writeContractFunction,
} from "utils/helper";
import { Web3Adapter } from "@safe-global/protocol-kit";
import { createProposalTxHash, getProposalTxHash } from "../api/proposal";
import SafeApiKit from "@safe-global/api-kit";
import { useAccount, useNetwork } from "wagmi";
import { factoryContractABI } from "abis/factoryContract.js";
import { getTransaction } from "utils/proposal";
import { erc20DaoABI } from "abis/erc20Dao";
import { erc721DaoABI } from "abis/erc721Dao";

const useAppContractMethods = () => {
  const { address: walletAddress } = useAccount();

  const { chain } = useNetwork();
  const networkId = "0x" + chain?.id.toString(16);

  const isAssetsStoredOnGnosis = useSelector((state) => {
    return state.club.factoryData.assetsStoredOnGnosis;
  });

  const contractInstances = useSelector((state) => {
    return state.contractInstances.contractInstances;
  });

  const FACTORY_CONTRACT_ADDRESS = useSelector(
    (state) => state.gnosis.factoryContractAddress,
  );

  const { erc20DaoContractCall, erc721DaoContractCall } = contractInstances;

  const getDaoDetails = async (daoAddress) => {
    const response = await readContractFunction({
      address: FACTORY_CONTRACT_ADDRESS,
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

  const getERC20DAOdetails = async (daoAddress) => {
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

  const getERC721DAOdetails = async (daoAddress) => {
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

  const getTokenGatingDetails = async (daoAddress) => {
    let response = await readContractFunction({
      address: FACTORY_CONTRACT_ADDRESS,
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

  const getDaoBalance = async (daoAddress, is721) => {
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
    return await erc20DaoContractCall?.methods?.totalSupply().call();
  };

  const buyGovernanceTokenERC721DAO = async (
    userAddress,
    daoAddress,
    tokenUriOfNFT,
    numOfTokens,
    merkleProof,
  ) => {
    try {
      const res = await writeContractFunction({
        address: FACTORY_CONTRACT_ADDRESS,
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
    daoAddress,
    numOfTokens,
    merkleProof,
  ) => {
    try {
      const res = await writeContractFunction({
        address: FACTORY_CONTRACT_ADDRESS,
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

  const getNftOwnersCount = async () => {
    return await erc721DaoContractCall?.methods?._tokenIdTracker().call();
  };

  const updateOwnerFee = async (ownerFeePerDeposit, daoAddress) => {
    try {
      const res = await writeContractFunction({
        address: FACTORY_CONTRACT_ADDRESS,
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

  const updateDepositTime = async (depositTime, daoAddress) => {
    try {
      const res = await writeContractFunction({
        address: FACTORY_CONTRACT_ADDRESS,
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
    daoAddress,
  ) => {
    try {
      const res = await writeContractFunction({
        address: FACTORY_CONTRACT_ADDRESS,
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

  const disableTokenGating = async (daoAddress) => {
    try {
      const res = await writeContractFunction({
        address: FACTORY_CONTRACT_ADDRESS,
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
    return await erc20DaoContractCall?.methods
      ?.toggleOnlyAllowWhitelist()
      .encodeABI();
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
        address: FACTORY_CONTRACT_ADDRESS,
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
        address: FACTORY_CONTRACT_ADDRESS,
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
      throw error;
    }
  };

  const updateProposalAndExecution = async (
    data,
    approvalData = "",
    daoAddress = "",
    gnosisAddress = "",
    txHash = "",
    pid,
    tokenData,
    executionStatus,
    airdropContractAddress = "",
    factoryContractAddress = "",
    gnosisTransactionUrl,
    proposalData,
    membersArray,
    airDropAmountArray,
    transactionData = "",
  ) => {
    const { executionId, safeThreshold } = proposalData.commands[0];
    const parameters = data;
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

    const safeSdk = await getSafeSdk(
      Web3.utils.toChecksumAddress(gnosisAddress),
      Web3.utils.toChecksumAddress(walletAddress),
      networkId,
    );

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
      contractInstances,
      parameters,
      isAssetsStoredOnGnosis,
      networkId,
      membersArray,
      airDropAmountArray,
    });
    if (executionStatus !== "executed") {
      if (txHash === "") {
        const nonce = await safeService.getNextNonce(gnosisAddress);
        let safeTransactionData;
        if (approvalTransaction === "" || approvalTransaction === undefined) {
          safeTransactionData = {
            to: transaction.to,
            data: transaction.data,
            value: transaction.value,
            nonce: nonce, // Optional
          };
        } else {
          safeTransactionData = [
            {
              to: approvalTransaction.to,
              data: approvalTransaction.data,
              value: approvalTransaction.value,
              nonce: nonce, // Optional
            },
            {
              to: transaction.to,
              data: transaction.data,
              value: transaction.value,
              nonce: nonce, // Optional
            },
          ];
        }
        let safeTransaction;

        if (executionId === 6 || executionId === 7) {
          if (executionId === 6) {
            safeTransaction = await safeSdk.createAddOwnerTx(transaction);
          } else {
            safeTransaction = await safeSdk.createRemoveOwnerTx(transaction);
          }
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
        const proposalTxHash = await getProposalTxHash(pid);
        const tx = await safeService.getTransaction(
          proposalTxHash.data[0].txHash,
        );
        const nonce = await safeSdk.getNonce();
        let safeTransactionData;

        if (approvalTransaction === "" || approvalTransaction === undefined) {
          safeTransactionData = {
            to: tx.to,
            data: tx.data,
            value: tx.value,
            nonce: tx.nonce, // Optional
          };
        } else {
          safeTransactionData = [
            {
              to: tx.dataDecoded.parameters[0].valueDecoded[0].to,
              data: tx.dataDecoded.parameters[0].valueDecoded[0].data,
              value: tx.dataDecoded.parameters[0].valueDecoded[0].value,
              nonce: tx.nonce, // Optional
            },
            {
              to: tx.dataDecoded.parameters[0].valueDecoded[1].to,
              data: tx.dataDecoded.parameters[0].valueDecoded[1].data,
              value: tx.dataDecoded.parameters[0].valueDecoded[1].value,
              nonce: tx.nonce, // Optional
            },
          ];
        }
        const safeTxHash = tx.safeTxHash;

        let safeTransaction;
        let rejectionTransaction;
        if (executionId === 6 || executionId === 7) {
          if (executionId === 6) {
            safeTransaction = await safeSdk.createAddOwnerTx(transaction);
          } else {
            safeTransaction = await safeSdk.createRemoveOwnerTx(transaction);
          }
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
      const proposalTxHash = await getProposalTxHash(pid);
      const safetx = await safeService.getTransaction(
        proposalTxHash.data[0].txHash,
      );
      const options = {
        gasPrice: await getIncreaseGasPrice(networkId),
      };

      const executeTxResponse = await safeSdk.executeTransaction(
        safetx,
        options,
      );

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