import Web3 from "web3";
import { Web3Adapter } from "@safe-global/protocol-kit";
import Safe from "@safe-global/protocol-kit";
import { createProposalTxHash, getProposalTxHash } from "../../api/proposal";
import { convertToWei } from "../../utils/globalFunctions";
import { RPC_URL } from "../index";
import SafeApiKit from "@safe-global/api-kit";
import Erc20Dao from "../../abis/newArch/erc20Dao.json";

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
    useMetamask,
  ) {
    if (
      (syncWallet() &&
        abiFile &&
        contractAddress &&
        walletAddress &&
        usdcContractAddress,
      gnosisTransactionUrl)
    ) {
      if (!useMetamask) {
        this.web3 = new Web3(RPC_URL);
      } else {
        this.web3 = new Web3(window.ethereum);
      }
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
      if (!useMetamask) {
        this.web3 = new Web3(RPC_URL);
      } else {
        this.web3 = new Web3(window.ethereum);
      }
      this.abi = abiFile.abi;
      this.contractAddress = contractAddress;
      this.checkSum = this.web3.utils.toChecksumAddress(this.contractAddress);
      this.contract = new this.web3.eth.Contract(this.abi, this.checkSum);
      this.walletAddress = this.web3.utils.toChecksumAddress(walletAddress);
    }
  }

  async claimContract(claimSettings) {
    const gasPrice = await this.web3.eth.getGasPrice();
    const increasedGasPrice = +gasPrice + 30000000000;
    return this.contract.methods
      .deployClaimContract(claimSettings)
      .send({ from: this.walletAddress, gasPrice: increasedGasPrice });
  }

  async claimSettings() {
    return this.contract.methods.claimSettings().call();
  }

  async claimBalance() {
    return this.contract.methods.claimBalance().call();
  }

  async claim(amount, merkleData, leaf) {
    const gasPrice = await this.web3.eth.getGasPrice();
    const increasedGasPrice = +gasPrice + 30000000000;
    return this.contract.methods.claim(amount, merkleData, leaf).send({
      from: this.walletAddress,
      gasPrice: increasedGasPrice,
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

  async buyGovernanceTokenERC20DAO(
    userAddress,
    daoAddress,
    numOfTokens,
    merkleProof,
  ) {
    const gasPrice = await this.web3.eth.getGasPrice();
    const increasedGasPrice = +gasPrice + 30000000000;
    return this.contract.methods
      .buyGovernanceTokenERC20DAO(
        userAddress,
        daoAddress,
        numOfTokens,
        merkleProof,
      )
      .send({
        from: this.walletAddress,
        gasPrice: increasedGasPrice,
      });
  }

  async buyGovernanceTokenERC721DAO(
    userAddress,
    daoAddress,
    tokenUriOfNFT,
    numOfTokens,
    merkleProof,
  ) {
    const gasPrice = await this.web3.eth.getGasPrice();
    const increasedGasPrice = +gasPrice + 30000000000;
    return this.contract.methods
      .buyGovernanceTokenERC721DAO(
        userAddress,
        daoAddress,
        tokenUriOfNFT,
        numOfTokens,
        merkleProof,
      )
      .send({
        from: this.walletAddress,
        gasPrice: increasedGasPrice,
      });
  }

  async createERC721DAO(
    clubName,
    clubSymbol,
    ownerFeePerDepositPercent,
    depositClose,
    quorum,
    threshold,
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
  ) {
    const gasPrice = await this.web3.eth.getGasPrice();
    const increasedGasPrice = +gasPrice + 30000000000;
    return this.contract.methods
      .createERC721DAO(
        clubName,
        clubSymbol,
        ownerFeePerDepositPercent,
        depositClose,
        quorum,
        threshold,
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
      .send({ from: this.walletAddress, gasPrice: increasedGasPrice });
  }

  async createERC20DAO(
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
    depositTokenAddress,
    treasuryAddress,
    addressList,
    isGovernanceActive,
    isGtTransferable,
    allowWhiteList,
    assetsStoredOnGnosis,
    merkleRoot,
  ) {
    const gasPrice = await this.web3.eth.getGasPrice();
    const increasedGasPrice = +gasPrice + 30000000000;

    return this.contract.methods
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
        depositTokenAddress,
        treasuryAddress,
        addressList,
        isGovernanceActive,
        isGtTransferable,
        allowWhiteList,
        assetsStoredOnGnosis,
        merkleRoot,
      )
      .send({ from: this.walletAddress, gasPrice: increasedGasPrice });
  }

  async getERC20DAOdetails() {
    return this.contract?.methods.getERC20DAOdetails().call({
      from: this.walletAddress,
    });
  }

  async getERC721DAOdetails() {
    return this.contract?.methods.getERC721DAOdetails().call({
      from: this.walletAddress,
    });
  }

  async getDAOdetails(daoAddress) {
    return this.contract?.methods.getDAOdetails(daoAddress).call({
      from: this.walletAddress,
    });
  }

  async updateProposalAndExecution(
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
  ) {
    const parameters = data;

    const ethAdapter = new Web3Adapter({
      web3: new Web3(window.ethereum),
      signerAddress: this.walletAddress,
    });
    const txServiceUrl = this.gnosisTransactionUrl;
    const safeService = new SafeApiKit({
      txServiceUrl,
      ethAdapter,
    });

    const safeSdk = await Safe.create({
      ethAdapter: ethAdapter,
      safeAddress: gnosisAddress,
    });

    const implementationContract = new web3.eth.Contract(
      Erc20Dao.abi,
      daoAddress,
    );

    let approvalTransaction;
    let transaction;
    if (approvalData !== "") {
      approvalTransaction = {
        to: web3.utils.toChecksumAddress(daoAddress),
        data: implementationContract.methods
          .updateProposalAndExecution(
            //usdc address
            web3.utils.toChecksumAddress(tokenData),
            approvalData,
          )
          .encodeABI(),
        value: "0",
      };

      transaction = {
        to: web3.utils.toChecksumAddress(daoAddress),
        data: implementationContract.methods
          .updateProposalAndExecution(
            //airdrop address

            web3.utils.toChecksumAddress(airdropContractAddress),
            parameters,
          )
          .encodeABI(),
        value: "0",
      };
    } else {
      // debugger;
      transaction = {
        //dao
        to: web3.utils.toChecksumAddress(daoAddress),
        data: implementationContract.methods
          .updateProposalAndExecution(
            //factory
            factoryContractAddress
              ? web3.utils.toChecksumAddress(factoryContractAddress)
              : web3.utils.toChecksumAddress(daoAddress),
            parameters,
          )
          .encodeABI(),
        value: "0",
      };
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
            // operation, // Optional
            // safeTxGas, // Optional
            // baseGas, // Optional
            // gasPrice, // Optional
            // gasToken, // Optional
            // refundReceiver, // Optional
            nonce: nonce, // Optional
          };
        } else {
          safeTransactionData = [
            {
              to: approvalTransaction.to,
              data: approvalTransaction.data,
              value: approvalTransaction.value,
              // operation, // Optional
              // safeTxGas, // Optional
              // baseGas, // Optional
              // gasPrice, // Optional
              // gasToken, // Optional
              // refundReceiver, // Optional
              nonce: nonce, // Optional
            },
            {
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
            },
          ];
        }

        const safeTransaction = await safeSdk.createTransaction({
          safeTransactionData,
        });
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
            // operation, // Optional
            // safeTxGas, // Optional
            // baseGas, // Optional
            // gasPrice, // Optional
            // gasToken, // Optional
            // refundReceiver, // Optional
            nonce: tx.nonce, // Optional
          };
        } else {
          safeTransactionData = [
            {
              to: tx.dataDecoded.parameters[0].valueDecoded[0].to,
              data: tx.dataDecoded.parameters[0].valueDecoded[0].data,
              value: tx.dataDecoded.parameters[0].valueDecoded[0].value,
              // operation, // Optional
              // safeTxGas, // Optional
              // baseGas, // Optional
              // gasPrice, // Optional
              // gasToken, // Optional
              // refundReceiver, // Optional
              nonce: tx.nonce, // Optional
            },
            {
              to: tx.dataDecoded.parameters[0].valueDecoded[1].to,
              data: tx.dataDecoded.parameters[0].valueDecoded[1].data,
              value: tx.dataDecoded.parameters[0].valueDecoded[1].value,
              // operation, // Optional
              // safeTxGas, // Optional
              // baseGas, // Optional
              // gasPrice, // Optional
              // gasToken, // Optional
              // refundReceiver, // Optional
              nonce: tx.nonce, // Optional
            },
          ];
        }

        const safeTxHash = tx.safeTxHash;
        const safeTransaction = await safeSdk.createTransaction({
          safeTransactionData,
        });
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
        // from, // Optional
        // gasPrice: increasedGasPrice,
        // gasPrice, // Optional
        // maxFeePerGas, // Optional
        // maxPriorityFeePerGas // Optional
        // nonce // Optional
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
  }

  async approveDeposit(address, amount, usdcConvertDecimal) {
    const value = convertToWei(amount, usdcConvertDecimal).toString();
    // const value = amount;
    const gasPrice = await web3.eth.getGasPrice();
    const increasedGasPrice = +gasPrice + 30000000000;

    return this.contract.methods.approve(address, value).send({
      from: this.walletAddress,
      gasPrice: increasedGasPrice,
    });
  }

  async performanceFee() {
    const gasPrice = await web3.eth.getGasPrice();
    const increasedGasPrice = +gasPrice + 30000000000;

    return await this.contract.methods
      .ownerFeePerDeposit()
      .call({ from: this.walletAddress, gasPrice: increasedGasPrice });
  }

  async mint(address, amount) {
    const gasPrice = await web3.eth.getGasPrice();
    const increasedGasPrice = +gasPrice + 30000000000;

    return this.contract.methods
      .mint(address, amount)
      .send({ from: this.walletAddress, gasPrice: increasedGasPrice });
  }

  async closeDeposit() {
    const gasPrice = await web3.eth.getGasPrice();
    const increasedGasPrice = +gasPrice + 30000000000;

    return this.contract.methods.closeDeposit().send({
      from: this.walletAddress,
      gasPrice: increasedGasPrice,
    });
  }

  async startDeposit(startTime) {
    const gasPrice = await web3.eth.getGasPrice();
    const increasedGasPrice = +gasPrice + 30000000000;
    return this.contract.methods.startDeposit(startTime).send({
      from: this.walletAddress,
      gasPrice: increasedGasPrice,
    });
  }

  async deposit(address, amount, tokenUri) {
    const gasPrice = await web3.eth.getGasPrice();
    const increasedGasPrice = +gasPrice + 30000000000;

    return this.contract.methods.deposit(address, amount, tokenUri).send({
      from: this.walletAddress,
      gasPrice: increasedGasPrice,
    });
  }

  async balanceOf() {
    return this.contract?.methods
      .balanceOf(this.walletAddress)
      .call({ from: this.walletAddress });
  }

  async transfer(address, amount) {
    const gasPrice = await web3.eth.getGasPrice();
    const increasedGasPrice = +gasPrice + 30000000000;
    return this.contract.methods.transfer(address, amount).send({
      from: this.walletAddress,
      gasPrice: increasedGasPrice,
    });
  }

  async decimals() {
    return this.contract?.methods.decimals().call({ from: this.walletAddress });
  }

  async totalSupply() {
    return this.contract?.methods
      .totalSupply()
      .call({ from: this.walletAddress });
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

  async updateOwnerFee(ownerFeePerDeposit, daoAddress) {
    const gasPrice = await web3.eth.getGasPrice();
    const increasedGasPrice = +gasPrice + 30000000000;
    return this.contract.methods
      .updateOwnerFee(ownerFeePerDeposit, daoAddress)
      .send({
        from: this.walletAddress,
        gasPrice: increasedGasPrice,
      });
  }

  async updateDepositTime(depositTime, daoAddress) {
    const gasPrice = await web3.eth.getGasPrice();
    const increasedGasPrice = +gasPrice + 30000000000;
    return this.contract.methods
      .updateDepositTime(depositTime, daoAddress)
      .send({
        from: this.walletAddress,
        gasPrice: increasedGasPrice,
      });
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
    const increasedGasPrice = +gasPrice + 30000000000;
    return this.contract.methods.updateMinMaxDeposit(minValue, maxValue).send({
      from: this.walletAddress,
      gasPrice: increasedGasPrice,
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
    const gasPrice = await web3.eth.getGasPrice();
    const increasedGasPrice = +gasPrice + 30000000000;
    return this.contract.methods
      .enableTokenGating(address, amount)
      .send({ from: this.walletAddress, gasPrice: increasedGasPrice });
  }

  async disableTokenGating() {
    const gasPrice = await web3.eth.getGasPrice();
    const increasedGasPrice = +gasPrice + 30000000000;
    return this.contract.methods
      .disableTokenGating()
      .send({ from: this.walletAddress, gasPrice: increasedGasPrice });
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
    const gasPrice = await web3.eth.getGasPrice();
    const increasedGasPrice = +gasPrice + 30000000000;
    return this.contract.methods
      .updateMaxTokensPerUser(tokenValue)
      .send({ from: this.walletAddress, gasPrice: increasedGasPrice });
  }

  async updateTotalSupplyOfToken(newSupplyValue) {
    const gasPrice = await web3.eth.getGasPrice();
    const increasedGasPrice = +gasPrice + 30000000000;
    return this.contract.methods
      .updateTotalSupplyOfToken(newSupplyValue)
      .send({ from: this.walletAddress, gasPrice: increasedGasPrice });
  }

  async updateNftTransferability(value) {
    const gasPrice = await web3.eth.getGasPrice();
    const increasedGasPrice = +gasPrice + 30000000000;
    return this.contract.methods
      .updateNftTransferability(value)
      .send({ from: this.walletAddress, gasPrice: increasedGasPrice });
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
    tokenA,
    tokenB,
    operator,
    comparator,
    value,
    daoAddress,
  ) {
    const gasPrice = await web3.eth.getGasPrice();
    const increasedGasPrice = +gasPrice + 30000000000;
    return this.contract.methods
      .setupTokenGating(tokenA, tokenB, operator, comparator, value, daoAddress)
      .send({
        from: this.walletAddress,
        gasPrice: increasedGasPrice,
      });
  }

  async getTokenGatingDetails(daoAddress) {
    return this.contract.methods.getTokenGatingDetails(daoAddress).call({
      from: this.walletAddress,
    });
  }
}
