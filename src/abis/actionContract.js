export const actionContractABI = [
  {
    inputs: [
      {
        internalType: "address",
        name: "_emitterContractAddress",
        type: "address",
      },
    ],
    stateMutability: "nonpayable",
    type: "constructor",
  },
  {
    inputs: [
      { internalType: "string", name: "_param", type: "string" },
      { internalType: "address", name: "_address", type: "address" },
    ],
    name: "AddressInvalid",
    type: "error",
  },
  {
    inputs: [
      { internalType: "string", name: "_param", type: "string" },
      { internalType: "uint256", name: "_amount", type: "uint256" },
    ],
    name: "AmountInvalid",
    type: "error",
  },
  {
    inputs: [
      { internalType: "uint256", name: "_length1", type: "uint256" },
      { internalType: "uint256", name: "_length2", type: "uint256" },
    ],
    name: "ArrayLengthMismatch",
    type: "error",
  },
  {
    inputs: [
      {
        internalType: "uint256",
        name: "_maxDepositPerUser",
        type: "uint256",
      },
      {
        internalType: "uint256",
        name: "_minDepositPerUser",
        type: "uint256",
      },
    ],
    name: "DepositAmountInvalid",
    type: "error",
  },
  { inputs: [], name: "DepositClosed", type: "error" },
  { inputs: [], name: "DepositStarted", type: "error" },
  {
    inputs: [
      { internalType: "uint256", name: "required", type: "uint256" },
      { internalType: "uint256", name: "current", type: "uint256" },
    ],
    name: "InsufficientAllowance",
    type: "error",
  },
  { inputs: [], name: "InsufficientBalance", type: "error" },
  { inputs: [], name: "InsufficientFunds", type: "error" },
  { inputs: [], name: "InvalidData", type: "error" },
  {
    inputs: [{ internalType: "uint256", name: "_length", type: "uint256" }],
    name: "Max4TokensAllowed",
    type: "error",
  },
  { inputs: [], name: "MaxTokensMinted", type: "error" },
  {
    inputs: [{ internalType: "address", name: "_user", type: "address" }],
    name: "MaxTokensMintedForUser",
    type: "error",
  },
  { inputs: [], name: "MintingNotOpen", type: "error" },
  {
    inputs: [{ internalType: "address", name: "_user", type: "address" }],
    name: "NoAccess",
    type: "error",
  },
  { inputs: [], name: "NotERC20Template", type: "error" },
  { inputs: [], name: "NotWhitelisted", type: "error" },
  {
    inputs: [
      {
        internalType: "uint256",
        name: "_totalRaiseAmount",
        type: "uint256",
      },
      {
        internalType: "uint256",
        name: "_maxDepositPerUser",
        type: "uint256",
      },
    ],
    name: "RaiseAmountInvalid",
    type: "error",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "_airdropTokenAddress",
        type: "address",
      },
      {
        internalType: "uint256[]",
        name: "_airdropAmountArray",
        type: "uint256[]",
      },
      { internalType: "address[]", name: "_members", type: "address[]" },
    ],
    name: "airDropToken",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [],
    name: "emitterContractAddress",
    outputs: [{ internalType: "address", name: "", type: "address" }],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "_emitterContractAddress",
        type: "address",
      },
    ],
    name: "updateEmitterAddress",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
];
