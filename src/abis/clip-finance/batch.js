export const Batch = [
  {
    inputs: [],
    stateMutability: "nonpayable",
    type: "constructor",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "target",
        type: "address",
      },
    ],
    name: "AddressEmptyCode",
    type: "error",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "account",
        type: "address",
      },
    ],
    name: "AddressInsufficientBalance",
    type: "error",
  },
  {
    inputs: [],
    name: "Address_DelegateCallToNonContract",
    type: "error",
  },
  {
    inputs: [],
    name: "Address__LowLevelCallFailed",
    type: "error",
  },
  {
    inputs: [
      {
        internalType: "uint256",
        name: "errorCode",
        type: "uint256",
      },
    ],
    name: "Address__LowLevelCallFailedWithCustomErrorCode",
    type: "error",
  },
  {
    inputs: [],
    name: "Address__LowLevelCallWithValueFailed",
    type: "error",
  },
  {
    inputs: [],
    name: "Address__LowLevelStaticCallFailed",
    type: "error",
  },
  {
    inputs: [],
    name: "AlreadySupportedToken",
    type: "error",
  },
  {
    inputs: [],
    name: "CallerIsNotStrategyRouter",
    type: "error",
  },
  {
    inputs: [],
    name: "CantRemoveTokenOfActiveStrategy",
    type: "error",
  },
  {
    inputs: [],
    name: "CycleClosed",
    type: "error",
  },
  {
    inputs: [],
    name: "DepositFeePercentExceedsFeePercentageThreshold",
    type: "error",
  },
  {
    inputs: [],
    name: "DepositFeeTreasuryNotSet",
    type: "error",
  },
  {
    inputs: [],
    name: "DepositUnderDepositFeeValue",
    type: "error",
  },
  {
    inputs: [],
    name: "ERC1967Upgrade_NewImplementationIsNotUUPS",
    type: "error",
  },
  {
    inputs: [],
    name: "ERC1967Upgrade_UnsupportedProxiableUUID",
    type: "error",
  },
  {
    inputs: [],
    name: "ERC1967_BeaconImplementationIsNotAContract",
    type: "error",
  },
  {
    inputs: [],
    name: "ERC1967_NewAdminIsZeroAddress",
    type: "error",
  },
  {
    inputs: [],
    name: "ERC1967_NewBeaconIsNotAContract",
    type: "error",
  },
  {
    inputs: [],
    name: "ERC1967_NewImplementationIsNotAContract",
    type: "error",
  },
  {
    inputs: [],
    name: "ErrorToCheckUpgradeContract",
    type: "error",
  },
  {
    inputs: [],
    name: "FailedInnerCall",
    type: "error",
  },
  {
    inputs: [],
    name: "FunctionMustBeCalledThroughActiveProxy",
    type: "error",
  },
  {
    inputs: [],
    name: "FunctionMustBeCalledThroughDelegatecall",
    type: "error",
  },
  {
    inputs: [],
    name: "Initializable_ContractIsInitializing",
    type: "error",
  },
  {
    inputs: [],
    name: "Initializable__ContractIsAlreadyInitialized",
    type: "error",
  },
  {
    inputs: [],
    name: "Initializable__ContractIsNotInitializing",
    type: "error",
  },
  {
    inputs: [],
    name: "InvalidToken",
    type: "error",
  },
  {
    inputs: [],
    name: "MaxDepositFeeExceedsThreshold",
    type: "error",
  },
  {
    inputs: [],
    name: "MinDepositFeeExceedsMax",
    type: "error",
  },
  {
    inputs: [],
    name: "NotEnoughBalanceInBatch",
    type: "error",
  },
  {
    inputs: [],
    name: "NotReceiptOwner",
    type: "error",
  },
  {
    inputs: [],
    name: "NotSetMaxFeeInStableWhenFeeInBpsIsSet",
    type: "error",
  },
  {
    inputs: [],
    name: "Ownable__CallerIsNotTheOwner",
    type: "error",
  },
  {
    inputs: [],
    name: "Ownable__NewOwnerIsTheZeroAddress",
    type: "error",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "token",
        type: "address",
      },
    ],
    name: "SafeERC20FailedOperation",
    type: "error",
  },
  {
    inputs: [],
    name: "UUPSUpgradeable__MustNotBeCalledThroughDelegatecall",
    type: "error",
  },
  {
    inputs: [],
    name: "UnsupportedToken",
    type: "error",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: false,
        internalType: "address",
        name: "previousAdmin",
        type: "address",
      },
      {
        indexed: false,
        internalType: "address",
        name: "newAdmin",
        type: "address",
      },
    ],
    name: "AdminChanged",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: "address",
        name: "beacon",
        type: "address",
      },
    ],
    name: "BeaconUpgraded",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: false,
        internalType: "uint8",
        name: "version",
        type: "uint8",
      },
    ],
    name: "Initialized",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: "address",
        name: "previousOwner",
        type: "address",
      },
      {
        indexed: true,
        internalType: "address",
        name: "newOwner",
        type: "address",
      },
    ],
    name: "OwnershipTransferred",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: false,
        internalType: "contract IExchange",
        name: "_exchange",
        type: "address",
      },
      {
        indexed: false,
        internalType: "contract IUsdOracle",
        name: "_oracle",
        type: "address",
      },
      {
        indexed: false,
        internalType: "contract IStrategyRouter",
        name: "_router",
        type: "address",
      },
      {
        indexed: false,
        internalType: "contract IReceiptNFT",
        name: "_receiptNft",
        type: "address",
      },
    ],
    name: "SetAddresses",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      {
        components: [
          {
            internalType: "uint256",
            name: "minFeeInUsd",
            type: "uint256",
          },
          {
            internalType: "uint256",
            name: "maxFeeInUsd",
            type: "uint256",
          },
          {
            internalType: "uint256",
            name: "feeInBps",
            type: "uint256",
          },
        ],
        indexed: false,
        internalType: "struct Batch.DepositFeeSettings",
        name: "newDepositFeeSettings",
        type: "tuple",
      },
    ],
    name: "SetDepositFeeSettings",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: "address",
        name: "implementation",
        type: "address",
      },
    ],
    name: "Upgraded",
    type: "event",
  },
  {
    inputs: [],
    name: "REBALANCE_SWAP_THRESHOLD",
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
        name: "tokenAddress",
        type: "address",
      },
    ],
    name: "addSupportedToken",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "uint256",
        name: "amountInStableUniform",
        type: "uint256",
      },
    ],
    name: "calculateDepositFee",
    outputs: [
      {
        internalType: "uint256",
        name: "feeAmountInStable",
        type: "uint256",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "collectDepositFee",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "depositor",
        type: "address",
      },
      {
        internalType: "address",
        name: "depositToken",
        type: "address",
      },
      {
        internalType: "uint256",
        name: "depositAmount",
        type: "uint256",
      },
      {
        internalType: "uint256",
        name: "_currentCycleId",
        type: "uint256",
      },
    ],
    name: "deposit",
    outputs: [
      {
        internalType: "uint256",
        name: "depositFeeAmount",
        type: "uint256",
      },
    ],
    stateMutability: "payable",
    type: "function",
  },
  {
    inputs: [],
    name: "depositFeeSettings",
    outputs: [
      {
        internalType: "uint256",
        name: "minFeeInUsd",
        type: "uint256",
      },
      {
        internalType: "uint256",
        name: "maxFeeInUsd",
        type: "uint256",
      },
      {
        internalType: "uint256",
        name: "feeInBps",
        type: "uint256",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "exchange",
    outputs: [
      {
        internalType: "contract IExchange",
        name: "",
        type: "address",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "getBatchValueUsd",
    outputs: [
      {
        internalType: "uint256",
        name: "totalBalanceUsd",
        type: "uint256",
      },
      {
        internalType: "uint256[]",
        name: "supportedTokenBalancesUsd",
        type: "uint256[]",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        components: [
          {
            internalType: "uint256",
            name: "price",
            type: "uint256",
          },
          {
            internalType: "uint8",
            name: "priceDecimals",
            type: "uint8",
          },
          {
            internalType: "address",
            name: "token",
            type: "address",
          },
        ],
        internalType: "struct TokenPrice[]",
        name: "supportedTokenPrices",
        type: "tuple[]",
      },
    ],
    name: "getBatchValueUsdWithoutOracleCalls",
    outputs: [
      {
        internalType: "uint256",
        name: "totalBalanceUsd",
        type: "uint256",
      },
      {
        internalType: "uint256[]",
        name: "supportedTokenBalancesUsd",
        type: "uint256[]",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "uint256",
        name: "amountInStableUniform",
        type: "uint256",
      },
    ],
    name: "getDepositFeeInNative",
    outputs: [
      {
        internalType: "uint256",
        name: "feeAmountInNative",
        type: "uint256",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "getSupportedTokens",
    outputs: [
      {
        internalType: "address[]",
        name: "",
        type: "address[]",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "getSupportedTokensWithPriceInUsd",
    outputs: [
      {
        components: [
          {
            internalType: "uint256",
            name: "price",
            type: "uint256",
          },
          {
            internalType: "uint8",
            name: "priceDecimals",
            type: "uint8",
          },
          {
            internalType: "address",
            name: "token",
            type: "address",
          },
        ],
        internalType: "struct TokenPrice[]",
        name: "supportedTokenPrices",
        type: "tuple[]",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "bytes",
        name: "initializeData",
        type: "bytes",
      },
    ],
    name: "initialize",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [],
    name: "oracle",
    outputs: [
      {
        internalType: "contract IUsdOracle",
        name: "",
        type: "address",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "owner",
    outputs: [
      {
        internalType: "address",
        name: "",
        type: "address",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "proxiableUUID",
    outputs: [
      {
        internalType: "bytes32",
        name: "",
        type: "bytes32",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        components: [
          {
            internalType: "uint256",
            name: "price",
            type: "uint256",
          },
          {
            internalType: "uint8",
            name: "priceDecimals",
            type: "uint8",
          },
          {
            internalType: "address",
            name: "token",
            type: "address",
          },
        ],
        internalType: "struct TokenPrice[]",
        name: "supportedTokenPrices",
        type: "tuple[]",
      },
      {
        components: [
          {
            internalType: "address",
            name: "strategyAddress",
            type: "address",
          },
          {
            internalType: "address",
            name: "depositToken",
            type: "address",
          },
          {
            internalType: "uint256",
            name: "depositTokenInSupportedTokensIndex",
            type: "uint256",
          },
          {
            internalType: "uint256",
            name: "weight",
            type: "uint256",
          },
        ],
        internalType: "struct StrategyInfo[]",
        name: "strategies",
        type: "tuple[]",
      },
      {
        internalType: "uint256",
        name: "remainingToAllocateStrategiesWeightSum",
        type: "uint256",
      },
      {
        components: [
          {
            internalType: "address",
            name: "strategyAddress",
            type: "address",
          },
          {
            internalType: "address",
            name: "depositToken",
            type: "address",
          },
        ],
        internalType: "struct IdleStrategyInfo[]",
        name: "idleStrategies",
        type: "tuple[]",
      },
    ],
    name: "rebalance",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [],
    name: "receiptContract",
    outputs: [
      {
        internalType: "contract IReceiptNFT",
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
        internalType: "address",
        name: "tokenAddress",
        type: "address",
      },
    ],
    name: "removeSupportedToken",
    outputs: [
      {
        internalType: "bool",
        name: "wasRemovedFromTail",
        type: "bool",
      },
      {
        internalType: "address",
        name: "formerTailTokenAddress",
        type: "address",
      },
      {
        internalType: "uint256",
        name: "newIndexOfFormerTailToken",
        type: "uint256",
      },
    ],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [],
    name: "renounceOwnership",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [],
    name: "router",
    outputs: [
      {
        internalType: "contract IStrategyRouter",
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
        internalType: "contract IExchange",
        name: "_exchange",
        type: "address",
      },
      {
        internalType: "contract IUsdOracle",
        name: "_oracle",
        type: "address",
      },
      {
        internalType: "contract IStrategyRouter",
        name: "_router",
        type: "address",
      },
      {
        internalType: "contract IReceiptNFT",
        name: "_receiptNft",
        type: "address",
      },
    ],
    name: "setAddresses",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        components: [
          {
            internalType: "uint256",
            name: "minFeeInUsd",
            type: "uint256",
          },
          {
            internalType: "uint256",
            name: "maxFeeInUsd",
            type: "uint256",
          },
          {
            internalType: "uint256",
            name: "feeInBps",
            type: "uint256",
          },
        ],
        internalType: "struct Batch.DepositFeeSettings",
        name: "_depositFeeSettings",
        type: "tuple",
      },
    ],
    name: "setDepositFeeSettings",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "tokenAddress",
        type: "address",
      },
    ],
    name: "supportsToken",
    outputs: [
      {
        internalType: "bool",
        name: "",
        type: "bool",
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
        internalType: "address",
        name: "to",
        type: "address",
      },
      {
        internalType: "uint256",
        name: "amount",
        type: "uint256",
      },
    ],
    name: "transfer",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "newOwner",
        type: "address",
      },
    ],
    name: "transferOwnership",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "newImplementation",
        type: "address",
      },
    ],
    name: "upgradeTo",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "newImplementation",
        type: "address",
      },
      {
        internalType: "bytes",
        name: "data",
        type: "bytes",
      },
    ],
    name: "upgradeToAndCall",
    outputs: [],
    stateMutability: "payable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "receiptOwner",
        type: "address",
      },
      {
        internalType: "uint256[]",
        name: "receiptIds",
        type: "uint256[]",
      },
      {
        internalType: "uint256",
        name: "_currentCycleId",
        type: "uint256",
      },
    ],
    name: "withdraw",
    outputs: [
      {
        internalType: "uint256[]",
        name: "_receiptIds",
        type: "uint256[]",
      },
      {
        internalType: "address[]",
        name: "_tokens",
        type: "address[]",
      },
      {
        internalType: "uint256[]",
        name: "_withdrawnTokenAmounts",
        type: "uint256[]",
      },
    ],
    stateMutability: "nonpayable",
    type: "function",
  },
];
