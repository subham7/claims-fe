import Web3 from "web3";
import CreateDAO from "../abis/DAO.json";
import GovernorContract from "../abis/governor.json";
import USDCContract from "../abis/usdc.json";
import { useDispatch } from "react-redux"
import { addWallet, removeWallet } from "../redux/reducers/create"
import {onboard} from "../utils/wallet"


// Global variables
const MAIN_API_URL = 'http://ec2-65-0-105-40.ap-south-1.compute.amazonaws.com:4000/v1/'
// export const FACTORY_CONTRACT_ADDRESS = '0x585d26CE6E1D28C334E22b307d43F32D5bF283Dd'
export const FACTORY_CONTRACT_ADDRESS = '0xE8269328F9B28AF72E37843fEc0940AAf3e8f281'
export const USDC_CONTRACT_ADDRESS = '0x484727B6151a91c0298a9D2b9fD84cE3bc6BC4E3'
const RINKEBY_URL = "https://young-black-silence.rinkeby.quiknode.pro/16777add1b7c70fec1d3080f9d7a64e1bc3095df/"


// Smart contract calls

async function syncWallet() {
  if (window.ethereum) {
    window.web3 = new Web3(window.ethereum)
    await window.ethereum.request({ method: 'eth_requestAccounts'})
    .then(console.log("connected"))
    .catch((error) => {
      if (error.code === 4001) {
        // EIP-1193 userRejectedRequest error
        console.log('Please connect to MetaMask.');
      } else {
        console.error(error);
      }
    });
  }
  else if (window.web3) {
    window.web3 = new Web3(window.web3.currentProvider)
  }
  else {
    window.alert('Non-Ethereum browser detected. You should consider trying MetaMask!')
  }
}

export class SmartContract{
  constructor(abiFile, contractAddress, walletAddress) {
    syncWallet()
    this.web3 = new Web3(window.web3)
    this.abi = abiFile.abi
    this.contractAddress = contractAddress
    // this.checkSum = this.web3.utils.toChecksumAddress(this.contractAddress)
    this.contract = new this.web3.eth.Contract(this.abi, this.contractAddress)
    this.walletAddress = walletAddress
  }

  async createDAO(tokenName, tokenSymbol, totalDeposit, minDeposit, maxDeposit, ownerFee, closeDate, feeUSDC, tresuryAddress, quoram, formThreshold) {
    const days = Math.round((new Date(closeDate) - new Date()) / (1000 * 60 * 60 * 24))
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

  async approveDeposit(address, amount) {
    console.log(window.web3.selectedAddress)
    return this.contract.methods.approve(address, amount).send({ from: this.walletAddress })
  }
  
  async deposit(address, amount) {
    return this.contract.methods.deposit(
      address, 
      amount
      ).send({ from: this.walletAddress })
  }
  
  async balanceOf() {
    return this.contract.methods.balanceOf(this.walletAddress).call({from: this.walletAddress})
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
    return this.contract.methods.quoram().call({ from: this.walletAddress })
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
}


// API calls

export async function createClub(data) {
  const resolved = {
    data: null,
    error: null,
  }
  await fetch(MAIN_API_URL + 'club/create', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data),
  })
    .then(res => {
      resolved.data = res
    })
    .catch(err => {
      resolved.error = err
    })
  return resolved
}

export async function fetchClub(clubID) {
  const resolved = {
    data: null,
    error: null,
  }
  await fetch(MAIN_API_URL + `/club/${clubID}`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
    },
  })
    .then(data => {
      resolved.data = data.json()
      return resolved
    })
    .catch(err => {
      resolved.error = err
      return resolved
    })
}