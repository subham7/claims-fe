import Web3 from "web3";
import Web3Adapter from "@safe-global/safe-web3-lib";
import SafeServiceClient from "@safe-global/safe-service-client";
import USDCContract from "../../abis/usdcTokenContract.json";
import Safe, { EthSignSignature } from "@safe-global/safe-core-sdk";
import { USDC_FAUCET_ADDRESS } from "../index";
import { calculateDays, convertToWei } from "../../utils/globalFunctions";
import FactoryContract from "../../abis/factoryContract.json";
import ImplementationContract from "../../abis/implementationABI.json";
import { createProposalTxHash, getProposalTxHash } from "../../api/proposal";

async function syncWallet() {
  // function for validating metamask wallet
  if (window.ethereum) {
    window.web3 = new Web3(window.ethereum);
    await window.ethereum
      .request({ method: "eth_requestAccounts" })
      .then((result) => {
        return true;
      })
      .catch((error) => {
        if (error.code === 4001) {
          // EIP-1193 userRejectedRequest error
          console.log("Please connect to MetaMask.");
          return false;
        } else {
          console.error(error);
          return false;
        }
      });
  } else if (window.web3) {
    window.web3 = new Web3(window.web3.currentProvider);
    return true;
  } else {
    window.alert(
      "Non-Ethereum browser detected. You should consider trying MetaMask!",
    );
    return false;
  }
}

export class SmartContract {
  // Smart contract class
  constructor(
    abiFile,
    contractAddress,
    walletAddress = localStorage.getItem("wallet"),
    usdcContractAddress,
    gnosisTransactionUrl,
  ) {
    if (
      (syncWallet() &&
        abiFile &&
        contractAddress &&
        walletAddress &&
        usdcContractAddress,
        gnosisTransactionUrl)
    ) {
      this.web3 = new Web3(window.web3);
      this.abi = abiFile.abi;
      this.contractAddress = contractAddress;
      this.checkSum = this.web3.utils.toChecksumAddress(this.contractAddress);
      this.contract = new this.web3.eth.Contract(this.abi, this.checkSum);
      this.walletAddress = this.web3.utils.toChecksumAddress(walletAddress);
      this.usdcContractAddress = usdcContractAddress;
      this.gnosisTransactionUrl = gnosisTransactionUrl;
      // this.usdcContractFaucet = usdcFaucetAddress
    }
  }

  // create new club contract function
  async createDAO(
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
    tresuryAddress,
    quoram,
    formThreshold,
    usdcConvertDecimal,
    enableGovernance
  ) {
    const days = Math.round(calculateDays(closeDate));
    console.log([
      tokenName,
      tokenSymbol,
      convertToWei(totalDeposit, usdcConvertDecimal),
      convertToWei(minDeposit, usdcConvertDecimal),
      convertToWei(maxDeposit, usdcConvertDecimal),
      convertToWei(ownerFee, usdcConvertDecimal),
      days,
      convertToWei(feeUSDC, usdcConvertDecimal),
      quoram,
      formThreshold,
      tresuryAddress,
      owners,
      enableGovernance
    ])
    return this.contract.methods
      .createDAO([
        tokenName,
        tokenSymbol,
        convertToWei(totalDeposit, usdcConvertDecimal),
        convertToWei(minDeposit, usdcConvertDecimal),
        convertToWei(maxDeposit, usdcConvertDecimal),
        convertToWei(ownerFee, usdcConvertDecimal),
        days,
        convertToWei(feeUSDC, usdcConvertDecimal),
        quoram,
        formThreshold,
        tresuryAddress,
        owners,
        enableGovernance
      ])
      .send({ from: this.walletAddress });
  }

