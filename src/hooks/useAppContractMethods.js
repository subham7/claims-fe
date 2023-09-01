import { useSelector } from "react-redux";
import Web3 from "web3";
import { getIncreaseGasPrice, writeContractFunction } from "utils/helper";
import { erc20TokenABI } from "abis/usdcTokenContract.js";
import Safe, { Web3Adapter } from "@safe-global/protocol-kit";
import { createProposalTxHash, getProposalTxHash } from "../api/proposal";
import SafeApiKit from "@safe-global/api-kit";
import { actionContractABI } from "abis/actionContract";
import { useAccount, useNetwork } from "wagmi";
import { factoryContractABI } from "abis/factoryContract.js";
import { CHAIN_CONFIG } from "utils/constants";
import { getTransaction } from "utils/proposal";

const useAppContractMethods = () => {
  const { address: walletAddress } = useAccount();

  const { chain } = useNetwork();
  const networkId = "0x" + chain?.id.toString(16);
  const web3Call = new Web3(CHAIN_CONFIG[networkId]?.appRpcUrl);

  const isAssetsStoredOnGnosis = useSelector((state) => {
    return state.club.factoryData.assetsStoredOnGnosis;
  });

  const contractInstances = useSelector((state) => {
    return state.contractInstances.contractInstances;
  });

  const FACTORY_CONTRACT_ADDRESS = useSelector(
    (state) => state.gnosis.factoryContractAddress,
  );

  const { factoryContractCall, erc20DaoContractCall, erc721DaoContractCall } =
    contractInstances;

  const getDaoDetails = async (daoAddress) => {
    return await factoryContractCall?.methods?.getDAOdetails(daoAddress).call();
  };

  const getERC20DAOdetails = async () => {
    return await erc20DaoContractCall?.methods?.getERC20DAOdetails().call();
  };

  const getERC721DAOdetails = async () => {
    return await erc721DaoContractCall?.methods?.getERC721DAOdetails().call();
  };

  const getERC20Balance = async () => {
    return await erc20DaoContractCall?.methods?.balanceOf(walletAddress).call();
  };

  const getERC721Balance = async () => {
    return await erc721DaoContractCall?.methods
      ?.balanceOf(walletAddress)
      .call();
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

  const getTokenGatingDetails = async (daoAddress) => {
    return await factoryContractCall?.methods
      ?.getTokenGatingDetails(daoAddress)
      .call();
  };

  const approveDepositWithEncodeABI = (
    contractAddress,
    approvalContract,
    amount,
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

  const toggleWhitelist = async () => {
    return await erc20DaoContractCall?.methods
      ?.toggleOnlyAllowWhitelist()
      .encodeABI();
  };

  const airdropTokenMethodEncoded = (
    actionContractAddress,
    airdropTokenAddress,
    amountArray,
    members,
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

  const getNftBalance = async (tokenType, contractAddress) => {
    return tokenType === "erc721"
      ? await erc721DaoContractCall.methods.balanceOf(contractAddress).call()
      : await erc20DaoContractCall.methods.balanceOf(contractAddress).call();
  };

  const createERC721DAO = async ({
    clubName,
    clubSymbol,
    tokenUri,
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
          tokenUri,
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
    executionId,
    ownerAddress,
    safeThreshold,
    proposalData,
    membersArray,
    airDropAmountArray,
    transactionData = "",
  ) => {
    console.log("DATA", data);
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

    const safeSdk = await Safe.create({
      ethAdapter: ethAdapter,
      safeAddress: Web3.utils.toChecksumAddress(gnosisAddress),
    });

    const { transaction, approvalTransaction } = await getTransaction(
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
    );

    // let approvalTransaction;
    // let transaction;
    // if (approvalData !== "") {
    //   if (
    //     proposalData.commands[0].executionId === 10 ||
    //     proposalData.commands[0].executionId === 11 ||
    //     proposalData?.commands[0].executionId == 12
    //   ) {
    //     approvalTransaction = {
    //       to: Web3.utils.toChecksumAddress(daoAddress),
    //       data: erc20DaoContractCall.methods
    //         .updateProposalAndExecution(
    //           //usdc address
    //           daoAddress,
    //           approvalData,
    //         )
    //         .encodeABI(),
    //       value: "0",
    //     };
    //     transaction = {
    //       //dao
    //       to: Web3.utils.toChecksumAddress(daoAddress),
    //       data: erc20DaoContractCall.methods
    //         .updateProposalAndExecution(
    //           //factory
    //           factoryContractAddress ? factoryContractAddress : daoAddress,
    //           parameters,
    //         )
    //         .encodeABI(),
    //       value: "0",
    //     };
    //   } else {
    //     if (isAssetsStoredOnGnosis) {
    //       approvalTransaction = {
    //         to: Web3.utils.toChecksumAddress(tokenData),
    //         // data: tokenData.methods.approve(dao / action).encodeABI(), // for send/airdrop -> action & send NFT -> daoAddress
    //         data: approveDepositWithEncodeABI(
    //           tokenData,
    //           airdropContractAddress,
    //           proposalData.commands[0].executionId === 0
    //             ? proposalData.commands[0].airDropAmount
    //             : proposalData.commands[0].customTokenAmounts[0],
    //         ),
    //         value: "0",
    //       };
    //     } else {
    //       approvalTransaction = {
    //         to: Web3.utils.toChecksumAddress(daoAddress),
    //         data: erc20DaoContractCall.methods
    //           .updateProposalAndExecution(
    //             //usdc address
    //             tokenData,
    //             approvalData,
    //           )
    //           .encodeABI(),
    //         value: "0",
    //       };
    //     }

    //     if (isAssetsStoredOnGnosis) {
    //       transaction = {
    //         to: Web3.utils.toChecksumAddress(airdropContractAddress),
    //         data: airdropTokenMethodEncoded(
    //           airdropContractAddress,
    //           tokenData,
    //           airDropAmountArray,
    //           membersArray,
    //         ),
    //         value: 0,
    //       };
    //     } else {
    //       transaction = {
    //         to: Web3.utils.toChecksumAddress(daoAddress),
    //         data: erc20DaoContractCall.methods
    //           .updateProposalAndExecution(
    //             //airdrop address
    //             airdropContractAddress,
    //             parameters,
    //           )
    //           .encodeABI(),
    //         value: "0",
    //       };
    //     }
    //   }
    // } else if (executionId === 6 || executionId === 7) {
    //   if (executionId === 6) {
    //     transaction = {
    //       ownerAddress,
    //     };
    //   } else {
    //     transaction = {
    //       ownerAddress,
    //       threshold: safeThreshold,
    //     };
    //   }
    // } else {
    //   if (
    //     isAssetsStoredOnGnosis &&
    //     proposalData.commands[0].executionId === 5
    //   ) {
    //     transaction = {
    //       //dao
    //       to: Web3.utils.toChecksumAddress(tokenData),
    //       data: transferNFTfromSafe(
    //         tokenData,
    //         gnosisAddress,
    //         proposalData.commands[0].customTokenAddresses[0],
    //         proposalData.commands[0].customNftToken,
    //       ),
    //       value: "0",
    //     };
    //   } else if (transactionData) {
    //     if (isAssetsStoredOnGnosis) {
    //       const seaportContract = new web3Call.eth.Contract(
    //         seaportABI,
    //         SEAPORT_CONTRACT_ADDRESS,
    //       );
    //       transaction = {
    //         to: Web3.utils.toChecksumAddress(SEAPORT_CONTRACT_ADDRESS),
    //         data: seaportContract.methods
    //           .fulfillBasicOrder_efficient_6GL6yc(
    //             transactionData.fulfillment_data.transaction.input_data
    //               .parameters,
    //           )
    //           .encodeABI(),
    //         value:
    //           transactionData.fulfillment_data.transaction.value.toString(),
    //       };
    //     } else {
    //       transaction = {
    //         to: Web3.utils.toChecksumAddress(daoAddress),
    //         data: erc20DaoContractCall.methods
    //           .updateProposalAndExecution(
    //             Web3.utils.toChecksumAddress(SEAPORT_CONTRACT_ADDRESS),
    //             parameters,
    //           )
    //           .encodeABI(),
    //         value: "10000000000000000",
    //       };
    //     }
    //   } else {
    //     transaction = {
    //       //dao
    //       to: Web3.utils.toChecksumAddress(daoAddress),
    //       data: erc20DaoContractCall.methods
    //         .updateProposalAndExecution(
    //           //factory
    //           factoryContractAddress ? factoryContractAddress : daoAddress,
    //           parameters,
    //         )
    //         .encodeABI(),
    //       value: "0",
    //     };
    //   }
    // }
    if (executionStatus !== "executed") {
      if (txHash === "") {
        const nonce = await safeService.getNextNonce(gnosisAddress);
        let safeTransactionData;
        if (approvalData === "") {
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

        if (approvalData === "") {
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
    getERC20Balance,
    getERC721Balance,
    getNftBalance,
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
