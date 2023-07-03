import { useConnectWallet } from "@web3-onboard/react";
import { useSelector } from "react-redux";
import Web3 from "web3";
import { POLYGON_MAINNET_RPC_URL, RPC_URL } from "../api";
import { getIncreaseGasPrice } from "../utils/helper";
import ERC20TokenABI from "../abis/usdcTokenContract.json";
import ERC721TokenABI from "../abis/nft.json";
import ClaimContractABI from "../abis/singleClaimContract.json";
import { convertToWeiGovernance } from "../utils/globalFunctions";
import Safe, { Web3Adapter } from "@safe-global/protocol-kit";
import { createProposalTxHash, getProposalTxHash } from "../api/proposal";
import SafeApiKit from "@safe-global/api-kit";
import { actionContractABI } from "../abis/newArch/actionContract";

const useSmartContractMethods = () => {
  const [{ wallet }] = useConnectWallet();
  const walletAddress = wallet?.accounts[0]?.address;
  const web3Call = new Web3(RPC_URL ? RPC_URL : POLYGON_MAINNET_RPC_URL);

  const isAssetsStoredOnGnosis = useSelector((state) => {
    return state.club.factoryData.assetsStoredOnGnosis;
  });

  let web3Send;
  if (typeof window !== "undefined") {
    web3Send = new Web3(window.ethereum);
  }

  const contractInstances = useSelector((state) => {
    return state.contractInstances.contractInstances;
  });

  const {
    factoryContractCall,
    factoryContractSend,
    erc20DaoContractCall,
    erc20DaoContractSend,
    erc721DaoContractCall,
    claimContractCall,
    claimContractSend,
    claimFactoryContractCall,
    claimFactoryContractSend,
  } = contractInstances;

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
    return await factoryContractSend?.methods
      .buyGovernanceTokenERC721DAO(
        userAddress,
        daoAddress,
        tokenUriOfNFT,
        numOfTokens,
        merkleProof,
      )
      .send({
        from: walletAddress,
        gasPrice: await getIncreaseGasPrice(),
      });
  };

  const buyGovernanceTokenERC20DAO = async (
    userAddress,
    daoAddress,
    numOfTokens,
    merkleProof,
  ) => {
    return await factoryContractSend?.methods
      ?.buyGovernanceTokenERC20DAO(
        userAddress,
        daoAddress,
        numOfTokens,
        merkleProof,
      )
      .send({
        from: walletAddress,
        gasPrice: await getIncreaseGasPrice(),
      });
  };

  const getNftOwnersCount = async () => {
    return await erc721DaoContractCall?.methods?._tokenIdTracker().call();
  };

  const updateOwnerFee = async (ownerFeePerDeposit, daoAddress) => {
    return await factoryContractSend.methods
      .updateOwnerFee(ownerFeePerDeposit, daoAddress)
      .send({
        from: walletAddress,
        gasPrice: await getIncreaseGasPrice(),
      });
  };

  const updateDepositTime = async (depositTime, daoAddress) => {
    return await factoryContractSend.methods
      .updateDepositTime(depositTime, daoAddress)
      .send({
        from: walletAddress,
        gasPrice: await getIncreaseGasPrice(),
      });
  };

  const setupTokenGating = async (
    tokenA,
    tokenB,
    operator,
    comparator,
    value,
    daoAddress,
  ) => {
    return await factoryContractSend?.methods
      ?.setupTokenGating(
        tokenA,
        tokenB,
        operator,
        comparator,
        value,
        daoAddress,
      )
      .send({
        from: walletAddress,
        gasPrice: await getIncreaseGasPrice(),
      });
  };

  const disableTokenGating = async (daoAddress) => {
    return await factoryContractSend?.methods
      ?.disableTokenGating(daoAddress)
      .send({
        from: walletAddress,
        gasPrice: await getIncreaseGasPrice(),
      });
  };

  const getTokenGatingDetails = async (daoAddress) => {
    return await factoryContractCall?.methods
      ?.getTokenGatingDetails(daoAddress)
      .call();
  };

  const getDecimals = async (contractAddress) => {
    if (contractAddress) {
      const erc20TokenContractCall = new web3Call.eth.Contract(
        ERC20TokenABI.abi,
        contractAddress,
      );
      return await erc20TokenContractCall.methods.decimals().call();
    }
  };

  const getERC721Symbol = async (contractAddress) => {
    if (contractAddress) {
      const erc721TokenContractCall = new web3Call.eth.Contract(
        ERC721TokenABI.abi,
        contractAddress,
      );
      return await erc721TokenContractCall?.methods?.symbol().call();
    }
  };

  const getBalance = async (contractAddress) => {
    if (contractAddress) {
      const erc20TokenContractCall = new web3Call.eth.Contract(
        ERC20TokenABI.abi,
        contractAddress,
      );
      return await erc20TokenContractCall?.methods
        ?.balanceOf(walletAddress)
        .call();
    }
  };

  const getTokenSymbol = async (contractAddress) => {
    if (contractAddress) {
      const erc20TokenContractCall = new web3Call.eth.Contract(
        ERC20TokenABI.abi,
        contractAddress,
      );
      return await erc20TokenContractCall?.methods?.symbol().call();
    }
  };

  const getTokenName = async (contractAddress) => {
    if (contractAddress) {
      const erc20TokenContractCall = new web3Call.eth.Contract(
        ERC20TokenABI.abi,
        contractAddress,
      );
      return await erc20TokenContractCall?.methods?.name().call();
    }
  };

  const approveDeposit = async (
    contractAddress,
    approvalContract,
    amount,
    usdcConvertDecimal,
  ) => {
    if (contractAddress) {
      const erc20TokenContractSend = new web3Send.eth.Contract(
        ERC20TokenABI.abi,
        contractAddress,
      );
      const value = convertToWeiGovernance(
        amount,
        usdcConvertDecimal,
      )?.toString();
      return await erc20TokenContractSend?.methods
        ?.approve(approvalContract, value)
        .send({
          from: walletAddress,
          gasPrice: await getIncreaseGasPrice(),
        });
    }
  };

  const approveDepositWithEncodeABI = (
    contractAddress,
    approvalContract,
    amount,
  ) => {
    if (contractAddress) {
      const erc20TokenContractSend = new web3Send.eth.Contract(
        ERC20TokenABI.abi,
        contractAddress,
      );

      return erc20TokenContractSend?.methods
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
      const erc20TokenContractSend = new web3Send.eth.Contract(
        ERC20TokenABI.abi,
        tokenAddress,
      );

      return erc20TokenContractSend?.methods
        ?.transferFrom(gnosisAddress, receiverAddress, tokenId)
        .encodeABI();
    }
  };

  const airdropTokenMethodEncoded = (
    actionContractAddress,
    airdropTokenAddress,
    amountArray,
    members,
  ) => {
    if (actionContractAddress) {
      const actionContractSend = new web3Send.eth.Contract(
        actionContractABI,
        actionContractAddress,
      );

      return actionContractSend.methods
        .airDropToken(airdropTokenAddress, amountArray, members)
        .encodeABI();
    }
  };

  const claimContract = async (claimSettings) => {
    return await claimFactoryContractSend?.methods
      ?.deployClaimContract(claimSettings)
      .send({
        from: walletAddress,
        gasPrice: await getIncreaseGasPrice(),
      });
  };

  const claimSettings = async () => {
    return await claimContractCall?.methods?.claimSettings().call();
  };

  const claimBalance = async () => {
    return await claimContractCall?.methods.claimBalance().call();
  };

  const toggleClaim = async () => {
    return await claimContractSend?.methods.toggleClaim().send({
      from: walletAddress,
      gasPrice: await getIncreaseGasPrice(),
    });
  };

  const rollbackTokens = async (amount) => {
    return await claimContractSend?.methods.rollbackTokens(amount).send({
      from: walletAddress,
      gasPrice: await getIncreaseGasPrice(),
    });
  };

  const claim = async (amount, merkleData, leaf) => {
    return await claimContractSend.methods
      .claim(amount, merkleData, leaf)
      .send({
        from: walletAddress,
        gasPrice: await getIncreaseGasPrice(),
      });
  };

  const hasClaimed = async (walletAddress) => {
    return await claimContractCall?.methods.hasClaimed(walletAddress).call();
  };

  const claimAmount = async (walletAddress) => {
    return await claimContractCall?.methods.claimAmount(walletAddress).call();
  };

  const checkAmount = async (walletAddress) => {
    return await claimContractCall?.methods.checkAmount(walletAddress).call();
  };

  const getNftBalance = async (tokenType, contractAddress) => {
    return tokenType === "erc721"
      ? await erc721DaoContractCall.methods.balanceOf(contractAddress).call()
      : await erc20DaoContractCall.methods.balanceOf(contractAddress).call();
  };

  const encode = async (address, amount) => {
    const claimContract = new web3Call.eth.Contract(
      ClaimContractABI.abi,
      "0xE25f57C5Ec956757D19169563E0caB6e7670E2EB",
    );
    return await claimContract.methods.encode(address, amount).call();
  };

  const createERC721DAO = async (
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
  ) => {
    return await factoryContractSend.methods
      .createERC721DAO(
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
      )
      .send({
        from: walletAddress,
        gasPrice: await getIncreaseGasPrice(),
      });
  };

  const createERC20DAO = async (
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
  ) => {
    return await factoryContractSend.methods
      .createERC20DAO(
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
      )
      .send({
        from: walletAddress,
        gasPrice: await getIncreaseGasPrice(),
      });
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
  ) => {
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

    const nonce = await safeSdk.getNonce();

    let approvalTransaction;
    let transaction;
    if (approvalData !== "") {
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
      } else {
        approvalTransaction = {
          to: Web3.utils.toChecksumAddress(daoAddress),
          data: erc20DaoContractSend.methods
            .updateProposalAndExecution(
              //usdc address
              tokenData,
              approvalData,
            )
            .encodeABI(),
          value: "0",
        };
      }

      if (isAssetsStoredOnGnosis) {
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
        transaction = {
          to: Web3.utils.toChecksumAddress(daoAddress),
          data: erc20DaoContractSend.methods
            .updateProposalAndExecution(
              //airdrop address
              airdropContractAddress,
              parameters,
            )
            .encodeABI(),
          value: "0",
        };
      }
    } else if (executionId === 6 || executionId === 7) {
      if (executionId === 6) {
        transaction = {
          ownerAddress,
        };
      } else {
        transaction = {
          ownerAddress,
          threshold: safeThreshold,
        };
      }
    } else {
      if (
        isAssetsStoredOnGnosis &&
        proposalData.commands[0].executionId === 5
      ) {
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
      } else {
        transaction = {
          //dao
          to: Web3.utils.toChecksumAddress(daoAddress),
          data: erc20DaoContractSend.methods
            .updateProposalAndExecution(
              //factory
              factoryContractAddress ? factoryContractAddress : daoAddress,
              parameters,
            )
            .encodeABI(),
          value: "0",
        };
      }
    }
    if (executionStatus !== "executed") {
      //case for 1st signature
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

        // const senderSignature = await safeSdk.signTypedData(tx, "v4");
        const senderSignature = await safeSdk.signTypedData(
          safeTransaction,
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
        maxPriorityFeePerGas: null,
        maxFeePerGas: null,
      };

      const executeTxResponse = await safeSdk.executeTransaction(
        safetx,
        // options,
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
    getDecimals,
    getDaoDetails,
    getERC20DAOdetails,
    getERC721DAOdetails,
    getERC20Balance,
    getERC721Balance,
    getERC721Symbol,
    getNftBalance,
    getNftOwnersCount,
    getERC20TotalSupply,
    getBalance,
    getTokenSymbol,
    getTokenName,
    approveDeposit,
    updateOwnerFee,
    updateDepositTime,
    setupTokenGating,
    disableTokenGating,
    getTokenGatingDetails,
    claimAmount,
    claim,
    checkAmount,
    encode,
    hasClaimed,
    rollbackTokens,
    toggleClaim,
    claimBalance,
    claimSettings,
    claimContract,
    updateProposalAndExecution,
  };
};

export default useSmartContractMethods;