  async updateProposalAndExecution(
    daoAddress = "",
    gnosisAddress = "",
    proposalHash = "",
    executionStatus = "",
    proposalId = 1,
    customToken = "0x0000000000000000000000000000000000000000",
    airDropToken = "0x0000000000000000000000000000000000000000",
    executionIds = [0, 0, 0, 0, 0, 0, 0, 0],
    quoram = 0,
    threshold = 0,
    totalDeposits = 0,
    airDropAmount = 0,
    mintGTAmounts = [],
    mintGTAddresses = [],
    customTokenAmounts = [],
    customTokenAddresses = [],
    ownersAirdropFees = 0,
    daoAdminAddresses = [],
    txHash = "",
    pid,
  ) {
    const parameters = [
      proposalHash,
      executionStatus,
      proposalId,
      customToken,
      airDropToken,
      executionIds,
      quoram,
      threshold,
      totalDeposits,
      airDropAmount,
      mintGTAmounts,
      mintGTAddresses,
      customTokenAmounts,
      customTokenAddresses,
      ownersAirdropFees,
      daoAdminAddresses,
    ];
    console.log("executionStatus", executionStatus);
    const safeOwner = this.walletAddress;
    const ethAdapter = new Web3Adapter({
      web3: this.web3,
      signerAddress: safeOwner,
    });
    const txServiceUrl = this.gnosisTransactionUrl;
    const safeService = new SafeServiceClient({ txServiceUrl, ethAdapter });

    const web3 = new Web3(window.web3);
    const implementationContract = new web3.eth.Contract(
      ImplementationContract.abi,
      daoAddress,
    );
    console.log(implementationContract);
    const safeSdk = await Safe.create({
      ethAdapter: ethAdapter,
      safeAddress: gnosisAddress,
    });

    const transaction = {
      to: daoAddress,
      data: implementationContract.methods
        .updateProposalAndExecution(parameters)
        .encodeABI(),
      value: "0",
    };
    console.log("transactionnnnn", transaction);
    // let safeTransaction2;
    const nonce = await safeService.getNextNonce(gnosisAddress);
    console.log("nonce", nonce);

    const safeTransactionData = {
      to: transaction.to,
      data: transaction.data,
      value: transaction.value,
      // operation, // Optional
      // safeTxGas, // Optional
      // baseGas, // Optional
      // gasPrice, // Optional
      // gasToken, // Optional
      // refundReceiver, // Optional
      nonce: nonce, // Optional
    };

    console.log("safeTransactionData", safeTransactionData);

    const safeTransaction = await safeSdk.createTransaction({
      safeTransactionData,
    });

    console.log("safeTransaction", safeTransaction);

    // const safeTransaction = await safeSdk.createTransaction(transaction);
    console.log("execution Status", executionStatus);

    if (executionStatus !== "executed") {
      if (txHash === "") {
        const safeTxHash = await safeSdk.getTransactionHash(safeTransaction);
        const payload = {
          proposalId: pid,
          txHash: safeTxHash,
        };
        console.log("payload", payload);
        await createProposalTxHash(payload);

        const proposeTxn = await safeService.proposeTransaction({
          safeAddress: gnosisAddress,
          safeTransactionData: safeTransaction.data,
          safeTxHash: safeTxHash,
          senderAddress: this.walletAddress,
        });
        console.log("proposeTxn", proposeTxn);
        const senderSignature = await safeSdk.signTransactionHash(safeTxHash);
        await safeService.confirmTransaction(safeTxHash, senderSignature.data);
        console.log("proposeTxn in ifffff", proposeTxn);
        return proposeTxn;
        // const txResponse = await safeSdk.approveTransactionHash(txHash);
        // await txResponse.transactionResponse?.wait();
        // console.log("txResponse", txResponse);
      } else {
        const proposalTxHash = await getProposalTxHash(pid);
        console.log("proposalTxHash", proposalTxHash);
        console.log("TXHASH", proposalTxHash.data[0].txHash);

        const tx = await safeService.getTransaction(
          proposalTxHash.data[0].txHash,
        );
        const nonce = await safeSdk.getNonce();
        console.log("nonce", nonce);
        const safeTxHash = tx.safeTxHash;

        const senderSignature = await safeSdk.signTransactionHash(safeTxHash);
        await safeService.confirmTransaction(safeTxHash, senderSignature.data);
        // const proposeTxn = await safeService.proposeTransaction({
        //   safeAddress: gnosisAddress,
        //   safeTransactionData: safeTransaction.data,
        //   safeTxHash: proposalTxHash.data[0].txHash,
        //   senderAddress: this.walletAddress,
        //   senderSignature: senderSignature.data,
        // })
        console.log("senderSignature", senderSignature);
        // console.log("proposeTxn in elseeee", proposeTxn)

        return tx;

        // const safeTransactionData = {
        //   to: tx.to,
        //   value: tx.value,
        //   operation: tx.operation,
        //   safeTxGas: tx.safeTxGas,
        //   baseGas: tx.baseGas,
        //   gasPrice: tx.gasPrice,
        //   gasToken: tx.gasToken,
        //   refundReceiver: tx.refundReceiver,
        //   nonce: tx.nonce,
        //   data: tx.data,
        // };

        // safeTransaction2 = await safeSdk.createTransaction(safeTransactionData);
        // console.log("safeTransaction2", safeTransaction2);

        // for (let i = 0; i < tx.confirmations.length; i++) {
        //   const signature = new EthSignSignature(
        //     tx.confirmations[i].owner,
        //     tx.confirmations[i].signature
        //   );
        //   console.log("signatureee", signature);
        //   safeTransaction2.addSignature(signature);
        // }

        // const txResponse = await safeSdk.approveTransactionHash(txHash);
        // await txResponse.transactionResponse?.wait();
      }
    } else {
      const proposalTxHash = await getProposalTxHash(pid);
      console.log("proposalTxHash", proposalTxHash);
      console.log("TXHASH", proposalTxHash.data[0].txHash);

      const safetx = await safeService.getTransaction(
        proposalTxHash.data[0].txHash,
      );
      console.log("safetx", safetx);
      // let safetx2;
      // try {
      //   safetx2 = await safeSdk.createTransaction(safetx);
      //   console.log("safetx2", safetx2);
      // } catch (error) {
      //   console.log(error);
      // }

      // safetx.confirmations.forEach((confirmation) => {
      //   const sign = new EthSignSignature(
      //     confirmation.owner,
      //     confirmation.signature,
      //   );
      //   safetx2.addSignature(sign);
      // });
      // console.log(safetx2);
      const executeTxResponse = await safeSdk.executeTransaction(safetx);

      console.log("executeTxResponse", executeTxResponse);
      const receipt =
        executeTxResponse.transactionResponse &&
        (await executeTxResponse.transactionResponse.wait());
      return executeTxResponse;
    }
  }

