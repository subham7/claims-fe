import { ethers } from "ethers";

// function for calculating the balance percentage of the users share
export const calculateUserSharePercentage = (balance, total) => {
  return ((parseFloat(balance) / parseFloat(total)) * 100).toFixed(2);
};

// function for calculating the percentage of current tokens minted so far from the total target token supply
export const calculateTreasuryTargetShare = (treasuryBalance, totalSupply) => {
  return ((parseInt(treasuryBalance) / parseInt(totalSupply)) * 100).toFixed(2);
};

// function for calculating the number of days
export const calculateDays = (dateTime) => {
  return Math.round((new Date(dateTime) - new Date()) / (1000 * 60 * 60 * 24));
};

// function for converting the governance token amount from decimal to Wei format
export const convertToWeiGovernance = (convertValue, decimal) => {
  if (decimal) {
    try {
      return ethers
        .parseUnits(convertValue.toString(), Number(decimal))
        ?.toString();
    } catch (error) {}
  }
};

// function for converting the governance token amount from Wei to decimal format
export const convertFromWeiGovernance = (convertValue, decimal) => {
  if (decimal) {
    try {
      return ethers.formatUnits(convertValue?.toString(), Number(decimal));
    } catch (err) {
      console.log(err);
    }
  }
};

export const getImageURL = async (url) => {
  try {
    if (url) {
      const metadataHash = url?.replace("ipfs://", "");
      const metadataResponse = await fetch(
        "https://cloudflare-ipfs.com/ipfs/" + metadataHash,
      );
      const response = await metadataResponse.json();
      const imgHash = response.image.replace("ipfs://", "");
      const imgUrl = "https://cloudflare-ipfs.com/ipfs/" + imgHash;
      return imgUrl;
    }
  } catch (e) {
    console.error(e);
    return;
  }
};

export const generateBoundary = () => {
  const chars =
    "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
  let boundary = "----";

  for (let i = 0; i < 16; i++) {
    boundary += chars[Math.floor(Math.random() * chars.length)];
  }

  return boundary;
};

export const generateAlertData = (message, severity) => ({
  open: true,
  message,
  severity,
});
