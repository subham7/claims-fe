export const proposalActionCommands = {
  0: "Reward shares to members",
  1: "Mint club token",
  2: "Modify governance",
  3: "Update total raise amount",
  4: "Send assets to an address",
  5: "Send nft to an address",
  6: "Add multisig signer",
  7: "Remove multisig signer",
  // 8: "Buy an NFT via Opensea",
  // 9: "Sell nft",
  10: "Whitelist addresses",
  11: "Whitelist Lens profile followers",
  12: "Whitelist addresses who commented on Lens post",
  13: "Update price per share",
  // 14: "Deposit tokens in AAVE pool",
  // 15: "Withdraw tokens from AAVE pool",
  16: "Whitelist addresses who mirrored Lens post",
  // 17: "Stake tokens through stargate",
  // 18: "Unstake tokens through stargate",
  // 19: "Swap tokens through uniswap",
};

export const PROPOSAL_MENU_ITEMS = (isGovernanceActive, tokenType) => {
  return [
    {
      key: 0,
      value: "Reward shares to members",
      text: "Reward shares to members (Pro-rata)",
      section: "Administrative",
    },
    {
      key: 1,
      value: "Mint club token",
      text: "Mint station tokens",
      section: "Administrative",
    },
    {
      key: 2,
      value: "Modify governance",
      text: "Modify governance",
      section: "Administrative",
      condition: () => isGovernanceActive,
    },
    {
      key: 3,
      value: "Update total raise amount",
      text: "Update total raise amount",
      section: "Deposits",
      condition: () => tokenType !== "erc721",
    },
    {
      key: 13,
      value: "Update price per share",
      text: "Update Price per share",
      section: "Deposits",
    },
    {
      key: 4,
      value: "Send assets to an address",
      text: "Send assets to an address",
      section: "Manage Assets",
    },
    {
      key: 5,
      value: "Send nft to an address",
      text: "Send NFT",
      section: "Manage Assets",
    },
    // {
    //   key: 8,
    //   value: "Buy an NFT via Opensea",
    //   text: "Buy an NFT via Opensea",
    //   section: "Manage Assets",
    // },
    {
      key: 6,
      value: "Add multisig signer",
      text: "Add multisig signer",
      section: "Administrative",
    },
    {
      key: 7,
      value: "Remove multisig signer",
      text: "Remove multisig signer",
      section: "Administrative",
    },
    {
      key: 10,
      value: "Whitelist addresses",
      text: "Whitelist addresses",
      section: "Deposits",
    },
    {
      key: 11,
      value: "Whitelist Lens profile followers",
      text: "Whitelist Lens profile followers",
      section: "Deposits",
    },
    {
      key: 12,
      value: "Whitelist addresses who commented on Lens post",
      text: "Whitelist addresses who commented on Lens post",
      section: "Deposits",
    },
    {
      key: 16,
      value: "Whitelist addresses who mirrored Lens post",
      text: "Whitelist addresses who mirrored Lens post",
      section: "Deposits",
    },
    // {
    //   key: 14,
    //   value: "Deposit tokens in AAVE pool",
    //   text: "AAVE Pool - Deposit",
    //   section: "DeFi Pools",
    // },
    // {
    //   key: 15,
    //   value: "Withdraw tokens from AAVE pool",
    //   text: "AAVE Pool - Withdraw",
    //   section: "DeFi Pools",
    // },
    // {
    //   key: 17,
    //   value: "Stake tokens through stargate",
    //   text: "Stargate - Stake",
    //   section: "DeFi Pools",
    // },
    // {
    //   key: 18,
    //   value: "Unstake tokens through stargate",
    //   text: "Stargate - Unstake",
    //   section: "DeFi Pools",
    // },
    // {
    //   key: 19,
    //   value: "Swap tokens through uniswap",
    //   text: "Uniswap - Swap",
    //   section: "Manage Assets",
    // },
  ];
};
