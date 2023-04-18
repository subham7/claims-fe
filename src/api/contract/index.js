import Safe, { EthSignSignature } from "@safe-global/safe-core-sdk";
import SafeServiceClient from "@safe-global/safe-service-client";
import Web3Adapter from "@safe-global/safe-web3-lib";
import Web3 from "web3";

import FactoryContract from "../../abis/factoryContract.json";
import ImplementationContract from "../../abis/implementationABI.json";
import USDCContract from "../../abis/usdcTokenContract.json";
import { createProposalTxHash, getProposalTxHash } from "../../api/proposal";
import { calculateDays, convertToWei } from "../../utils/globalFunctions";
import { USDC_FAUCET_ADDRESS } from "../index";

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

    if (syncWallet() && abiFile && contractAddress && walletAddress) {
      this.web3 = new Web3(window.web3);
      this.abi = abiFile.abi;
      this.contractAddress = contractAddress;
      this.checkSum = this.web3.utils.toChecksumAddress(this.contractAddress);
      this.contract = new this.web3.eth.Contract(this.abi, this.checkSum);
      this.walletAddress = this.web3.utils.toChecksumAddress(walletAddress);
    }
  }

  async claimContract(claimSettings) {
    return this.contract.methods
      .deployClaimContract(claimSettings)
      .send({ from: this.walletAddress });
  }

  async claimSettings() {
    return this.contract.methods.claimSettings().call();
  }

  async claimBalance() {
    return this.contract.methods.claimBalance().call();
  }

  async claim(amount, merkleData, leaf) {
    console.log(amount);
    return this.contract.methods.claim(amount, merkleData, leaf).send({
      from: this.walletAddress,
    });
  }

  async name() {
    return this.contract.methods.name().call({
      from: this.walletAddress,
    });
  }

  async hasClaimed(walletAddress) {
    return this.contract.methods.hasClaimed(walletAddress).call();
  }

  async claimAmount(walletAddress) {
    return this.contract.methods.claimAmount(walletAddress).call();
  }

  async checkAmount(walletAddress) {
    return this.contract.methods.checkAmount(walletAddress).call({
      from: this.walletAddress,
    });
  }

  async encode(address, amount) {
    return this.contract.methods.encode(address, amount).call({
      from: this.walletAddress,
    });
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
    enableGovernance,
    isTemplateErc721,
    mintsPerUser,
    totalSupplyOfToken,
    nftPrice,
    transferableMembership,
    isNftSupplyUnlimited,
  ) {
    const days = Math.round(calculateDays(closeDate));
    // const gasPrice = await web3.eth.getGasPrice();
    // const gasAmount = this.contract.methods
    //   .createDaoERC721(
    //     tokenName,
    //     tokenSymbol,
    //     convertToWei(ownerFee, usdcConvertDecimal),
    //     days,
    //     quoram,
    //     formThreshold,
    //     tresuryAddress,
    //     owners,
    //     mintsPerUser,
    //     totalSupplyOfToken,
    //     nftPrice * Math.pow(10, 6),
    //     transferableMembership,
    //     isNftSupplyUnlimited,
    //     enableGovernance,
    //   )
    //   .estimateGas({ from: this.walletAddress });
    // const gas = gasAmount * gasPrice;
    // console.log(gasPrice, gas);

    if (isTemplateErc721) {
      return this.contract.methods
        .createDaoERC721(
          tokenName,
          tokenSymbol,
          convertToWei(ownerFee, usdcConvertDecimal),
          days,
          quoram,
          formThreshold,
          tresuryAddress,
          owners,
          mintsPerUser,
          totalSupplyOfToken,
          nftPrice * Math.pow(10, 6),
          transferableMembership,
          isNftSupplyUnlimited,
          enableGovernance,
        )
        .send({ from: this.walletAddress });
    } else
      return this.contract.methods
        .createDAO(
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
          enableGovernance,
        )
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
    tokenData,
    nftDetails,
    contractCallDetails,
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
      nftDetails,
      contractCallDetails,
    ];
    console.log(parameters);
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

    const safeSdk = await Safe.create({
      ethAdapter: ethAdapter,
      safeAddress: gnosisAddress,
    });
    console.log("here");

    const transaction = {
      to: daoAddress,
      data: implementationContract.methods
        .updateProposalAndExecution(parameters)
        .encodeABI(),
      value: "0",
    };
    console.log("transaction", transaction);

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
    const safeTransaction = await safeSdk.createTransaction({
      safeTransactionData,
    });

    if (executionStatus !== "executed") {
      if (txHash === "") {
        if (
          Number(airDropAmount) >
            Number(
              tokenData?.filter(
                (data) => data.token_address === airDropToken,
              )[0]?.balance,
            ) &&
          tokenData.length > 0
        ) {
          return Promise.reject("Balance is less than the airdrop amount");
        }
        const safeTxHash = await safeSdk.getTransactionHash(safeTransaction);
        const payload = {
          proposalId: pid,
          txHash: safeTxHash,
        };
        await createProposalTxHash(payload);

        const proposeTxn = await safeService.proposeTransaction({
          safeAddress: gnosisAddress,
          safeTransactionData: safeTransaction.data,
          safeTxHash: safeTxHash,
          senderAddress: this.walletAddress,
        });
        const senderSignature = await safeSdk.signTypedData(
          safeTransaction,
          "v4",
        );
        await safeService.confirmTransaction(safeTxHash, senderSignature.data);
        return proposeTxn;
      } else {
        const proposalTxHash = await getProposalTxHash(pid);

        const tx = await safeService.getTransaction(
          proposalTxHash.data[0].txHash,
        );
        const nonce = await safeSdk.getNonce();
        console.log("nonce", nonce);
        const safeTxHash = tx.safeTxHash;
        const senderSignature = await safeSdk.signTypedData(tx, "v4");
        await safeService.confirmTransaction(safeTxHash, senderSignature.data);
        return tx;
      }
    } else {
      const proposalTxHash = await getProposalTxHash(pid);
      console.log("proposalTxHash", proposalTxHash);
      console.log("TXHASH", proposalTxHash.data[0].txHash);

      const safetx = await safeService.getTransaction(
        proposalTxHash.data[0].txHash,
      );

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
      const executeTxResponse = await safeSdk.executeTransaction(
        safetx,
        // options,
      );

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
    const value = convertToWei(amount, usdcConvertDecimal).toString();
    // const value = amount;
    const gasPrice = await web3.eth.getGasPrice();
    const gasAmount = await this.contract.methods
      .approve(address, value)
      .estimateGas({ from: this.walletAddress });
    const gas = gasAmount * gasPrice;
    console.log(gasPrice, gas);

    return this.contract.methods.approve(address, value).send({
      from: this.walletAddress,
      //  , gasPrice
    });
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
    const gasPrice = await web3.eth.getGasPrice();

    return this.contract.methods.closeDeposit().send({
      from: this.walletAddress,
      //  , gasPrice
    });
  }

  async startDeposit(startTime) {
    const gasPrice = await web3.eth.getGasPrice();
    return this.contract.methods.startDeposit(startTime).send({
      from: this.walletAddress,
      //  , gasPrice
    });
  }

  async deposit(address, amount, tokenUri) {
    console.log(address, amount, tokenUri);
    const gasPrice = await web3.eth.getGasPrice();
    const gasAmount = await this.contract.methods.deposit(
      address,
      amount,
      tokenUri,
    );
    // .estimateGas({ from: this.walletAddress });
    const gas = gasAmount * gasPrice;

    return this.contract.methods.deposit(address, amount, tokenUri).send({
      from: this.walletAddress,
      //  , gasPrice
    });
  }

  async balanceOf() {
    return this.contract.methods
      .balanceOf(this.walletAddress)
      .call({ from: this.walletAddress });
  }

  async decimals() {
    return this.contract.methods.decimals().call({ from: this.walletAddress });
  }

  async approve() {
    return this.contract.methods.decimals().call({ from: this.walletAddress });
  }

  async checkUserBalance() {
    return this.contract.methods
      .checkUserBalance(this.walletAddress)
      .call({ from: this.walletAddress });
  }

  async ownerAddress() {
    return this.contract.methods
      .deployerAddress()
      .call({ from: this.walletAddress });
  }

  async totalRaiseAmount() {
    return this.contract.methods
      .totalRaiseAmount()
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
    const gasPrice = await web3.eth.getGasPrice();
    return this.contract.methods.updateMinMaxDeposit(minValue, maxValue).send({
      from: this.walletAddress,
      //  , gasPrice
    });
  }

  async updateOwnerFee(performanceFee) {
    const gasPrice = await web3.eth.getGasPrice();
    return this.contract.methods.updateOwnerFee(performanceFee).send({
      from: this.walletAddress,
      //  , gasPrice
    });
  }

  async userDetails() {
    return this.contract.methods
      .userDetails(this.walletAddress)
      .call({ from: this.walletAddress });
  }

  async governanceDetails() {
    return this.contract.methods
      .isGovernanceActive()
      .call({ from: this.walletAddress });
  }

  async closeDate() {
    return this.contract.methods
      .depositCloseTime()
      .call({ from: this.walletAddress });
  }

  async closeDate() {
    return this.contract.methods
      .depositCloseTime()
      .call({ from: this.walletAddress });
  }

  async gatingTokenAddress() {
    return this.contract.methods
      .gatingTokenAddress()
      .call({ from: this.walletAddress });
  }

  async gatingTokenBalanceRequired() {
    return this.contract.methods
      .gatingTokenBalanceRequired()
      .call({ from: this.walletAddress });
  }

  async enableTokenGating(address, amount) {
    return this.contract.methods
      .enableTokenGating(address, amount)
      .send({ from: this.walletAddress });
  }

  async disableTokenGating() {
    return this.contract.methods
      .disableTokenGating()
      .send({ from: this.walletAddress });
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
  async minDepositPerUser() {
    return this.contract.methods
      .minDepositPerUser()
      .call({ from: this.walletAddress });
  }

  async getTokenURI() {
    return this.contract.methods.tokenURI().call({ from: this.walletAddress });
  }

  async maxDepositPerUser() {
    return this.contract.methods
      .maxDepositPerUser()
      .call({ from: this.walletAddress });
  }

  async depositClosed() {
    return this.contract.methods
      .depositClosed()
      .call({ from: this.walletAddress });
  }

  async depositCloseTime() {
    return this.contract.methods
      .depositCloseTime()
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

  async obtainSymbol() {
    return this.contract.methods.symbol().call({ from: this.walletAddress });
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

  async priceOfNft() {
    return this.contract.methods
      .priceOfNft()
      .call({ from: this.walletAddress });
  }

  async totalNftSupply() {
    return this.contract.methods
      .totalSupply()
      .call({ from: this.walletAddress });
  }

  async nftBalance(address) {
    return this.contract.methods
      .balanceOf(address)
      .call({ from: this.walletAddress });
  }

  async nftContractOwner() {
    return this.contract.methods.owner().call({ from: this.walletAddress });
  }

  async nftUri() {
    return this.contract.methods.tokenURI(0).call({ from: this.walletAddress });
  }

  async maxTokensPerUser() {
    return this.contract.methods
      .maxTokensPerUser()
      .call({ from: this.walletAddress });
  }

  async balanceOfNft(address) {
    return this.contract.methods
      .balanceOf(address)
      .call({ from: this.walletAddress });
  }

  async nftOwnersCount() {
    return this.contract.methods
      ._tokenIdTracker()
      .call({ from: this.walletAddress });
  }

  async totalNftSupply() {
    return this.contract.methods
      .totalSupplyOfToken()
      .call({ from: this.walletAddress });
  }

  async isNftTransferable() {
    return this.contract.methods
      .isNftTransferable()
      .call({ from: this.walletAddress });
  }

  async isNftTotalSupplyUnlimited() {
    return this.contract.methods
      .isNftTotalSupplyUnlimited()
      .call({ from: this.walletAddress });
  }

  async updateMaxTokensPerUser(tokenValue) {
    return this.contract.methods
      .updateMaxTokensPerUser(tokenValue)
      .send({ from: this.walletAddress });
  }

  async updateTotalSupplyOfToken(newSupplyValue) {
    return this.contract.methods
      .updateTotalSupplyOfToken(newSupplyValue)
      .send({ from: this.walletAddress });
  }

  async updateNftTransferability(value) {
    return this.contract.methods
      .updateNftTransferability(value)
      .send({ from: this.walletAddress });
  }

  async symbol() {
    return this.contract.methods.symbol().call({ from: this.walletAddress });
  }

  async erc20TokensMinted() {
    return this.contract.methods
      .totalTokensMinted()
      .call({ from: this.walletAddress });
  }

  async depositCloseTime() {
    return this.contract.methods
      .depositCloseTime()
      .call({ from: this.walletAddress });
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
