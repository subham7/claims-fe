import Web3 from "web3";
import Web3Adapter from "@gnosis.pm/safe-web3-lib";
import SafeServiceClient from "@gnosis.pm/safe-service-client";
import USDCContract from "../../abis/usdcTokenContract.json";
import Safe, {EthSignSignature} from "@gnosis.pm/safe-core-sdk";
import {USDC_CONTRACT_ADDRESS} from "../index";
import {calculateDays} from "../../utils/globalFunctions";

async function syncWallet() {
  // function for validating metamask wallet
  if (window.ethereum) {
    window.web3 = new Web3(window.ethereum)
    await window.ethereum.request({ method: 'eth_requestAccounts'})
      .then((result) =>
        { console.log("connected")
          return true}
      )
      .catch((error) => {
        if (error.code === 4001) {
          // EIP-1193 userRejectedRequest error
          console.log('Please connect to MetaMask.');
          return false
        } else {
          console.error(error);
          return false
        }
      });
  }
  else if (window.web3) {
    window.web3 = new Web3(window.web3.currentProvider)
    return true
  }
  else {
    window.alert('Non-Ethereum browser detected. You should consider trying MetaMask!')
    return false
  }
}

export class SmartContract{
  // Smart contract class
  constructor(abiFile, contractAddress, walletAddress=localStorage.getItem("wallet")) {
    if (syncWallet() && abiFile && contractAddress && walletAddress){
      this.web3 = new Web3(window.web3)
      this.abi = abiFile.abi
      this.contractAddress = contractAddress
      this.checkSum = this.web3.utils.toChecksumAddress(this.contractAddress)
      this.contract = new this.web3.eth.Contract(this.abi, this.checkSum)
      this.walletAddress = this.web3.utils.toChecksumAddress(walletAddress)
    }
  }

  // create new club contract function
  async createDAO(tokenName, tokenSymbol, totalDeposit, minDeposit, maxDeposit, ownerFee, closeDate, feeUSDC, tresuryAddress, quoram, formThreshold) {
    const days = Math.round(calculateDays(closeDate))
    // call createDAO method from contract
    return this.contract.methods.createDAO(
      tokenName,
      tokenSymbol,
      totalDeposit,
      minDeposit,
      maxDeposit,
      ownerFee,
      days,
      feeUSDC,
      tresuryAddress,
      quoram,
      formThreshold
    ).send({ from : this.walletAddress})
  }

  async updateProposalAndExecution(
    proposalHash="",
    executionStatus="",
    proposalId=1,
    customToken="0x0000000000000000000000000000000000000000",
    airDropToken="0x0000000000000000000000000000000000000000",
    executionIds=[0,0,0,0,0,0,0,0,0],
    quoram=0,
    threshold=0,
    day=0,
    minDeposits=0,
    maxDeposits=0,
    totalDeposits=0,
    airDropAmount=0,
    mintGTAmounts=[],
    mintGTAddresses=[],
    customTokenAmounts=[],
    customTokenAddresses=[],
    sendEthAmounts=[],
    sendEthAddresses=[],
    executiveRoles=[]
  ) {
    return this.contract.methods.updateProposalAndExecution({
        proposalHash: proposalHash,
        status: executionStatus,
        proposalId: proposalId,
        customToken: customToken,
        airDropToken: airDropToken,
        executionIds: executionIds,
        quorum: quoram,
        threshold: threshold,
        day: day,
        minDeposits: minDeposits,
        maxDeposits: maxDeposits,
        totalDeposits: totalDeposits,
        airDropAmount: airDropAmount,
        mintGTAmounts: mintGTAmounts,
        mintGTAddresses: mintGTAddresses,
        customTokenAmounts: customTokenAmounts,
        customTokenAddresses: customTokenAddresses,
        sendEthAmounts: sendEthAmounts,
        sendEthAddresses: sendEthAddresses,
        executiveRoles: executiveRoles
      }
    ).send( { from: this.walletAddress })
  }

