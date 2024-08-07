export const factoryContractCCABI = [
  {
    inputs: [
      {
        internalType: "string",
        name: "_param",
        type: "string",
      },
      {
        internalType: "address",
        name: "_address",
        type: "address",
      },
    ],
    name: "AddressInvalid",
    type: "error",
  },
  {
    inputs: [
      {
        internalType: "string",
        name: "_param",
        type: "string",
      },
      {
        internalType: "uint256",
        name: "_amount",
        type: "uint256",
      },
    ],
    name: "AmountInvalid",
    type: "error",
  },
  {
    inputs: [
      {
        internalType: "uint256",
        name: "_length1",
        type: "uint256",
      },
      {
        internalType: "uint256",
        name: "_length2",
        type: "uint256",
      },
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
  {
    inputs: [],
    name: "DepositClosed",
    type: "error",
  },
  {
    inputs: [],
    name: "DepositStarted",
    type: "error",
  },
  {
    inputs: [],
    name: "IncorrectProof",
    type: "error",
  },
  {
    inputs: [
      {
        internalType: "uint256",
        name: "required",
        type: "uint256",
      },
      {
        internalType: "uint256",
        name: "current",
        type: "uint256",
      },
    ],
    name: "InsufficientAllowance",
    type: "error",
  },
  {
    inputs: [],
    name: "InsufficientBalance",
    type: "error",
  },
  {
    inputs: [],
    name: "InsufficientFees",
    type: "error",
  },
  {
    inputs: [],
    name: "InsufficientFunds",
    type: "error",
  },
  {
    inputs: [],
    name: "InvalidData",
    type: "error",
  },
  {
    inputs: [
      {
        internalType: "uint256",
        name: "_length",
        type: "uint256",
      },
    ],
    name: "Max4TokensAllowed",
    type: "error",
  },
  {
    inputs: [],
    name: "MaxTokensMinted",
    type: "error",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "_user",
        type: "address",
      },
    ],
    name: "MaxTokensMintedForUser",
    type: "error",
  },
  {
    inputs: [],
    name: "MintingNotOpen",
    type: "error",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "_user",
        type: "address",
      },
    ],
    name: "NoAccess",
    type: "error",
  },
  {
    inputs: [],
    name: "NotDefaultChain",
    type: "error",
  },
  {
    inputs: [],
    name: "NotERC20Template",
    type: "error",
  },
  {
    inputs: [],
    name: "NotWhitelisted",
    type: "error",
  },
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
        name: "token",
        type: "address",
      },
      {
        internalType: "uint256",
        name: "amount",
        type: "uint256",
      },
    ],
    name: "amountToLD",
    outputs: [
      {
        internalType: "uint256",
        name: "",
        type: "uint256",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "token",
        type: "address",
      },
      {
        internalType: "uint256",
        name: "amount",
        type: "uint256",
      },
    ],
    name: "amountToSD",
    outputs: [
      {
        internalType: "uint256",
        name: "",
        type: "uint256",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address payable",
        name: "_daoAddress",
        type: "address",
      },
      {
        internalType: "uint256",
        name: "_numOfTokensToBuy",
        type: "uint256",
      },
      {
        internalType: "bytes32[]",
        name: "_merkleProof",
        type: "bytes32[]",
      },
    ],
    name: "buyGovernanceTokenERC20DAO",
    outputs: [],
    stateMutability: "payable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address payable",
        name: "_daoAddress",
        type: "address",
      },
      {
        internalType: "string",
        name: "_tokenURI",
        type: "string",
      },
      {
        internalType: "uint256",
        name: "_numOfTokensToBuy",
        type: "uint256",
      },
      {
        internalType: "bytes32[]",
        name: "_merkleProof",
        type: "bytes32[]",
      },
    ],
    name: "buyGovernanceTokenERC721DAO",
    outputs: [],
    stateMutability: "payable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "_daoAddress",
        type: "address",
      },
      {
        internalType: "bytes32",
        name: "_newMerkleRoot",
        type: "bytes32",
      },
    ],
    name: "changeMerkleRoot",
    outputs: [],
    stateMutability: "payable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "_newOwner",
        type: "address",
      },
    ],
    name: "changeOwner",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "uint16",
        name: "_commLayerId",
        type: "uint16",
      },
      {
        internalType: "uint256",
        name: "_distributionAmount",
        type: "uint256",
      },
      {
        internalType: "uint256",
        name: "_pricePerToken",
        type: "uint256",
      },
      {
        internalType: "uint256",
        name: "_minDepositPerUser",
        type: "uint256",
      },
      {
        internalType: "uint256",
        name: "_maxDepositPerUser",
        type: "uint256",
      },
      {
        internalType: "uint256",
        name: "_ownerFeePerDepositPercent",
        type: "uint256",
      },
      {
        internalType: "uint256",
        name: "_depositTime",
        type: "uint256",
      },
      {
        internalType: "uint256",
        name: "_quorumPercent",
        type: "uint256",
      },
      {
        internalType: "uint256",
        name: "_thresholdPercent",
        type: "uint256",
      },
      {
        internalType: "uint256",
        name: "_safeThreshold",
        type: "uint256",
      },
      {
        internalType: "uint256[]",
        name: "_depositChainIds",
        type: "uint256[]",
      },
      {
        internalType: "address",
        name: "_daoAddress",
        type: "address",
      },
      {
        internalType: "address",
        name: "_depositTokenAddress",
        type: "address",
      },
      {
        internalType: "address[]",
        name: "_admins",
        type: "address[]",
      },
      {
        internalType: "bool",
        name: "_onlyAllowWhitelist",
        type: "bool",
      },
      {
        internalType: "bytes32",
        name: "_merkleRoot",
        type: "bytes32",
      },
    ],
    name: "createCrossChainERC20DAO",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "uint16",
        name: "_commLayerId",
        type: "uint16",
      },
      {
        internalType: "uint256",
        name: "_ownerFeePerDepositPercent",
        type: "uint256",
      },
      {
        internalType: "uint256",
        name: "_depositTime",
        type: "uint256",
      },
      {
        internalType: "uint256",
        name: "_quorumPercent",
        type: "uint256",
      },
      {
        internalType: "uint256",
        name: "_thresholdPercent",
        type: "uint256",
      },
      {
        internalType: "uint256",
        name: "_safeThreshold",
        type: "uint256",
      },
      {
        internalType: "uint256[]",
        name: "_depoitChainIds",
        type: "uint256[]",
      },
      {
        internalType: "address",
        name: "_daoAddress",
        type: "address",
      },
      {
        internalType: "address",
        name: "_depositTokenAddress",
        type: "address",
      },
      {
        internalType: "address[]",
        name: "_admins",
        type: "address[]",
      },
      {
        internalType: "uint256",
        name: "_maxTokensPerUser",
        type: "uint256",
      },
      {
        internalType: "uint256",
        name: "_distributionAmount",
        type: "uint256",
      },
      {
        internalType: "uint256",
        name: "_pricePerToken",
        type: "uint256",
      },
      {
        internalType: "bool",
        name: "_onlyAllowWhitelist",
        type: "bool",
      },
      {
        internalType: "bytes32",
        name: "_merkleRoot",
        type: "bytes32",
      },
    ],
    name: "createCrossChainERC721DAO",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "string",
        name: "_DaoName",
        type: "string",
      },
      {
        internalType: "string",
        name: "_DaoSymbol",
        type: "string",
      },
      {
        internalType: "uint16",
        name: "_commLayerId",
        type: "uint16",
      },
      {
        internalType: "uint256",
        name: "_distributionAmount",
        type: "uint256",
      },
      {
        internalType: "uint256",
        name: "_pricePerToken",
        type: "uint256",
      },
      {
        internalType: "uint256",
        name: "_minDepositPerUser",
        type: "uint256",
      },
      {
        internalType: "uint256",
        name: "_maxDepositPerUser",
        type: "uint256",
      },
      {
        internalType: "uint256",
        name: "_ownerFeePerDepositPercent",
        type: "uint256",
      },
      {
        internalType: "uint256",
        name: "_depositTime",
        type: "uint256",
      },
      {
        internalType: "uint256",
        name: "_quorumPercent",
        type: "uint256",
      },
      {
        internalType: "uint256",
        name: "_thresholdPercent",
        type: "uint256",
      },
      {
        internalType: "uint256",
        name: "_safeThreshold",
        type: "uint256",
      },
      {
        internalType: "uint256[]",
        name: "_depositChainIds",
        type: "uint256[]",
      },
      {
        internalType: "address",
        name: "_gnosisAddress",
        type: "address",
      },
      {
        internalType: "address[]",
        name: "_depositTokenAddress",
        type: "address[]",
      },
      {
        internalType: "address[]",
        name: "_admins",
        type: "address[]",
      },
      {
        internalType: "bool",
        name: "_isGovernanceActive",
        type: "bool",
      },
      {
        internalType: "bool",
        name: "_isTransferable",
        type: "bool",
      },
      {
        internalType: "bool",
        name: "_onlyAllowWhitelist",
        type: "bool",
      },
      {
        internalType: "bool",
        name: "_assetsStoredOnGnosis",
        type: "bool",
      },
      {
        internalType: "bytes32",
        name: "_merkleRoot",
        type: "bytes32",
      },
    ],
    name: "createERC20DAO",
    outputs: [],
    stateMutability: "payable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "string",
        name: "_DaoName",
        type: "string",
      },
      {
        internalType: "string",
        name: "_DaoSymbol",
        type: "string",
      },
      {
        internalType: "string",
        name: "_tokenURI",
        type: "string",
      },
      {
        internalType: "uint16",
        name: "_commLayerId",
        type: "uint16",
      },
      {
        internalType: "uint256",
        name: "_ownerFeePerDepositPercent",
        type: "uint256",
      },
      {
        internalType: "uint256",
        name: "_depositTime",
        type: "uint256",
      },
      {
        internalType: "uint256",
        name: "_quorumPercent",
        type: "uint256",
      },
      {
        internalType: "uint256",
        name: "_thresholdPercent",
        type: "uint256",
      },
      {
        internalType: "uint256",
        name: "_safeThreshold",
        type: "uint256",
      },
      {
        internalType: "uint256[]",
        name: "_depositChainIds",
        type: "uint256[]",
      },
      {
        internalType: "address",
        name: "_gnosisAddress",
        type: "address",
      },
      {
        internalType: "address[]",
        name: "_depositTokenAddress",
        type: "address[]",
      },
      {
        internalType: "address[]",
        name: "_admins",
        type: "address[]",
      },
      {
        internalType: "uint256",
        name: "_maxTokensPerUser",
        type: "uint256",
      },
      {
        internalType: "uint256",
        name: "_distributionAmount",
        type: "uint256",
      },
      {
        internalType: "uint256",
        name: "_pricePerToken",
        type: "uint256",
      },
      {
        internalType: "bool",
        name: "_isNftTransferable",
        type: "bool",
      },
      {
        internalType: "bool",
        name: "_isNftTotalSupplyUnlimited",
        type: "bool",
      },
      {
        internalType: "bool",
        name: "_isGovernanceActive",
        type: "bool",
      },
      {
        internalType: "bool",
        name: "_onlyAllowWhitelist",
        type: "bool",
      },
      {
        internalType: "bool",
        name: "_assetsStoredOnGnosis",
        type: "bool",
      },
      {
        internalType: "bytes32",
        name: "_merkleRoot",
        type: "bytes32",
      },
    ],
    name: "createERC721DAO",
    outputs: [],
    stateMutability: "payable",
    type: "function",
  },
  {
    inputs: [],
    name: "createFees",
    outputs: [
      {
        internalType: "uint256",
        name: "",
        type: "uint256",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address payable",
        name: "_daoAddress",
        type: "address",
      },
      {
        internalType: "string",
        name: "_tokenURI",
        type: "string",
      },
      {
        internalType: "uint16",
        name: "_commLayerId",
        type: "uint16",
      },
      {
        internalType: "uint256",
        name: "_numOfTokensToBuy",
        type: "uint256",
      },
      {
        internalType: "bytes",
        name: "_extraParams",
        type: "bytes",
      },
      {
        internalType: "bytes32[]",
        name: "_merkleProof",
        type: "bytes32[]",
      },
    ],
    name: "crossChainBuy",
    outputs: [],
    stateMutability: "payable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address payable",
        name: "_daoAddress",
        type: "address",
      },
      {
        internalType: "uint256",
        name: "_numOfTokensToBuy",
        type: "uint256",
      },
      {
        internalType: "string",
        name: "_tokenURI",
        type: "string",
      },
      {
        internalType: "bytes32[]",
        name: "_merkleProof",
        type: "bytes32[]",
      },
    ],
    name: "crossChainMint",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "_emitter",
        type: "address",
      },
      {
        internalType: "address",
        name: "_deployer",
        type: "address",
      },
      {
        internalType: "address",
        name: "_commLayer",
        type: "address",
      },
    ],
    name: "defineTokenContracts",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [],
    name: "depositFees",
    outputs: [
      {
        internalType: "uint256",
        name: "",
        type: "uint256",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "_daoAddress",
        type: "address",
      },
    ],
    name: "disableTokenGating",
    outputs: [],
    stateMutability: "payable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "_daoAddress",
        type: "address",
      },
    ],
    name: "getDAOdetails",
    outputs: [
      {
        components: [
          {
            internalType: "uint256",
            name: "pricePerToken",
            type: "uint256",
          },
          {
            internalType: "uint256",
            name: "distributionAmount",
            type: "uint256",
          },
          {
            internalType: "uint256",
            name: "minDepositPerUser",
            type: "uint256",
          },
          {
            internalType: "uint256",
            name: "maxDepositPerUser",
            type: "uint256",
          },
          {
            internalType: "uint256",
            name: "ownerFeePerDepositPercent",
            type: "uint256",
          },
          {
            internalType: "uint256",
            name: "depositCloseTime",
            type: "uint256",
          },
          {
            internalType: "address",
            name: "depositTokenAddress",
            type: "address",
          },
          {
            internalType: "address",
            name: "gnosisAddress",
            type: "address",
          },
          {
            internalType: "bytes32",
            name: "merkleRoot",
            type: "bytes32",
          },
          {
            internalType: "bool",
            name: "isDeployedByFactory",
            type: "bool",
          },
          {
            internalType: "bool",
            name: "isTokenGatingApplied",
            type: "bool",
          },
          {
            internalType: "bool",
            name: "assetsStoredOnGnosis",
            type: "bool",
          },
        ],
        internalType: "struct Helper.DAODetails",
        name: "",
        type: "tuple",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "_daoAddress",
        type: "address",
      },
    ],
    name: "getTokenGatingDetails",
    outputs: [
      {
        components: [
          {
            internalType: "address[]",
            name: "tokens",
            type: "address[]",
          },
          {
            internalType: "enum Helper.Operator",
            name: "operator",
            type: "uint8",
          },
          {
            internalType: "uint256[]",
            name: "value",
            type: "uint256[]",
          },
        ],
        internalType: "struct Helper.TokenGatingCondition",
        name: "",
        type: "tuple",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "initialize",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [],
    name: "platformFeeMultiplier",
    outputs: [
      {
        internalType: "uint256",
        name: "",
        type: "uint256",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "tokenAddr",
        type: "address",
      },
    ],
    name: "rescueFunds",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address[]",
        name: "_tokens",
        type: "address[]",
      },
      {
        internalType: "enum Helper.Operator",
        name: "_operator",
        type: "uint8",
      },
      {
        internalType: "uint256[]",
        name: "_value",
        type: "uint256[]",
      },
      {
        internalType: "address payable",
        name: "_daoAddress",
        type: "address",
      },
    ],
    name: "setupTokenGating",
    outputs: [],
    stateMutability: "payable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "_daoAddress",
        type: "address",
      },
    ],
    name: "toggleKYC",
    outputs: [],
    stateMutability: "payable",
    type: "function",
  },
  {
    inputs: [],
    name: "togglePaused",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "uint256",
        name: "_depositTime",
        type: "uint256",
      },
      {
        internalType: "address",
        name: "_daoAddress",
        type: "address",
      },
    ],
    name: "updateDepositTime",
    outputs: [],
    stateMutability: "payable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "uint256",
        name: "_createFees",
        type: "uint256",
      },
      {
        internalType: "uint256",
        name: "_depositFees",
        type: "uint256",
      },
      {
        internalType: "uint256",
        name: "_val",
        type: "uint256",
      },
    ],
    name: "updateFees",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "uint256",
        name: "_minDepositPerUser",
        type: "uint256",
      },
      {
        internalType: "uint256",
        name: "_maxDepositPerUser",
        type: "uint256",
      },
      {
        internalType: "address",
        name: "_daoAddress",
        type: "address",
      },
    ],
    name: "updateMinMaxDeposit",
    outputs: [],
    stateMutability: "payable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "uint256",
        name: "_ownerFeePerDeposit",
        type: "uint256",
      },
      {
        internalType: "address",
        name: "_daoAddress",
        type: "address",
      },
    ],
    name: "updateOwnerFee",
    outputs: [],
    stateMutability: "payable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "uint256",
        name: "_newDistributionAmount",
        type: "uint256",
      },
      {
        internalType: "uint256",
        name: "_newPricePerToken",
        type: "uint256",
      },
      {
        internalType: "address",
        name: "_daoAddress",
        type: "address",
      },
    ],
    name: "updateTotalRaiseAmount",
    outputs: [],
    stateMutability: "payable",
    type: "function",
  },
];
