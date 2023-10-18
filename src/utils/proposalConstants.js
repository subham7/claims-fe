export const proposalActionCommands = {
  0: "Distribute token to members",
  1: "Mint club token",
  2: "Update governance settings",
  3: "Change total raise amount",
  4: "Send token to an address",
  5: "Send nft to an address",
  6: "Add signer",
  7: "Remove signer",
  8: "Buy nft",
  9: "Sell nft",
  10: "Whitelist deposit",
  11: "Whitelist with lens followers",
  12: "Whitelist with lens post's comments",
  13: "Update price per token",
  14: "Deposit tokens in AAVE pool",
  15: "Withdraw tokens from AAVE pool",
  16: "Whitelist with lens post's mirror",
  17: "Stake tokens through stargate",
  18: "Unstake tokens through stargate",
  19: "Swap tokens through uniswap",
};

export const PROPOSAL_MENU_ITEMS = (isGovernanceActive, tokenType) => {
  return [
    {
      key: 0,
      value: "Distribute token to members",
      text: "Distribute Token to Members (Pro-rata)",
    },
    { key: 1, value: "Mint club token", text: "Mint Station Tokens" },
    {
      key: 2,
      value: "Update Governance Settings",
      text: "Update Governance Settings",
      condition: () => isGovernanceActive,
    },
    {
      key: 3,
      value: "Change total raise amount",
      text: "Change total raise amount",
      condition: () => tokenType !== "erc721",
    },
    { key: 4, value: "Send token to an address", text: "Send Token" },
    { key: 5, value: "Send nft to an address", text: "Send NFT" },
    { key: 6, value: "Add signer", text: "Add Station Signer" },
    { key: 7, value: "Remove signer", text: "Remove Station signer" },
    { key: 8, value: "Buy nft", text: "Remove Station signer" },
    { key: 10, value: "Whitelist deposit", text: "Gate Deposit - CSV" },
    {
      key: 11,
      value: "Whitelist with lens followers",
      text: "Gate Deposit - Lens Followers",
    },
    {
      key: 12,
      value: "Whitelist with lens post's comments",
      text: "Gate Deposit - Lens Post Comments",
    },
    {
      key: 13,
      value: "Update price per token",
      text: "Update Price per Token",
    },
    {
      key: 14,
      value: "Deposit tokens in AAVE pool",
      text: "AAVE Pool - Deposit",
    },
    {
      key: 15,
      value: "Withdraw tokens from AAVE pool",
      text: " AAVE Pool - Withdraw",
    },
    {
      key: 16,
      value: "Whitelist with lens post's mirror",
      text: "Gate Deposit - Lens Post Mirror",
    },
    {
      key: 17,
      value: "Stake tokens through stargate",
      text: "Stake tokens through stargate",
    },
    {
      key: 18,
      value: "Unstake tokens through stargate",
      text: "Unstake tokens through stargate",
    },
    {
      key: 19,
      value: "Swap tokens through uniswap",
      text: "Swap tokens through uniswap",
    },
  ];
};
