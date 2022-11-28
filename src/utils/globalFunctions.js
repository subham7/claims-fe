import { SmartContract } from "../api/contract";
import ImplementationContract from "../abis/implementationABI.json";

// function for calculating the balance percentage of the users share
export const calculateUserSharePercentage = (balance, total) => {
  return (parseFloat(balance) / parseFloat(total)) * 100;
};

// function for converting the amount from Wei format
export const convertAmountToWei = (value) => {
  return web3.utils.fromWei(value, "Mwei");
};

// function for calculating the percentage of current tokens minted so far from the total target token supply
export const calculateTreasuryTargetShare = (treasuryBalance, totalSupply) => {
  return (parseInt(treasuryBalance) / parseInt(totalSupply)) * 100;
};

// function for calculating the number of days
export const calculateDays = (dateTime) => {
  return Math.round((new Date(dateTime) - new Date()) / (1000 * 60 * 60 * 24));
};

// function for converting the usdc token amount from decimal to Wei format
export const convertToWei = (convertAmount, decimal) => {
  return convertAmount * Math.pow(10, decimal);
};

// function for converting the governance token amount from decimal to Wei format
export const convertToWeiGovernance = (convertValue, decimal) => {
  return convertValue * Math.pow(10, decimal);
};

// function for converting the usdc token amount from Wei to decimal format
export const convertFromWei = (convertAmount, decimal) => {
  return convertAmount / Math.pow(10, decimal);
};

// function for converting the governance token amount from Wei to decimal format
export const convertFromWeiGovernance = (convertValue, decimal) => {
  return convertValue / Math.pow(10, decimal);
};
