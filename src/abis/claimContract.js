export const claimContractABI = [
  {
    type: "function",
    name: "DEFAULT_ADMIN_ROLE",
    inputs: [],
    outputs: [{ name: "", type: "bytes32", internalType: "bytes32" }],
    stateMutability: "view",
  },
  {
    type: "function",
    name: "PendingClaimDetails",
    inputs: [
      { name: "", type: "address", internalType: "address" },
      { name: "", type: "uint256", internalType: "uint256" },
    ],
    outputs: [
      { name: "unlockTime", type: "uint256", internalType: "uint256" },
      { name: "unlockAmount", type: "uint256", internalType: "uint256" },
    ],
    stateMutability: "view",
  },
  {
    type: "function",
    name: "addAdmin",
    inputs: [{ name: "_admin", type: "address", internalType: "address" }],
    outputs: [],
    stateMutability: "nonpayable",
  },
  {
    type: "function",
    name: "changeCooldownTime",
    inputs: [
      {
        name: "_coolDownTime",
        type: "uint256",
        internalType: "uint256",
      },
    ],
    outputs: [],
    stateMutability: "nonpayable",
  },
  {
    type: "function",
    name: "changeMaxClaimAmount",
    inputs: [
      {
        name: "_newMaxClaimAmount",
        type: "uint256",
        internalType: "uint256",
      },
    ],
    outputs: [],
    stateMutability: "nonpayable",
  },
  {
    type: "function",
    name: "changeRoot",
    inputs: [{ name: "_newRoot", type: "bytes32", internalType: "bytes32" }],
    outputs: [],
    stateMutability: "nonpayable",
  },
  {
    type: "function",
    name: "changeStartAndEndTime",
    inputs: [
      { name: "_startTime", type: "uint256", internalType: "uint256" },
      { name: "_endTime", type: "uint256", internalType: "uint256" },
    ],
    outputs: [],
    stateMutability: "nonpayable",
  },
  {
    type: "function",
    name: "claim",
    inputs: [
      { name: "_amount", type: "uint256", internalType: "uint256" },
      { name: "_receiver", type: "address", internalType: "address" },
      {
        name: "_merkleProof",
        type: "bytes32[]",
        internalType: "bytes32[]",
      },
      { name: "_encodedData", type: "bytes", internalType: "bytes" },
      { name: "_tokenId", type: "uint256", internalType: "uint256" },
      { name: "signal", type: "address", internalType: "address" },
      { name: "root", type: "uint256", internalType: "uint256" },
      {
        name: "nullifierHash",
        type: "uint256",
        internalType: "uint256",
      },
      { name: "proof", type: "uint256[8]", internalType: "uint256[8]" },
    ],
    outputs: [],
    stateMutability: "payable",
  },
  {
    type: "function",
    name: "claimAllPending",
    inputs: [{ name: "_receiver", type: "address", internalType: "address" }],
    outputs: [],
    stateMutability: "nonpayable",
  },
  {
    type: "function",
    name: "claimAmount",
    inputs: [{ name: "", type: "address", internalType: "address" }],
    outputs: [{ name: "", type: "uint256", internalType: "uint256" }],
    stateMutability: "view",
  },
  {
    type: "function",
    name: "claimBalance",
    inputs: [],
    outputs: [{ name: "", type: "uint256", internalType: "uint256" }],
    stateMutability: "view",
  },
  {
    type: "function",
    name: "claimSettings",
    inputs: [],
    outputs: [
      { name: "name", type: "string", internalType: "string" },
      {
        name: "creatorAddress",
        type: "address",
        internalType: "address",
      },
      {
        name: "walletAddress",
        type: "address",
        internalType: "address",
      },
      {
        name: "airdropToken",
        type: "address",
        internalType: "address",
      },
      { name: "daoToken", type: "address", internalType: "address" },
      {
        name: "tokenGatingValue",
        type: "uint256",
        internalType: "uint256",
      },
      { name: "startTime", type: "uint256", internalType: "uint256" },
      { name: "endTime", type: "uint256", internalType: "uint256" },
      {
        name: "cooldownTime",
        type: "uint256",
        internalType: "uint256",
      },
      {
        name: "hasAllowanceMechanism",
        type: "bool",
        internalType: "bool",
      },
      { name: "isEnabled", type: "bool", internalType: "bool" },
      { name: "merkleRoot", type: "bytes32", internalType: "bytes32" },
      {
        name: "permission",
        type: "uint8",
        internalType: "enum CLAIM_PERMISSION",
      },
      {
        name: "claimAmountDetails",
        type: "tuple",
        internalType: "struct ClaimAmountDetails",
        components: [
          {
            name: "maxClaimable",
            type: "uint256",
            internalType: "uint256",
          },
          {
            name: "totalClaimAmount",
            type: "uint256",
            internalType: "uint256",
          },
        ],
      },
      {
        name: "worldIdSettings",
        type: "tuple",
        internalType: "struct WorldIdSettings",
        components: [
          { name: "worldId", type: "address", internalType: "address" },
          { name: "appId", type: "string", internalType: "string" },
          { name: "actionId", type: "string", internalType: "string" },
        ],
      },
    ],
    stateMutability: "view",
  },
  {
    type: "function",
    name: "depositTokens",
    inputs: [
      { name: "_amount", type: "uint256", internalType: "uint256" },
      { name: "_newRoot", type: "bytes32", internalType: "bytes32" },
    ],
    outputs: [],
    stateMutability: "nonpayable",
  },
  {
    type: "function",
    name: "encode",
    inputs: [
      {
        name: "_userAddress",
        type: "address",
        internalType: "address",
      },
      { name: "_amount", type: "uint256", internalType: "uint256" },
    ],
    outputs: [{ name: "", type: "bytes", internalType: "bytes" }],
    stateMutability: "pure",
  },
  {
    type: "function",
    name: "getRoleAdmin",
    inputs: [{ name: "role", type: "bytes32", internalType: "bytes32" }],
    outputs: [{ name: "", type: "bytes32", internalType: "bytes32" }],
    stateMutability: "view",
  },
  {
    type: "function",
    name: "grantRole",
    inputs: [
      { name: "role", type: "bytes32", internalType: "bytes32" },
      { name: "account", type: "address", internalType: "address" },
    ],
    outputs: [],
    stateMutability: "nonpayable",
  },
  {
    type: "function",
    name: "hasRole",
    inputs: [
      { name: "role", type: "bytes32", internalType: "bytes32" },
      { name: "account", type: "address", internalType: "address" },
    ],
    outputs: [{ name: "", type: "bool", internalType: "bool" }],
    stateMutability: "view",
  },
  {
    type: "function",
    name: "initialize",
    inputs: [
      { name: "_admin", type: "address", internalType: "address" },
      {
        name: "_claimSettings",
        type: "tuple",
        internalType: "struct ClaimSettings",
        components: [
          { name: "name", type: "string", internalType: "string" },
          {
            name: "creatorAddress",
            type: "address",
            internalType: "address",
          },
          {
            name: "walletAddress",
            type: "address",
            internalType: "address",
          },
          {
            name: "airdropToken",
            type: "address",
            internalType: "address",
          },
          {
            name: "daoToken",
            type: "address",
            internalType: "address",
          },
          {
            name: "tokenGatingValue",
            type: "uint256",
            internalType: "uint256",
          },
          {
            name: "startTime",
            type: "uint256",
            internalType: "uint256",
          },
          { name: "endTime", type: "uint256", internalType: "uint256" },
          {
            name: "cooldownTime",
            type: "uint256",
            internalType: "uint256",
          },
          {
            name: "hasAllowanceMechanism",
            type: "bool",
            internalType: "bool",
          },
          { name: "isEnabled", type: "bool", internalType: "bool" },
          {
            name: "merkleRoot",
            type: "bytes32",
            internalType: "bytes32",
          },
          {
            name: "permission",
            type: "uint8",
            internalType: "enum CLAIM_PERMISSION",
          },
          {
            name: "claimAmountDetails",
            type: "tuple",
            internalType: "struct ClaimAmountDetails",
            components: [
              {
                name: "maxClaimable",
                type: "uint256",
                internalType: "uint256",
              },
              {
                name: "totalClaimAmount",
                type: "uint256",
                internalType: "uint256",
              },
            ],
          },
          {
            name: "worldIdSettings",
            type: "tuple",
            internalType: "struct WorldIdSettings",
            components: [
              {
                name: "worldId",
                type: "address",
                internalType: "address",
              },
              { name: "appId", type: "string", internalType: "string" },
              {
                name: "actionId",
                type: "string",
                internalType: "string",
              },
            ],
          },
        ],
      },
      { name: "_factory", type: "address", internalType: "address" },
      { name: "_emitter", type: "address", internalType: "address" },
    ],
    outputs: [],
    stateMutability: "nonpayable",
  },
  {
    type: "function",
    name: "renounceRole",
    inputs: [
      { name: "role", type: "bytes32", internalType: "bytes32" },
      { name: "account", type: "address", internalType: "address" },
    ],
    outputs: [],
    stateMutability: "nonpayable",
  },
  {
    type: "function",
    name: "revokeRole",
    inputs: [
      { name: "role", type: "bytes32", internalType: "bytes32" },
      { name: "account", type: "address", internalType: "address" },
    ],
    outputs: [],
    stateMutability: "nonpayable",
  },
  {
    type: "function",
    name: "rollbackTokens",
    inputs: [
      { name: "_amount", type: "uint256", internalType: "uint256" },
      {
        name: "rollbackAddress",
        type: "address",
        internalType: "address",
      },
    ],
    outputs: [],
    stateMutability: "nonpayable",
  },
  {
    type: "function",
    name: "supportsInterface",
    inputs: [{ name: "interfaceId", type: "bytes4", internalType: "bytes4" }],
    outputs: [{ name: "", type: "bool", internalType: "bool" }],
    stateMutability: "view",
  },
  {
    type: "function",
    name: "toggleClaim",
    inputs: [],
    outputs: [],
    stateMutability: "nonpayable",
  },
  {
    type: "event",
    name: "Initialized",
    inputs: [
      {
        name: "version",
        type: "uint8",
        indexed: false,
        internalType: "uint8",
      },
    ],
    anonymous: false,
  },
  {
    type: "event",
    name: "RoleAdminChanged",
    inputs: [
      {
        name: "role",
        type: "bytes32",
        indexed: true,
        internalType: "bytes32",
      },
      {
        name: "previousAdminRole",
        type: "bytes32",
        indexed: true,
        internalType: "bytes32",
      },
      {
        name: "newAdminRole",
        type: "bytes32",
        indexed: true,
        internalType: "bytes32",
      },
    ],
    anonymous: false,
  },
  {
    type: "event",
    name: "RoleGranted",
    inputs: [
      {
        name: "role",
        type: "bytes32",
        indexed: true,
        internalType: "bytes32",
      },
      {
        name: "account",
        type: "address",
        indexed: true,
        internalType: "address",
      },
      {
        name: "sender",
        type: "address",
        indexed: true,
        internalType: "address",
      },
    ],
    anonymous: false,
  },
  {
    type: "event",
    name: "RoleRevoked",
    inputs: [
      {
        name: "role",
        type: "bytes32",
        indexed: true,
        internalType: "bytes32",
      },
      {
        name: "account",
        type: "address",
        indexed: true,
        internalType: "address",
      },
      {
        name: "sender",
        type: "address",
        indexed: true,
        internalType: "address",
      },
    ],
    anonymous: false,
  },
  {
    type: "event",
    name: "Verified",
    inputs: [
      {
        name: "nullifierHash",
        type: "uint256",
        indexed: false,
        internalType: "uint256",
      },
    ],
    anonymous: false,
  },
  { type: "error", name: "ClaimClosed", inputs: [] },
  { type: "error", name: "ClaimNotStarted", inputs: [] },
  {
    type: "error",
    name: "DuplicateNullifier",
    inputs: [
      {
        name: "nullifierHash",
        type: "uint256",
        internalType: "uint256",
      },
    ],
  },
  { type: "error", name: "HasAllowanceMechanism", inputs: [] },
  { type: "error", name: "IncorrectProof", inputs: [] },
  { type: "error", name: "IncorrectUserAddress", inputs: [] },
  { type: "error", name: "InsufficientBalance", inputs: [] },
  { type: "error", name: "InvalidAmount", inputs: [] },
  { type: "error", name: "InvalidTime", inputs: [] },
  { type: "error", name: "MaxReached", inputs: [] },
];
