export const renzoStakingPoolABI = [
  { inputs: [], stateMutability: "nonpayable", type: "constructor" },
  { inputs: [], name: "AlreadyAdded", type: "error" },
  { inputs: [], name: "ContractPaused", type: "error" },
  {
    inputs: [
      { internalType: "uint8", name: "expected", type: "uint8" },
      { internalType: "uint8", name: "actual", type: "uint8" },
    ],
    name: "InvalidTokenDecimals",
    type: "error",
  },
  { inputs: [], name: "InvalidZeroInput", type: "error" },
  { inputs: [], name: "MaxTVLReached", type: "error" },
  { inputs: [], name: "NotDepositQueue", type: "error" },
  { inputs: [], name: "NotDepositWithdrawPauser", type: "error" },
  { inputs: [], name: "NotFound", type: "error" },
  {
    inputs: [
      { internalType: "address", name: "expectedCaller", type: "address" },
    ],
    name: "NotOriginalWithdrawCaller",
    type: "error",
  },
  { inputs: [], name: "NotRestakeManagerAdmin", type: "error" },
  { inputs: [], name: "OverMaxBasisPoints", type: "error" },
  { inputs: [], name: "WithdrawAlreadyCompleted", type: "error" },
  {
    anonymous: false,
    inputs: [
      {
        indexed: false,
        internalType: "contract IERC20",
        name: "token",
        type: "address",
      },
    ],
    name: "CollateralTokenAdded",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: false,
        internalType: "contract IERC20",
        name: "token",
        type: "address",
      },
    ],
    name: "CollateralTokenRemoved",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: false,
        internalType: "address",
        name: "depositor",
        type: "address",
      },
      {
        indexed: false,
        internalType: "contract IERC20",
        name: "token",
        type: "address",
      },
      {
        indexed: false,
        internalType: "uint256",
        name: "amount",
        type: "uint256",
      },
      {
        indexed: false,
        internalType: "uint256",
        name: "ezETHMinted",
        type: "uint256",
      },
      {
        indexed: false,
        internalType: "uint256",
        name: "referralId",
        type: "uint256",
      },
    ],
    name: "Deposit",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      { indexed: false, internalType: "uint8", name: "version", type: "uint8" },
    ],
    name: "Initialized",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: false,
        internalType: "contract IOperatorDelegator",
        name: "od",
        type: "address",
      },
    ],
    name: "OperatorDelegatorAdded",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: false,
        internalType: "contract IOperatorDelegator",
        name: "od",
        type: "address",
      },
      {
        indexed: false,
        internalType: "uint256",
        name: "allocation",
        type: "uint256",
      },
    ],
    name: "OperatorDelegatorAllocationUpdated",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: false,
        internalType: "contract IOperatorDelegator",
        name: "od",
        type: "address",
      },
    ],
    name: "OperatorDelegatorRemoved",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: false,
        internalType: "bytes32",
        name: "withdrawalRoot",
        type: "bytes32",
      },
      {
        indexed: false,
        internalType: "address",
        name: "withdrawer",
        type: "address",
      },
      {
        indexed: false,
        internalType: "contract IERC20",
        name: "token",
        type: "address",
      },
      {
        indexed: false,
        internalType: "uint256",
        name: "amount",
        type: "uint256",
      },
      {
        indexed: false,
        internalType: "uint256",
        name: "ezETHBurned",
        type: "uint256",
      },
    ],
    name: "UserWithdrawCompleted",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: false,
        internalType: "bytes32",
        name: "withdrawalRoot",
        type: "bytes32",
      },
      {
        indexed: false,
        internalType: "address",
        name: "withdrawer",
        type: "address",
      },
      {
        indexed: false,
        internalType: "contract IERC20",
        name: "token",
        type: "address",
      },
      {
        indexed: false,
        internalType: "uint256",
        name: "amount",
        type: "uint256",
      },
      {
        indexed: false,
        internalType: "uint256",
        name: "ezETHToBurn",
        type: "uint256",
      },
    ],
    name: "UserWithdrawStarted",
    type: "event",
  },
  {
    inputs: [
      {
        internalType: "contract IERC20",
        name: "_newCollateralToken",
        type: "address",
      },
    ],
    name: "addCollateralToken",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "contract IOperatorDelegator",
        name: "_newOperatorDelegator",
        type: "address",
      },
      {
        internalType: "uint256",
        name: "_allocationBasisPoints",
        type: "uint256",
      },
    ],
    name: "addOperatorDelegator",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [],
    name: "calculateTVLs",
    outputs: [
      { internalType: "uint256[][]", name: "", type: "uint256[][]" },
      { internalType: "uint256[]", name: "", type: "uint256[]" },
      { internalType: "uint256", name: "", type: "uint256" },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      { internalType: "uint256[]", name: "tvls", type: "uint256[]" },
      { internalType: "uint256", name: "totalTVL", type: "uint256" },
    ],
    name: "chooseOperatorDelegatorForDeposit",
    outputs: [
      {
        internalType: "contract IOperatorDelegator",
        name: "",
        type: "address",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      { internalType: "uint256", name: "tokenIndex", type: "uint256" },
      { internalType: "uint256", name: "ezETHValue", type: "uint256" },
      {
        internalType: "uint256[][]",
        name: "operatorDelegatorTokenTVLs",
        type: "uint256[][]",
      },
      {
        internalType: "uint256[]",
        name: "operatorDelegatorTVLs",
        type: "uint256[]",
      },
      { internalType: "uint256", name: "totalTVL", type: "uint256" },
    ],
    name: "chooseOperatorDelegatorForWithdraw",
    outputs: [
      {
        internalType: "contract IOperatorDelegator",
        name: "",
        type: "address",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [{ internalType: "uint256", name: "", type: "uint256" }],
    name: "collateralTokens",
    outputs: [{ internalType: "contract IERC20", name: "", type: "address" }],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        components: [
          {
            internalType: "contract IStrategy[]",
            name: "strategies",
            type: "address[]",
          },
          { internalType: "uint256[]", name: "shares", type: "uint256[]" },
          { internalType: "address", name: "depositor", type: "address" },
          {
            components: [
              { internalType: "address", name: "withdrawer", type: "address" },
              { internalType: "uint96", name: "nonce", type: "uint96" },
            ],
            internalType: "struct IStrategyManager.WithdrawerAndNonce",
            name: "withdrawerAndNonce",
            type: "tuple",
          },
          {
            internalType: "uint32",
            name: "withdrawalStartBlock",
            type: "uint32",
          },
          {
            internalType: "address",
            name: "delegatedAddress",
            type: "address",
          },
        ],
        internalType: "struct IStrategyManager.QueuedWithdrawal",
        name: "withdrawal",
        type: "tuple",
      },
      {
        internalType: "uint256",
        name: "middlewareTimesIndex",
        type: "uint256",
      },
    ],
    name: "completeWithdraw",
    outputs: [{ internalType: "uint256", name: "", type: "uint256" }],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [],
    name: "delegationManager",
    outputs: [
      {
        internalType: "contract IDelegationManager",
        name: "",
        type: "address",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "contract IERC20",
        name: "_collateralToken",
        type: "address",
      },
      { internalType: "uint256", name: "_amount", type: "uint256" },
      { internalType: "uint256", name: "_referralId", type: "uint256" },
    ],
    name: "deposit",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "contract IERC20",
        name: "_collateralToken",
        type: "address",
      },
      { internalType: "uint256", name: "_amount", type: "uint256" },
    ],
    name: "deposit",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [{ internalType: "uint256", name: "_referralId", type: "uint256" }],
    name: "depositETH",
    outputs: [],
    stateMutability: "payable",
    type: "function",
  },
  {
    inputs: [],
    name: "depositETH",
    outputs: [],
    stateMutability: "payable",
    type: "function",
  },
  {
    inputs: [],
    name: "depositQueue",
    outputs: [
      { internalType: "contract IDepositQueue", name: "", type: "address" },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      { internalType: "contract IERC20", name: "_token", type: "address" },
      { internalType: "uint256", name: "_amount", type: "uint256" },
    ],
    name: "depositTokenRewardsFromProtocol",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [],
    name: "ezETH",
    outputs: [
      { internalType: "contract IEzEthToken", name: "", type: "address" },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "contract IERC20",
        name: "_collateralToken",
        type: "address",
      },
    ],
    name: "getCollateralTokenIndex",
    outputs: [{ internalType: "uint256", name: "", type: "uint256" }],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "getCollateralTokensLength",
    outputs: [{ internalType: "uint256", name: "", type: "uint256" }],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "getOperatorDelegatorsLength",
    outputs: [{ internalType: "uint256", name: "", type: "uint256" }],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "getTotalRewardsEarned",
    outputs: [{ internalType: "uint256", name: "", type: "uint256" }],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "contract IRoleManager",
        name: "_roleManager",
        type: "address",
      },
      { internalType: "contract IEzEthToken", name: "_ezETH", type: "address" },
      {
        internalType: "contract IRenzoOracle",
        name: "_renzoOracle",
        type: "address",
      },
      {
        internalType: "contract IStrategyManager",
        name: "_strategyManager",
        type: "address",
      },
      {
        internalType: "contract IDelegationManager",
        name: "_delegationManager",
        type: "address",
      },
      {
        internalType: "contract IDepositQueue",
        name: "_depositQueue",
        type: "address",
      },
    ],
    name: "initialize",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [],
    name: "maxDepositTVL",
    outputs: [{ internalType: "uint256", name: "", type: "uint256" }],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "contract IOperatorDelegator",
        name: "",
        type: "address",
      },
    ],
    name: "operatorDelegatorAllocations",
    outputs: [{ internalType: "uint256", name: "", type: "uint256" }],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [{ internalType: "uint256", name: "", type: "uint256" }],
    name: "operatorDelegators",
    outputs: [
      {
        internalType: "contract IOperatorDelegator",
        name: "",
        type: "address",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "paused",
    outputs: [{ internalType: "bool", name: "", type: "bool" }],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [{ internalType: "bytes32", name: "", type: "bytes32" }],
    name: "pendingWithdrawals",
    outputs: [
      { internalType: "uint256", name: "ezETHToBurn", type: "uint256" },
      { internalType: "address", name: "withdrawer", type: "address" },
      {
        internalType: "contract IERC20",
        name: "tokenToWithdraw",
        type: "address",
      },
      {
        internalType: "uint256",
        name: "tokenAmountToWithdraw",
        type: "uint256",
      },
      {
        internalType: "contract IOperatorDelegator",
        name: "operatorDelegator",
        type: "address",
      },
      { internalType: "bool", name: "completed", type: "bool" },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "contract IERC20",
        name: "_collateralTokenToRemove",
        type: "address",
      },
    ],
    name: "removeCollateralToken",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "contract IOperatorDelegator",
        name: "_operatorDelegatorToRemove",
        type: "address",
      },
    ],
    name: "removeOperatorDelegator",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [],
    name: "renzoOracle",
    outputs: [
      { internalType: "contract IRenzoOracle", name: "", type: "address" },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "roleManager",
    outputs: [
      { internalType: "contract IRoleManager", name: "", type: "address" },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      { internalType: "uint256", name: "_maxDepositTVL", type: "uint256" },
    ],
    name: "setMaxDepositTVL",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "contract IOperatorDelegator",
        name: "_operatorDelegator",
        type: "address",
      },
      {
        internalType: "uint256",
        name: "_allocationBasisPoints",
        type: "uint256",
      },
    ],
    name: "setOperatorDelegatorAllocation",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [{ internalType: "bool", name: "_paused", type: "bool" }],
    name: "setPaused",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "contract IOperatorDelegator",
        name: "operatorDelegator",
        type: "address",
      },
      { internalType: "bytes", name: "pubkey", type: "bytes" },
      { internalType: "bytes", name: "signature", type: "bytes" },
      { internalType: "bytes32", name: "depositDataRoot", type: "bytes32" },
    ],
    name: "stakeEthInOperatorDelegator",
    outputs: [],
    stateMutability: "payable",
    type: "function",
  },
  {
    inputs: [
      { internalType: "uint256", name: "_ezEThToBurn", type: "uint256" },
      {
        internalType: "contract IERC20",
        name: "_tokenToWithdraw",
        type: "address",
      },
    ],
    name: "startWithdraw",
    outputs: [{ internalType: "bytes32", name: "", type: "bytes32" }],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [],
    name: "strategyManager",
    outputs: [
      { internalType: "contract IStrategyManager", name: "", type: "address" },
    ],
    stateMutability: "view",
    type: "function",
  },
];