  // Deprecated
  async approveAndDeposit(amount, gnosisAddress) {
    // method for depositing tokens to a club
    const safeOwner = this.walletAddress;
    const ethAdapter = new Web3Adapter({
      web3: this.web3,
      signerAddress: safeOwner,
    });
    const txServiceUrl = this.gnosisTransactionUrl;
    const safeService = new SafeServiceClient({ txServiceUrl, ethAdapter });
    const web3 = new Web3(window.web3);
    const usdcContract = new web3.eth.Contract(
      ImplementationContract.abi,
      this.usdcContractAddress,
    );
    const safeSdk = await Safe.create({
      ethAdapter: ethAdapter,
      safeAddress: gnosisAddress,
    });
    const transaction = {
      to: this.usdcContractAddress,
      data: usdcContract.methods
        .deposit(this.usdcContractAddress, amount)
        .encodeABI(),
      value: "0",
    };
    const safeTransaction = await safeSdk.createTransaction(transaction);
    const safeTxHash = await safeSdk.getTransactionHash(safeTransaction);
    const senderSignature = await safeSdk.signTransactionHash(safeTxHash);

    await safeService.proposeTransaction({
      safeAddress: gnosisAddress,
      safeTransactionData: safeTransaction.data,
      safeTxHash: safeTxHash,
      senderAddress: this.walletAddress,
      senderSignature: senderSignature.data,
    });
    const executeTxResponse = await safeSdk.executeTransaction(safeTransaction);
    const receipt =
      executeTxResponse.transactionResponse &&
      (await executeTxResponse.transactionResponse.wait());
    return receipt;
  }

  // Deprecated
  async approveSendCustomToken(address, amount, daoAddress, gnosisAddress) {
    // method for sending custom token
    const safeOwner = this.walletAddress;
    const ethAdapter = new Web3Adapter({
      web3: this.web3,
      signerAddress: safeOwner,
    });
    const txServiceUrl = this.gnosisTransactionUrl;
    const safeService = new SafeServiceClient({ txServiceUrl, ethAdapter });
    const web3 = new Web3(window.web3);

    const usdcContract = new web3.eth.Contract(
      USDCContract.abi,
      this.usdcContractAddress,
    );
    const usdcContractFaucet = new web3.eth.Contract(
      USDCContract.abi,
      USDC_FAUCET_ADDRESS,
    );

    const safeSdk = await Safe.create({
      ethAdapter: ethAdapter,
      safeAddress: gnosisAddress,
    });
    const transaction = {
      to: this.usdcContractAddress,
      data: usdcContract.methods.transfer(address[0], amount[0]).encodeABI(),
      value: "0",
    };
    const safeTransaction = await safeSdk.createTransaction(transaction);
    await safeSdk.signTransaction(safeTransaction);
    const safeTxHash = await safeSdk.getTransactionHash(safeTransaction);
    const senderSignature = await safeSdk.signTransactionHash(safeTxHash);

    await safeService.proposeTransaction({
      safeAddress: gnosisAddress,
      safeTransactionData: safeTransaction.data,
      safeTxHash: safeTxHash,
      senderAddress: this.walletAddress,
      senderSignature: senderSignature.data,
    });
    const tx = await safeService.getTransaction(safeTxHash);
    const safeTransactionData = {
      to: tx.to,
      value: tx.value,
      operation: tx.operation,
      safeTxGas: tx.safeTxGas,
      baseGas: tx.baseGas,
      gasPrice: tx.gasPrice,
      gasToken: tx.gasToken,
      refundReceiver: tx.refundReceiver,
      nonce: tx.nonce,
      data: tx.data,
    };
    const safeTransaction2 = await safeSdk.createTransaction(
      safeTransactionData,
    );
    for (let i = 0; i < tx.confirmations.length; i++) {
      const signature = new EthSignSignature(
        tx.confirmations[i].owner,
        tx.confirmations[i].signature,
      );
      safeTransaction2.addSignature(signature);
    }

    const executeTxResponse = await safeSdk.executeTransaction(
      safeTransaction2,
    );

    const receipt =
      executeTxResponse.transactionResponse &&
      (await executeTxResponse.transactionResponse.wait());
    return executeTxResponse;
  }

