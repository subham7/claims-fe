import Web3 from "web3";
import CreateDAO from "../abis/DAO.json";
import GovernorContract from "../abis/governor.json";
import USDCContract from "../abis/usdc.json";
import { useDispatch } from "react-redux"
import { addWallet, removeWallet } from "../redux/reducers/create"
import {onboard} from "../utils/wallet"
import axios from "axios";


// Global variables
const MAIN_API_URL = 'https://api.stationx.network/v1/'
// const MAIN_API_URL = 'https://8c3f-115-99-246-5.in.ngrok.io/v1/'
export const FACTORY_CONTRACT_ADDRESS = '0x5767C46519e4946aA42414E4Da754E5C11D52Ef0'
export const USDC_CONTRACT_ADDRESS = '0x484727B6151a91c0298a9D2b9fD84cE3bc6BC4E3'
const RINKEBY_URL = "https://young-black-silence.rinkeby.quiknode.pro/16777add1b7c70fec1d3080f9d7a64e1bc3095df/"


// Smart contract calls

async function syncWallet() {
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
  constructor(abiFile, contractAddress, walletAddress) {
    if (syncWallet() && abiFile && contractAddress && walletAddress){
      this.web3 = new Web3(window.web3)
      this.abi = abiFile.abi
      this.contractAddress = contractAddress
      this.checkSum = this.web3.utils.toChecksumAddress(this.contractAddress)
      this.contract = new this.web3.eth.Contract(this.abi, this.checkSum)
      this.walletAddress = this.web3.utils.toChecksumAddress(walletAddress)
    }
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

  async tokenDetails() {
    return this.contract.methods.tokenDetails().call({ from: this.walletAddress })
  }

  async getGovernorDetails() {
    return this.contract.methods.getGovernorDetails().call({ from: this.walletAddress })
  }
}


// API calls

// create club API
export async function createClub(data) {
  return await axios.post(MAIN_API_URL + 'club/create', data)
}

// fetch club details API
export async function fetchClub(clubID) {
  return await axios.get(MAIN_API_URL + `club?clubId=${clubID}`)
}

// fetch club by DAO address
export async function fetchClubbyDaoAddress(clubID) {
  const resolved = {
    data: null,
    error: null,
  }
  return await fetch(MAIN_API_URL + `club/${clubID}`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
    },
  })
  .then(response => response.json())
  .then(data => {
    resolved.data = data
    return resolved
    console.log('Success:', data);
  })
  .catch((error) => {
    resolved.error = error
    return resolved
    console.error('Error:', error);
  });
}

// create user API
export async function createUser(data) {
  const resolved = {
    data: null,
    error: null,
  }
  await fetch(MAIN_API_URL + 'user', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data)
  })
  .then(res => {
    resolved.data = res
    console.log(res)
  })
  .catch(err => {
    resolved.error = err
  })
  return resolved
}

// fetch club by user address API
export async function fetchClubByUserAddress(userId) {
  const web3 = new Web3(window.web3)
  const walletAddress = web3.utils.toChecksumAddress(userId)
  return await axios.get(MAIN_API_URL + `user/${walletAddress}`,)
}

// create proposal API
export async function createProposal(data) {
  return await axios.post(MAIN_API_URL + 'proposal', data)
}

// get proposal by id API
export async function getProposal(clubId) {
  return await axios.get(MAIN_API_URL + `proposal/club/${clubId}`)
}

// get proposal detail by proposal id
export async function getProposalDetail(proposalId) {
  return await axios.get(MAIN_API_URL + `proposal/${proposalId}`)
}

// cast vote API
export async function castVote(data) {
  return await axios.post(MAIN_API_URL + `proposal/vote`, data)
}

// getTokens API 
export async function getTokens(gnosisAddress) {
  return await axios.get(MAIN_API_URL + `gnosis/getTokens?gnosisAddress=${gnosisAddress}`)
}

// getTokens API 
export async function getNfts(gnosisAddress) {
  return await axios.get(MAIN_API_URL + `gnosis/getNFT?gnosisAddress=${gnosisAddress}`)
}

// getTokens API 
export async function getBalance(gnosisAddress) {
  return await axios.get(MAIN_API_URL + `gnosis/getAssets?gnosisAddress=${gnosisAddress}`)
}

// get members list API
export async function getMembersDetails(clubId) {
  return await axios.get(MAIN_API_URL + `user/club/${clubId}`)
}