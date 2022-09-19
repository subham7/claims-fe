import {SmartContract} from "../api/contract";
import ImplementationContract from "../abis/implementationABI.json";

export const calculateUserSharePercentage = (balance, total) => {
  // function for calculating the balance percentage of the users share
  return parseFloat(balance) / parseFloat(total) * 100
}

export const convertAmountToWei = (value) => {
  // function for converting the amount from Wei format
  return web3.utils.fromWei(value, 'Mwei')
}

export const calculateTreasuryTargetShare = (treasuryBalance, totalSupply) => {
  // function for calculating the percentage of current tokens minted so far from the total target token supply
  return parseInt(treasuryBalance) / parseInt(totalSupply) * 100
}

export const convertToWei = (amount) => {
  // function for converting the amount from decimal to Wei format
  return web3.utils.toWei(web3.utils.toBN(amount).toString(), 'Mwei')
}

export const calculateDays = (dateTime) => {
  // function for calculating the number of days
  return Math.round((new Date(dateTime) - new Date()) / (1000 * 60 * 60 * 24))
}

export const convertToWeiGovernance = (daoAddress, convertValue, usdcContractAddress, gnosisTransactionUrl) => {
  return new Promise((resolve,reject) =>{
    const contract = new SmartContract(ImplementationContract, daoAddress, undefined, usdcContractAddress, gnosisTransactionUrl)
    const tokenDecimal = contract.obtainTokenDecimals()
    tokenDecimal.then((result) => {
      resolve((convertValue) * Math.pow(10, result))
    })
  })
}

export const convertToWeiUSDC = (value, usdcContractAddress, gnosisTransactionUrl) => {
  return new Promise((resolve,reject) =>{
    const contract = new SmartContract(ImplementationContract, usdcContractAddress, undefined, usdcContractAddress, gnosisTransactionUrl)
    const tokenDecimal = contract.obtainTokenDecimals()
    tokenDecimal.then((result) => {
      resolve(web3.utils.toBN(value) * Math.pow(10, result))
    })
  })
}

export const convertFromWeiGovernance = (daoAddress, convertValue, usdcContractAddress, gnosisTransactionUrl) => {
  return new Promise((resolve,reject) =>{
    const contract = new SmartContract(ImplementationContract, daoAddress, undefined, usdcContractAddress, gnosisTransactionUrl)
    const tokenDecimal = contract.obtainTokenDecimals()
    tokenDecimal.then((result) => {
      resolve((convertValue) / Math.pow(10, result))
    })
  })
}

export const convertFromWeiUSDC = (value, usdcContractAddress, gnosisTransactionUrl) => {
  return new Promise((resolve,reject) =>{
    const contract = new SmartContract(ImplementationContract, usdcContractAddress, undefined, usdcContractAddress, gnosisTransactionUrl)
    const tokenDecimal = contract.obtainTokenDecimals()
    tokenDecimal.then((result) => {
      resolve(web3.utils.toBN(value) / Math.pow(10, result))
    })
  })
}