  async approveDeposit(address, amount, usdcConvertDecimal) {
    const value = convertToWei(amount, usdcConvertDecimal);
    return this.contract.methods
      .approve(address, value)
      .send({ from: this.walletAddress });
  }

  async performanceFee() {
    return await this.contract.methods
      .ownerFeePerDeposit()
      .call({ from: this.walletAddress });
  }

  async mint(address, amount) {
    return this.contract.methods
      .mint(address, amount)
      .send({ from: this.walletAddress });
  }

  async closeDeposit() {
    return this.contract.methods
      .closeDeposit()
      .send({ from: this.walletAddress });
  }

  async startDeposit(startTime) {
    return this.contract.methods
      .startDeposit(startTime)
      .send({ from: this.walletAddress });
  }

  async deposit(address, amount) {
    return this.contract.methods
      .deposit(address, amount)
      .send({ from: this.walletAddress });
  }

  async balanceOf() {
    return this.contract.methods
      .balanceOf(this.walletAddress)
      .call({ from: this.walletAddress });
  }

  async checkUserBalance() {
    return this.contract.methods
      .checkUserBalance(this.walletAddress)
      .call({ from: this.walletAddress });
  }

  async ownerAddress() {
    return this.contract.methods
      .ownerAddress()
      .call({ from: this.walletAddress });
  }

  async totalDeposit() {
    return this.contract.methods
      .totalDeposit()
      .call({ from: this.walletAddress });
  }

  async minDeposit() {
    return this.contract.methods
      .minDeposit()
      .call({ from: this.walletAddress });
  }

  async maxDeposit() {
    return this.contract.methods
      .maxDeposit()
      .call({ from: this.walletAddress });
  }

  async updateMinMaxDeposit(minValue, maxValue) {
    return this.contract.methods
      .updateMinMaxDeposit(minValue, maxValue)
      .send({ from: this.walletAddress });
  }

  async updateOwnerFee(performanceFee) {
    return this.contract.methods
      .updateOwnerFee(performanceFee)
      .send({ from: this.walletAddress });
  }

  async userDetails() {
    return this.contract.methods
      .userDetails(this.walletAddress)
      .call({ from: this.walletAddress });
  }

  async closeDate() {
    return this.contract.methods.closeDate().call({ from: this.walletAddress });
  }

  async ownerFee() {
    return this.contract.methods.ownerFee().call({ from: this.walletAddress });
  }

  async daoAmount() {
    return this.contract.methods.daoAmount().call({ from: this.walletAddress });
  }

  async quoram() {
    return this.contract.methods.quorum().call({ from: this.walletAddress });
  }

  async threshold() {
    return this.contract.methods.threshold().call({ from: this.walletAddress });
  }

  async depositClosed() {
    return this.contract.methods
      .depositClosed()
      .call({ from: this.walletAddress });
  }

  async tresuryAddress() {
    return this.contract.methods
      .tresuryAddress()
      .call({ from: this.walletAddress });
  }

  async tokenAddress() {
    return this.contract.methods
      .tokenAddress()
      .call({ from: this.walletAddress });
  }

  async balance(governanceToken) {
    return this.contract.methods
      .balance(governanceToken)
      .call({ from: this.walletAddress });
  }

  async tokenDetails() {
    return this.contract.methods
      .tokenDetails()
      .call({ from: this.walletAddress });
  }

  async getGovernorDetails() {
    return this.contract.methods
      .getGovernorDetails()
      .call({ from: this.walletAddress });
  }

  async obtainTokenDecimals() {
    return this.contract.methods.decimals().call({ from: this.walletAddress });
  }

  async getUsdcDetails(address) {
    return this.contract.methods.getUsdcDetails(address).call();
  }

  async setupTokenGating(
    addresses,
    tokenAmounts,
    tokenOperations,
    isTokenNFTList,
  ) {
    console.log(addresses, tokenAmounts, tokenOperations, isTokenNFTList);
    return this.contract.methods
      .setupTokenGating(
        addresses,
        tokenAmounts,
        tokenOperations,
        isTokenNFTList,
      )
      .send({ from: this.walletAddress });
  }
}
