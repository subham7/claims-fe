import Web3 from "web3";
import CreateDAO from "../abis/DAO.json";

// Global variables
const MAIN_API_URL = 'http://ec2-65-0-105-40.ap-south-1.compute.amazonaws.com:4000/v1/'
const DAO_CONTRACT_ADDRESS = '0xbfa33C88f614345F3cbaedB8174db04043E3E412'
const RINKEBY_URL = 'https://rinkeby.infura.io/v3/feaf3bb22fef436e996b4eb0e157dacd'


export async function createDAO(tokenName, tokenSymbol, totalDeposit, minDeposit, maxDeposit, ownerFee, closeDate, feeUSDC,safeAddress, quoram, formThreshold) {
  const days = Math.round((new Date(closeDate) - new Date()) / (1000 * 60 * 60 * 24))
  const web3 = new Web3(RINKEBY_URL)
  const abi = CreateDAO.abi
  const contract = new web3.eth.Contract(abi, DAO_CONTRACT_ADDRESS)
  // call createDAO method from contract
  return contract.methods.createDAO(
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