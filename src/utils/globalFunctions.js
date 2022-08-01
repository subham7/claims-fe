export const calculateUserSharePercentage = (balance, total) => {
  // function for calculating the balance percentage of the users share
  return parseFloat(balance) / parseFloat(web3.utils.fromWei(total)) * 100
}

export const convertAmountToWei = (value) => {
  // function for converting the amount from Wei format
  return web3.utils.fromWei(value)
}

export const calculateTreasuryTargetShare = (treasuryBalance, totalSupply) => {
  // function for calculating the percentage of current tokens minted so far from the total target token supply
  return parseInt(web3.utils.fromWei(treasuryBalance)) / parseInt(totalSupply) * 100
}