import Web3 from "web3";
import CreateDAO from "../abis/DAO.json";
import GovernorContract from "../abis/governor.json";
import USDCContract from "../abis/usdc.json";
import { useDispatch } from "react-redux"
import { addWallet, removeWallet } from "../redux/reducers/create"
import {onboard} from "../utils/wallet"


// Global variables
const MAIN_API_URL = 'http://ec2-65-0-105-40.ap-south-1.compute.amazonaws.com:4000/v1/'
export const DAO_CONTRACT_ADDRESS = '0xbfa33C88f614345F3cbaedB8174db04043E3E412'
export const USDC_CONTRACT_ADDRESS = '0x69726A9381ad96312CDc8A46C054795656f49807'
const RINKEBY_URL = 'https://rinkeby.infura.io/v3/feaf3bb22fef436e996b4eb0e157dacd'


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
  constructor(abiFile, contractAddress) {
    syncWallet()
    this.web3 = new Web3(window.web3)
    this.abi = abiFile.abi
    this.contractAddress = contractAddress
    this.checkSum = this.web3.utils.toChecksumAddress(this.contractAddress)
    this.contract = new this.web3.eth.Contract(this.abi, this.contractAddress)
  }

  async createDAO(tokenName, tokenSymbol, totalDeposit, minDeposit, maxDeposit, ownerFee, closeDate, feeUSDC,safeAddress, quoram, formThreshold) {
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
      safeAddress,
      quoram,
      formThreshold
    ).call()
  }

  async approveDeposit(address, amount) {
    return this.contract.methods.approve(address, amount).send({ from: window.ethereum.selectedAddress })
  }
  
  async deposit(address, amount) {
    return this.contract.methods.deposit(
      address, 
      amount
      ).send({ from: window.ethereum.selectedAddress })
  }
}


// API calls

export async function createClub(data) {
  const resolved = {
    data: null,
    error: null,
  }
  return await fetch(MAIN_API_URL + 'club/create', {
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
    })
    .catch(err => {
      resolved.error = err
    })
  return resolved
}