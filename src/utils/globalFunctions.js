import ImplementationContract from "../abis/implementationABI.json";
import { SmartContract } from "../api/contract";
import { ethers } from "ethers";

// function for calculating the balance percentage of the users share
export const calculateUserSharePercentage = (balance, total) => {
  return ((parseFloat(balance) / parseFloat(total)) * 100).toFixed(2);
};

// function for converting the amount from Wei format
export const convertAmountToWei = (value) => {
  return web3.utils.fromWei(value, "Mwei");
};

// function for calculating the percentage of current tokens minted so far from the total target token supply
export const calculateTreasuryTargetShare = (treasuryBalance, totalSupply) => {
  return ((parseInt(treasuryBalance) / parseInt(totalSupply)) * 100).toFixed(2);
};

// function for calculating the number of days
export const calculateDays = (dateTime) => {
  console.log(
    dateTime,
    Math.round((new Date(dateTime) - new Date()) / (1000 * 60 * 60 * 24)),
  );
  return Math.round((new Date(dateTime) - new Date()) / (1000 * 60 * 60 * 24));
};

// function for converting the usdc token amount from decimal to Wei format
export const convertToWei = (convertAmount, decimal) => {
  // console.log("convert amount", convertAmount * Math.pow(10, decimal));
  // console.log(
  //   "convert amount wei",
  //   web3.utils.fromWei(convertAmount, Math.pow(10, decimal).toString()),
  // );
  try {
    return ethers
      .parseUnits(convertAmount.toString(), Number(decimal))
      .toString();
  } catch (error) {}
};

// function for converting the governance token amount from decimal to Wei format
export const convertToWeiGovernance = (convertValue, decimal) => {
  try {
    return ethers
      .parseUnits(convertValue.toString(), Number(decimal))
      .toString();
  } catch (error) {}
};

// function for converting the usdc token amount from Wei to decimal format
export const convertFromWei = (convertAmount, decimal) => {
  try {
    return ethers
      .formatUnits(convertAmount.toString(), Number(decimal))
      .toString();
  } catch (err) {
    // console.log(err);
  }
};

// function for converting the governance token amount from Wei to decimal format
export const convertFromWeiGovernance = (convertValue, decimal) => {
  try {
    return ethers.formatUnits(convertValue.toString(), Number(decimal));
  } catch (err) {
    // console.log(err);
  }
};