  async approveDepositGnosis(address, amount, daoAddress, tresuryAddress){
    const safeOwner = this.walletAddress
    const ethAdapter = new Web3Adapter({
      web3: this.web3,
      signerAddress: safeOwner,
    })
    const txServiceUrl = 'https://safe-transaction.rinkeby.gnosis.io'
    const safeService = new SafeServiceClient({ txServiceUrl, ethAdapter })
    const web3 = new Web3(window.web3)

    const usdcContract = new web3.eth.Contract(USDCContract.abi, USDC_CONTRACT_ADDRESS)

    const safeSdk = await Safe.create({ ethAdapter:ethAdapter, safeAddress: tresuryAddress })
    const transaction = {
      to: USDC_CONTRACT_ADDRESS,
      data: usdcContract.methods.transfer(address[0], amount[0]).encodeABI(),
      value: '0',
    }
    const safeTransaction = await safeSdk.createTransaction(transaction)
    await safeSdk.signTransaction(safeTransaction)
    const safeTxHash = await safeSdk.getTransactionHash(safeTransaction)
    const senderSignature = await safeSdk.signTransactionHash(safeTxHash)
    await safeService.proposeTransaction({
      safeAddress: tresuryAddress,
      safeTransactionData: safeTransaction.data,
      safeTxHash: safeTxHash,
      senderAddress: this.walletAddress,
      senderSignature: senderSignature.data,
    })
    const tx = await safeService.getTransaction(safeTxHash)
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
    }
    const safeTransaction2 = await safeSdk.createTransaction(safeTransactionData)

    for (let i = 0; i < tx.confirmations.length; i++){
      const signature = new EthSignSignature(tx.confirmations[i].owner, tx.confirmations[i].signature)
      safeTransaction2.addSignature(signature)
    }
    const executeTxResponse = await safeSdk.executeTransaction(safeTransaction2)
    const receipt = executeTxResponse.transactionResponse && (await executeTxResponse.transactionResponse.wait())
    return executeTxResponse
  }

  async approveDeposit(address, amount) {
    const number = new web3.utils.BN(amount);
    return this.contract.methods.approve(address, web3.utils.toWei(number, 'ether')).send({ from: this.walletAddress })
  }
  async deposit(address, amount) {
    return this.contract.methods.deposit(
      address, amount
    ).send({ from: this.walletAddress })
  }

  async balanceOf() {
    return this.contract.methods.balanceOf(this.walletAddress).call({from: this.walletAddress})
  }

  async checkUserBalance() {
    return this.contract.methods.checkUserBalance(this.walletAddress).call({ from: this.walletAddress })
  }

  async ownerAddress() {
    return this.contract.methods.ownerAddress().call({ from: this.walletAddress })
  }

  async totalDeposit() {
    return this.contract.methods.totalDeposit().call({ from: this.walletAddress })
  }

  async minDeposit() {
    return this.contract.methods.minDeposit().call({ from: this.walletAddress })
  }

  async maxDeposit() {
    return this.contract.methods.maxDeposit().call({ from: this.walletAddress })
  }

  async closeDate() {
    return this.contract.methods.closeDate().call({ from: this.walletAddress })
  }

  async ownerFee() {
    return this.contract.methods.ownerFee().call({ from: this.walletAddress })
  }

  async daoAmount() {
    return this.contract.methods.daoAmount().call({ from: this.walletAddress })
  }

  async quoram() {
    return this.contract.methods.quorum().call({ from: this.walletAddress })
  }

  async threshold() {
    return this.contract.methods.threshold().call({ from: this.walletAddress })
  }

  async depositClosed() {
    return this.contract.methods.depositClosed().call({ from: this.walletAddress })
  }

  async tresuryAddress() {
    return this.contract.methods.tresuryAddress().call({ from: this.walletAddress })
  }

  async tokenAddress() {
    return this.contract.methods.tokenAddress().call({ from: this.walletAddress })
  }

  async balance(governanceToken) {
    return this.contract.methods.balance(governanceToken).call({ from: this.walletAddress })
  }

  async tokenDetails() {
    return this.contract.methods.tokenDetails().call({ from: this.walletAddress })
  }

  async getGovernorDetails() {
    return this.contract.methods.getGovernorDetails().call({ from: this.walletAddress })
  }
}