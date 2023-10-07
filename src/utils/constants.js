export const BLOCK_CONFIRMATIONS = 4;
export const BLOCK_TIMEOUT = 120000;
export const FIVE_MB = 5242880;
export const ZERO_MERKLE_ROOT =
  "0x0000000000000000000000000000000000000000000000000000000000000001";
export const ZERO_ADDRESS = "0x0000000000000000000000000000000000000000";
export const AWS_API_URL =
  "https://k3hu9vqwv4.execute-api.ap-south-1.amazonaws.com";
export const OMIT_DAOS = [
  "0xbd1fab87be86fec9336ae49131998d9fa5a00eb0",
  "0x2608d54d10527fd4a6a7bab0306dfbf9ca95a1bb",
  "0x067a544f00840056c8cdb7f9d9d73ac3611d37c9",
  "0x1ae43fb8283e45ae90d5bd9249cc7227fd6ecc73",
];

export const CHAIN_CONFIG = {
  "0x89": {
    chainName: "Polygon Mainnet",
    shortName: "Polygon",
    chainId: 137,
    nativeCurrency: {
      name: "MATIC",
      decimals: 18,
      symbol: "MATIC",
    },
    rpcUrls: ["https://polygon-rpc.com/"],
    appRpcUrl: `https://polygon-mainnet.infura.io/v3/${process.env.NEXT_PUBLIC_INFURA_API_KEY}`,
    claimFactoryAddress: "0x47e6bFA71e490ADC8f0E33385aAdF85282E71002",
    stationSubgraphUrl:
      "https://api.thegraph.com/subgraphs/name/subham7/stnx-be-polygon",
    claimsSubgraphUrl:
      "https://api.goldsky.com/api/public/project_clkur95905vrg38uwhvw24amx/subgraphs/stnx-claim-polygon/prod/gn",
    covalentNetworkName: "matic-mainnet",
    nativeToken: "0x0000000000000000000000000000000000001010",
    usdcAddress: "0x2791Bca1f2de4661ED88A30C99A7a9449Aa84174",
    airdropContractAddress: "0x0DF19560f74749a42215A16C3FC22FfAA1c4029A",
    aavePoolAddress: "0x794a61358D6845594F94dc1DB02A252b5b4814aD",
    aaveMaticPoolAddress: "0x1e4b7A6b903680eab0c5dAbcb8fD429cD2a9598c",
    aaveWrappedUsdcAddress: "0x625E7708f30cA75bfd92586e17077590C60eb4cD",
    aaveWrappedMaticAddress: "0x6d80113e533a2C0fe82EaBD35f1875DcEA89Ea97",
    blockExplorerUrl: "https://polygonscan.com",
    disburseContractAddress: "0x2F73a97D1be96853AF8E2b8F29E0F2AF332EA9f5",
  },
  "0x5": {
    chainName: "Goerli Testnet",
    shortName: "Goerli",
    chainId: 5,
    nativeCurrency: {
      name: "GoerliETH",
      decimals: 18,
      symbol: "GOR",
    },
    rpcUrls: ["https://rpc.goerli.mudit.blog/"],
    appRpcUrl: `https://eth-goerli.g.alchemy.com/v2/${process.env.NEXT_PUBLIC_ALCHEMY_API_KEY}`,
    claimFactoryAddress: "0x14E92a30fc70F8544b0DDB5fd87B773bC0DD68e6",
    claimsSubgraphUrl:
      "https://api.thegraph.com/subgraphs/name/subham7/stnx-claim",
    covalentNetworkName: "goerli-testnet",
    nativeToken: "0xeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee",
    blockExplorerUrl: "https://goerli.etherscan.io",
  },
  "0x2105": {
    chainName: "Base Mainnet",
    shortName: "Base",
    chainId: 8453,
    nativeCurrency: {
      name: "Base ETH",
      decimals: 18,
      symbol: "ETH",
    },
    rpcUrls: ["https://mainnet.base.org"],
    appRpcUrl: `https://proportionate-dry-pine.base-mainnet.discover.quiknode.pro/${process.env.NEXT_PUBLIC_QUICKNODE_BASE_API_KEY}/`,
    claimFactoryAddress: "0x50702Fd9086BAbDB0A3A576bFe22D4dD47b09937",
    claimsSubgraphUrl:
      "https://api.goldsky.com/api/public/project_clkur95905vrg38uwhvw24amx/subgraphs/stnx-claim-base/prod/gn",
    stationSubgraphUrl:
      "https://api.thegraph.com/subgraphs/name/subham7/stnx-be-base",
    covalentNetworkName: "base-mainnet",
    nativeToken: "0xeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee",
    usdcAddress: "0x833589fCD6eDb6E08f4c7C32D4f71b54bdA02913",
    airdropContractAddress: "0x9aeF8F840FED23502506CC988c0057F24638C00E",
    blockExplorerUrl: "https://explorer.base.org",
  },
  "0xa4b1": {
    chainName: "Arbitrum One",
    shortName: "Arbitrum",
    chainId: 42161,
    nativeCurrency: {
      name: "ETH",
      decimals: 18,
      symbol: "ETH",
    },
    rpcUrls: ["https://arb1.arbitrum.io/rpc"],
    appRpcUrl: `https://arbitrum-mainnet.infura.io/v3/${process.env.NEXT_PUBLIC_INFURA_API_KEY}`,
    claimFactoryAddress: "0x28F06a3415A741367303Db36a6646C354cCE1340",
    claimsSubgraphUrl:
      "https://api.goldsky.com/api/public/project_clkur95905vrg38uwhvw24amx/subgraphs/stnx-claim-arbitrum/prod/gn",
    covalentNetworkName: "arbitrum-mainnet",
    nativeToken: "0xeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee",
    blockExplorerUrl: "https://arbiscan.io",
  },
  "0xe708": {
    chainName: "Linea Mainnet",
    shortName: "Linea",
    chainId: 59144,
    nativeCurrency: {
      name: "Ether",
      decimals: 18,
      symbol: "ETH",
    },
    rpcUrls: ["https://rpc.linea.build"],
    appRpcUrl: `https://linea-mainnet.infura.io/v3/${process.env.NEXT_PUBLIC_INFURA_API_KEY}`,
    claimFactoryAddress: "0x50702Fd9086BAbDB0A3A576bFe22D4dD47b09937",
    claimsSubgraphUrl:
      "https://api.goldsky.com/api/public/project_clkur95905vrg38uwhvw24amx/subgraphs/stnx-claim-linea/0.0.1/gn",
    stationSubgraphUrl:
      "https://api.goldsky.com/api/public/project_clkur95905vrg38uwhvw24amx/subgraphs/stnx-linea/0.0.1/gn",
    covalentNetworkName: "linea-mainnet",
    nativeToken: "0xeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee",
    blockExplorerUrl: "https://lineascan.build",
  },
  "0x38": {
    chainName: "BNB Smart Chain",
    shortName: "BNB",
    chainId: 56,
    nativeCurrency: {
      name: "BNB",
      decimals: 18,
      symbol: "BNB",
    },
    rpcUrls: ["https://bsc.meowrpc.com"],
    appRpcUrl: `https://special-spring-sun.bsc.discover.quiknode.pro/${process.env.NEXT_PUBLIC_QUICKNODE_API_KEY}/`,
    claimFactoryAddress: "0x80e1429430cfB717187BD37eb5Bd0076d77dcE85",
    claimsSubgraphUrl:
      "https://api.goldsky.com/api/public/project_clkur95905vrg38uwhvw24amx/subgraphs/stnx-claim-bsc/prod/gn",
    covalentNetworkName: "bsc-mainnet",
    nativeToken: "0xeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee",
    blockExplorerUrl: "https://bscscan.com",
  },
  "0x1388": {
    chainName: "Mantle Mainnet",
    shortName: "Mantle",
    chainId: 5000,
    nativeCurrency: {
      name: "MNT",
      decimals: 18,
      symbol: "MNT",
    },
    rpcUrls: ["https://rpc.mantle.xyz"],
    appRpcUrl: `https://mantle-mainnet.public.blastapi.io`,
    claimFactoryAddress: "0x28F06a3415A741367303Db36a6646C354cCE1340",
    claimsSubgraphUrl:
      "https://api.goldsky.com/api/public/project_clkur95905vrg38uwhvw24amx/subgraphs/stnx-claim-mantle/0.0.2/gn",
    covalentNetworkName: "mantle-mainnet",
    nativeToken: "0xeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee",
    blockExplorerUrl: "https://explorer.mantle.xyz",
  },
  "0x64": {
    chainName: "Gnosis Chain",
    shortName: "Gnosis",
    chainId: 100,
    nativeCurrency: {
      name: "xDai",
      decimals: 18,
      symbol: "xDai",
    },
    rpcUrls: ["https://rpc.gnosischain.com"],
    appRpcUrl: `https://late-wandering-brook.xdai.quiknode.pro/${process.env.NEXT_PUBLIC_QUICKNODE_GNOSIS_API_KEY}/`,
    // claimFactoryAddress: "0x50702Fd9086BAbDB0A3A576bFe22D4dD47b09937",
    // claimsSubgraphUrl:
    //   "https://api.goldsky.com/api/public/project_clkur95905vrg38uwhvw24amx/subgraphs/stnx-claim-base/prod/gn",
    stationSubgraphUrl:
      "https://api.thegraph.com/subgraphs/name/subham7/stnx-be-gnosis",
    covalentNetworkName: "gnosis-mainnet",
    nativeToken: "0x9c58bacc331c9aa871afd802db6379a98e80cedb",
    usdcAddress: "0xddafbb505ad214d7b80b1f830fccc89b60fb7a83",
    airdropContractAddress: "0x45a27ea11D159A86AacE1eC24d3ba3d103642D9f",
    blockExplorerUrl: "https://gnosisscan.io/",
  },
};

export const lineaMainnetWalletConnect = {
  id: 59144,
  name: "Linea",
  network: "linea",
  nativeCurrency: {
    decimals: 18,
    name: "Ether ",
    symbol: "ETH",
  },
  rpcUrls: {
    public: { http: ["https://rpc.linea.build"] },
    default: { http: ["https://rpc.linea.build"] },
  },
  blockExplorers: {
    etherscan: { name: "LineaScan", url: "https://lineascan.build/" },
    default: { name: "LineaScan", url: "https://lineascan.build/" },
  },
  contracts: {
    multicall3: {
      address: "0xcA11bde05977b3631167028862bE2a173976CA11",
      blockCreated: 42,
    },
  },
};

export const mantleMainnetViem = {
  id: 5000,
  name: "Mantle",
  network: "Mantle",
  nativeCurrency: {
    decimals: 18,
    name: "MNT ",
    symbol: "MNT",
  },
  rpcUrls: {
    public: { http: ["https://rpc.mantle.xyz"] },
    default: { http: ["https://rpc.mantle.xyz"] },
  },
  blockExplorers: {
    etherscan: { name: "Mantle Explorer", url: "https://explorer.mantle.xyz/" },
    default: { name: "Mantle Explorer", url: "https://explorer.mantle.xyz/" },
  },
  contracts: {
    multicall3: {
      address: "0xcA11bde05977b3631167028862bE2a173976CA11",
      blockCreated: 304717,
    },
  },
};

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
};

export const contractNetworks = {
  [8453]: {
    safeMasterCopyAddress: "0x69f4D1788e39c87893C980c06EdF4b7f686e2938",
    safeProxyFactoryAddress: "0xC22834581EbC8527d974F8a1c97E1bEA4EF910BC",
    multiSendAddress: "0x998739BFdAAdde7C933B942a68053933098f9EDa",
    multiSendCallOnlyAddress: "0xA1dabEF33b3B82c7814B6D82A79e50F4AC44102B",
    fallbackHandlerAddress: "0x017062a1dE2FE6b99BE3d9d37841FeD19F573804",
    signMessageLibAddress: "0x98FFBBF51bb33A056B08ddf711f289936AafF717",
    createCallAddress: "0xB19D6FFc2182150F8Eb585b79D4ABcd7C5640A9d",
    simulateTxAccessorAddress: "0x727a77a074D1E6c4530e814F89E618a3298FC044",
    safeMasterCopyAbi: [
      {
        inputs: [],
        stateMutability: "nonpayable",
        type: "constructor",
      },
      {
        anonymous: false,
        inputs: [
          {
            indexed: false,
            internalType: "address",
            name: "owner",
            type: "address",
          },
        ],
        name: "AddedOwner",
        type: "event",
      },
      {
        anonymous: false,
        inputs: [
          {
            indexed: true,
            internalType: "bytes32",
            name: "approvedHash",
            type: "bytes32",
          },
          {
            indexed: true,
            internalType: "address",
            name: "owner",
            type: "address",
          },
        ],
        name: "ApproveHash",
        type: "event",
      },
      {
        anonymous: false,
        inputs: [
          {
            indexed: false,
            internalType: "address",
            name: "handler",
            type: "address",
          },
        ],
        name: "ChangedFallbackHandler",
        type: "event",
      },
      {
        anonymous: false,
        inputs: [
          {
            indexed: false,
            internalType: "address",
            name: "guard",
            type: "address",
          },
        ],
        name: "ChangedGuard",
        type: "event",
      },
      {
        anonymous: false,
        inputs: [
          {
            indexed: false,
            internalType: "uint256",
            name: "threshold",
            type: "uint256",
          },
        ],
        name: "ChangedThreshold",
        type: "event",
      },
      {
        anonymous: false,
        inputs: [
          {
            indexed: false,
            internalType: "address",
            name: "module",
            type: "address",
          },
        ],
        name: "DisabledModule",
        type: "event",
      },
      {
        anonymous: false,
        inputs: [
          {
            indexed: false,
            internalType: "address",
            name: "module",
            type: "address",
          },
        ],
        name: "EnabledModule",
        type: "event",
      },
      {
        anonymous: false,
        inputs: [
          {
            indexed: false,
            internalType: "bytes32",
            name: "txHash",
            type: "bytes32",
          },
          {
            indexed: false,
            internalType: "uint256",
            name: "payment",
            type: "uint256",
          },
        ],
        name: "ExecutionFailure",
        type: "event",
      },
      {
        anonymous: false,
        inputs: [
          {
            indexed: true,
            internalType: "address",
            name: "module",
            type: "address",
          },
        ],
        name: "ExecutionFromModuleFailure",
        type: "event",
      },
      {
        anonymous: false,
        inputs: [
          {
            indexed: true,
            internalType: "address",
            name: "module",
            type: "address",
          },
        ],
        name: "ExecutionFromModuleSuccess",
        type: "event",
      },
      {
        anonymous: false,
        inputs: [
          {
            indexed: false,
            internalType: "bytes32",
            name: "txHash",
            type: "bytes32",
          },
          {
            indexed: false,
            internalType: "uint256",
            name: "payment",
            type: "uint256",
          },
        ],
        name: "ExecutionSuccess",
        type: "event",
      },
      {
        anonymous: false,
        inputs: [
          {
            indexed: false,
            internalType: "address",
            name: "owner",
            type: "address",
          },
        ],
        name: "RemovedOwner",
        type: "event",
      },
      {
        anonymous: false,
        inputs: [
          {
            indexed: true,
            internalType: "address",
            name: "sender",
            type: "address",
          },
          {
            indexed: false,
            internalType: "uint256",
            name: "value",
            type: "uint256",
          },
        ],
        name: "SafeReceived",
        type: "event",
      },
      {
        anonymous: false,
        inputs: [
          {
            indexed: true,
            internalType: "address",
            name: "initiator",
            type: "address",
          },
          {
            indexed: false,
            internalType: "address[]",
            name: "owners",
            type: "address[]",
          },
          {
            indexed: false,
            internalType: "uint256",
            name: "threshold",
            type: "uint256",
          },
          {
            indexed: false,
            internalType: "address",
            name: "initializer",
            type: "address",
          },
          {
            indexed: false,
            internalType: "address",
            name: "fallbackHandler",
            type: "address",
          },
        ],
        name: "SafeSetup",
        type: "event",
      },
      {
        anonymous: false,
        inputs: [
          {
            indexed: true,
            internalType: "bytes32",
            name: "msgHash",
            type: "bytes32",
          },
        ],
        name: "SignMsg",
        type: "event",
      },
      {
        stateMutability: "nonpayable",
        type: "fallback",
      },
      {
        inputs: [],
        name: "VERSION",
        outputs: [
          {
            internalType: "string",
            name: "",
            type: "string",
          },
        ],
        stateMutability: "view",
        type: "function",
      },
      {
        inputs: [
          {
            internalType: "address",
            name: "owner",
            type: "address",
          },
          {
            internalType: "uint256",
            name: "_threshold",
            type: "uint256",
          },
        ],
        name: "addOwnerWithThreshold",
        outputs: [],
        stateMutability: "nonpayable",
        type: "function",
      },
      {
        inputs: [
          {
            internalType: "bytes32",
            name: "hashToApprove",
            type: "bytes32",
          },
        ],
        name: "approveHash",
        outputs: [],
        stateMutability: "nonpayable",
        type: "function",
      },
      {
        inputs: [
          {
            internalType: "address",
            name: "",
            type: "address",
          },
          {
            internalType: "bytes32",
            name: "",
            type: "bytes32",
          },
        ],
        name: "approvedHashes",
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
            internalType: "uint256",
            name: "_threshold",
            type: "uint256",
          },
        ],
        name: "changeThreshold",
        outputs: [],
        stateMutability: "nonpayable",
        type: "function",
      },
      {
        inputs: [
          {
            internalType: "bytes32",
            name: "dataHash",
            type: "bytes32",
          },
          {
            internalType: "bytes",
            name: "data",
            type: "bytes",
          },
          {
            internalType: "bytes",
            name: "signatures",
            type: "bytes",
          },
          {
            internalType: "uint256",
            name: "requiredSignatures",
            type: "uint256",
          },
        ],
        name: "checkNSignatures",
        outputs: [],
        stateMutability: "view",
        type: "function",
      },
      {
        inputs: [
          {
            internalType: "bytes32",
            name: "dataHash",
            type: "bytes32",
          },
          {
            internalType: "bytes",
            name: "data",
            type: "bytes",
          },
          {
            internalType: "bytes",
            name: "signatures",
            type: "bytes",
          },
        ],
        name: "checkSignatures",
        outputs: [],
        stateMutability: "view",
        type: "function",
      },
      {
        inputs: [
          {
            internalType: "address",
            name: "prevModule",
            type: "address",
          },
          {
            internalType: "address",
            name: "module",
            type: "address",
          },
        ],
        name: "disableModule",
        outputs: [],
        stateMutability: "nonpayable",
        type: "function",
      },
      {
        inputs: [],
        name: "domainSeparator",
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
            internalType: "address",
            name: "module",
            type: "address",
          },
        ],
        name: "enableModule",
        outputs: [],
        stateMutability: "nonpayable",
        type: "function",
      },
      {
        inputs: [
          {
            internalType: "address",
            name: "to",
            type: "address",
          },
          {
            internalType: "uint256",
            name: "value",
            type: "uint256",
          },
          {
            internalType: "bytes",
            name: "data",
            type: "bytes",
          },
          {
            internalType: "enum Enum.Operation",
            name: "operation",
            type: "uint8",
          },
          {
            internalType: "uint256",
            name: "safeTxGas",
            type: "uint256",
          },
          {
            internalType: "uint256",
            name: "baseGas",
            type: "uint256",
          },
          {
            internalType: "uint256",
            name: "gasPrice",
            type: "uint256",
          },
          {
            internalType: "address",
            name: "gasToken",
            type: "address",
          },
          {
            internalType: "address",
            name: "refundReceiver",
            type: "address",
          },
          {
            internalType: "uint256",
            name: "_nonce",
            type: "uint256",
          },
        ],
        name: "encodeTransactionData",
        outputs: [
          {
            internalType: "bytes",
            name: "",
            type: "bytes",
          },
        ],
        stateMutability: "view",
        type: "function",
      },
      {
        inputs: [
          {
            internalType: "address",
            name: "to",
            type: "address",
          },
          {
            internalType: "uint256",
            name: "value",
            type: "uint256",
          },
          {
            internalType: "bytes",
            name: "data",
            type: "bytes",
          },
          {
            internalType: "enum Enum.Operation",
            name: "operation",
            type: "uint8",
          },
          {
            internalType: "uint256",
            name: "safeTxGas",
            type: "uint256",
          },
          {
            internalType: "uint256",
            name: "baseGas",
            type: "uint256",
          },
          {
            internalType: "uint256",
            name: "gasPrice",
            type: "uint256",
          },
          {
            internalType: "address",
            name: "gasToken",
            type: "address",
          },
          {
            internalType: "address payable",
            name: "refundReceiver",
            type: "address",
          },
          {
            internalType: "bytes",
            name: "signatures",
            type: "bytes",
          },
        ],
        name: "execTransaction",
        outputs: [
          {
            internalType: "bool",
            name: "success",
            type: "bool",
          },
        ],
        stateMutability: "payable",
        type: "function",
      },
      {
        inputs: [
          {
            internalType: "address",
            name: "to",
            type: "address",
          },
          {
            internalType: "uint256",
            name: "value",
            type: "uint256",
          },
          {
            internalType: "bytes",
            name: "data",
            type: "bytes",
          },
          {
            internalType: "enum Enum.Operation",
            name: "operation",
            type: "uint8",
          },
        ],
        name: "execTransactionFromModule",
        outputs: [
          {
            internalType: "bool",
            name: "success",
            type: "bool",
          },
        ],
        stateMutability: "nonpayable",
        type: "function",
      },
      {
        inputs: [
          {
            internalType: "address",
            name: "to",
            type: "address",
          },
          {
            internalType: "uint256",
            name: "value",
            type: "uint256",
          },
          {
            internalType: "bytes",
            name: "data",
            type: "bytes",
          },
          {
            internalType: "enum Enum.Operation",
            name: "operation",
            type: "uint8",
          },
        ],
        name: "execTransactionFromModuleReturnData",
        outputs: [
          {
            internalType: "bool",
            name: "success",
            type: "bool",
          },
          {
            internalType: "bytes",
            name: "returnData",
            type: "bytes",
          },
        ],
        stateMutability: "nonpayable",
        type: "function",
      },
      {
        inputs: [],
        name: "getChainId",
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
            name: "start",
            type: "address",
          },
          {
            internalType: "uint256",
            name: "pageSize",
            type: "uint256",
          },
        ],
        name: "getModulesPaginated",
        outputs: [
          {
            internalType: "address[]",
            name: "array",
            type: "address[]",
          },
          {
            internalType: "address",
            name: "next",
            type: "address",
          },
        ],
        stateMutability: "view",
        type: "function",
      },
      {
        inputs: [],
        name: "getOwners",
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
        inputs: [
          {
            internalType: "uint256",
            name: "offset",
            type: "uint256",
          },
          {
            internalType: "uint256",
            name: "length",
            type: "uint256",
          },
        ],
        name: "getStorageAt",
        outputs: [
          {
            internalType: "bytes",
            name: "",
            type: "bytes",
          },
        ],
        stateMutability: "view",
        type: "function",
      },
      {
        inputs: [],
        name: "getThreshold",
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
            name: "to",
            type: "address",
          },
          {
            internalType: "uint256",
            name: "value",
            type: "uint256",
          },
          {
            internalType: "bytes",
            name: "data",
            type: "bytes",
          },
          {
            internalType: "enum Enum.Operation",
            name: "operation",
            type: "uint8",
          },
          {
            internalType: "uint256",
            name: "safeTxGas",
            type: "uint256",
          },
          {
            internalType: "uint256",
            name: "baseGas",
            type: "uint256",
          },
          {
            internalType: "uint256",
            name: "gasPrice",
            type: "uint256",
          },
          {
            internalType: "address",
            name: "gasToken",
            type: "address",
          },
          {
            internalType: "address",
            name: "refundReceiver",
            type: "address",
          },
          {
            internalType: "uint256",
            name: "_nonce",
            type: "uint256",
          },
        ],
        name: "getTransactionHash",
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
            internalType: "address",
            name: "module",
            type: "address",
          },
        ],
        name: "isModuleEnabled",
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
            name: "owner",
            type: "address",
          },
        ],
        name: "isOwner",
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
        inputs: [],
        name: "nonce",
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
            name: "prevOwner",
            type: "address",
          },
          {
            internalType: "address",
            name: "owner",
            type: "address",
          },
          {
            internalType: "uint256",
            name: "_threshold",
            type: "uint256",
          },
        ],
        name: "removeOwner",
        outputs: [],
        stateMutability: "nonpayable",
        type: "function",
      },
      {
        inputs: [
          {
            internalType: "address",
            name: "to",
            type: "address",
          },
          {
            internalType: "uint256",
            name: "value",
            type: "uint256",
          },
          {
            internalType: "bytes",
            name: "data",
            type: "bytes",
          },
          {
            internalType: "enum Enum.Operation",
            name: "operation",
            type: "uint8",
          },
        ],
        name: "requiredTxGas",
        outputs: [
          {
            internalType: "uint256",
            name: "",
            type: "uint256",
          },
        ],
        stateMutability: "nonpayable",
        type: "function",
      },
      {
        inputs: [
          {
            internalType: "address",
            name: "handler",
            type: "address",
          },
        ],
        name: "setFallbackHandler",
        outputs: [],
        stateMutability: "nonpayable",
        type: "function",
      },
      {
        inputs: [
          {
            internalType: "address",
            name: "guard",
            type: "address",
          },
        ],
        name: "setGuard",
        outputs: [],
        stateMutability: "nonpayable",
        type: "function",
      },
      {
        inputs: [
          {
            internalType: "address[]",
            name: "_owners",
            type: "address[]",
          },
          {
            internalType: "uint256",
            name: "_threshold",
            type: "uint256",
          },
          {
            internalType: "address",
            name: "to",
            type: "address",
          },
          {
            internalType: "bytes",
            name: "data",
            type: "bytes",
          },
          {
            internalType: "address",
            name: "fallbackHandler",
            type: "address",
          },
          {
            internalType: "address",
            name: "paymentToken",
            type: "address",
          },
          {
            internalType: "uint256",
            name: "payment",
            type: "uint256",
          },
          {
            internalType: "address payable",
            name: "paymentReceiver",
            type: "address",
          },
        ],
        name: "setup",
        outputs: [],
        stateMutability: "nonpayable",
        type: "function",
      },
      {
        inputs: [
          {
            internalType: "bytes32",
            name: "",
            type: "bytes32",
          },
        ],
        name: "signedMessages",
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
            name: "targetContract",
            type: "address",
          },
          {
            internalType: "bytes",
            name: "calldataPayload",
            type: "bytes",
          },
        ],
        name: "simulateAndRevert",
        outputs: [],
        stateMutability: "nonpayable",
        type: "function",
      },
      {
        inputs: [
          {
            internalType: "address",
            name: "prevOwner",
            type: "address",
          },
          {
            internalType: "address",
            name: "oldOwner",
            type: "address",
          },
          {
            internalType: "address",
            name: "newOwner",
            type: "address",
          },
        ],
        name: "swapOwner",
        outputs: [],
        stateMutability: "nonpayable",
        type: "function",
      },
      {
        stateMutability: "payable",
        type: "receive",
      },
    ], // Optional. Only needed with web3.js
    safeProxyFactoryAbi: [
      {
        anonymous: false,
        inputs: [
          {
            indexed: false,
            internalType: "contract GnosisSafeProxy",
            name: "proxy",
            type: "address",
          },
          {
            indexed: false,
            internalType: "address",
            name: "singleton",
            type: "address",
          },
        ],
        name: "ProxyCreation",
        type: "event",
      },
      {
        inputs: [
          {
            internalType: "address",
            name: "_singleton",
            type: "address",
          },
          {
            internalType: "bytes",
            name: "initializer",
            type: "bytes",
          },
          {
            internalType: "uint256",
            name: "saltNonce",
            type: "uint256",
          },
        ],
        name: "calculateCreateProxyWithNonceAddress",
        outputs: [
          {
            internalType: "contract GnosisSafeProxy",
            name: "proxy",
            type: "address",
          },
        ],
        stateMutability: "nonpayable",
        type: "function",
      },
      {
        inputs: [
          {
            internalType: "address",
            name: "singleton",
            type: "address",
          },
          {
            internalType: "bytes",
            name: "data",
            type: "bytes",
          },
        ],
        name: "createProxy",
        outputs: [
          {
            internalType: "contract GnosisSafeProxy",
            name: "proxy",
            type: "address",
          },
        ],
        stateMutability: "nonpayable",
        type: "function",
      },
      {
        inputs: [
          {
            internalType: "address",
            name: "_singleton",
            type: "address",
          },
          {
            internalType: "bytes",
            name: "initializer",
            type: "bytes",
          },
          {
            internalType: "uint256",
            name: "saltNonce",
            type: "uint256",
          },
          {
            internalType: "contract IProxyCreationCallback",
            name: "callback",
            type: "address",
          },
        ],
        name: "createProxyWithCallback",
        outputs: [
          {
            internalType: "contract GnosisSafeProxy",
            name: "proxy",
            type: "address",
          },
        ],
        stateMutability: "nonpayable",
        type: "function",
      },
      {
        inputs: [
          {
            internalType: "address",
            name: "_singleton",
            type: "address",
          },
          {
            internalType: "bytes",
            name: "initializer",
            type: "bytes",
          },
          {
            internalType: "uint256",
            name: "saltNonce",
            type: "uint256",
          },
        ],
        name: "createProxyWithNonce",
        outputs: [
          {
            internalType: "contract GnosisSafeProxy",
            name: "proxy",
            type: "address",
          },
        ],
        stateMutability: "nonpayable",
        type: "function",
      },
      {
        inputs: [],
        name: "proxyCreationCode",
        outputs: [
          {
            internalType: "bytes",
            name: "",
            type: "bytes",
          },
        ],
        stateMutability: "pure",
        type: "function",
      },
      {
        inputs: [],
        name: "proxyRuntimeCode",
        outputs: [
          {
            internalType: "bytes",
            name: "",
            type: "bytes",
          },
        ],
        stateMutability: "pure",
        type: "function",
      },
    ], // Optional. Only needed with web3.js
    multiSendAbi: [
      {
        inputs: [],
        stateMutability: "nonpayable",
        type: "constructor",
      },
      {
        inputs: [
          {
            internalType: "bytes",
            name: "transactions",
            type: "bytes",
          },
        ],
        name: "multiSend",
        outputs: [],
        stateMutability: "payable",
        type: "function",
      },
    ], // Optional. Only needed with web3.js
    multiSendCallOnlyAbi: [
      {
        inputs: [
          {
            internalType: "bytes",
            name: "transactions",
            type: "bytes",
          },
        ],
        name: "multiSend",
        outputs: [],
        stateMutability: "payable",
        type: "function",
      },
    ], // Optional. Only needed with web3.js
    fallbackHandlerAbi: [
      {
        inputs: [],
        name: "NAME",
        outputs: [
          {
            internalType: "string",
            name: "",
            type: "string",
          },
        ],
        stateMutability: "view",
        type: "function",
      },
      {
        inputs: [],
        name: "VERSION",
        outputs: [
          {
            internalType: "string",
            name: "",
            type: "string",
          },
        ],
        stateMutability: "view",
        type: "function",
      },
      {
        inputs: [
          {
            internalType: "bytes",
            name: "message",
            type: "bytes",
          },
        ],
        name: "getMessageHash",
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
            internalType: "contract GnosisSafe",
            name: "safe",
            type: "address",
          },
          {
            internalType: "bytes",
            name: "message",
            type: "bytes",
          },
        ],
        name: "getMessageHashForSafe",
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
        inputs: [],
        name: "getModules",
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
        inputs: [
          {
            internalType: "bytes32",
            name: "_dataHash",
            type: "bytes32",
          },
          {
            internalType: "bytes",
            name: "_signature",
            type: "bytes",
          },
        ],
        name: "isValidSignature",
        outputs: [
          {
            internalType: "bytes4",
            name: "",
            type: "bytes4",
          },
        ],
        stateMutability: "view",
        type: "function",
      },
      {
        inputs: [
          {
            internalType: "bytes",
            name: "_data",
            type: "bytes",
          },
          {
            internalType: "bytes",
            name: "_signature",
            type: "bytes",
          },
        ],
        name: "isValidSignature",
        outputs: [
          {
            internalType: "bytes4",
            name: "",
            type: "bytes4",
          },
        ],
        stateMutability: "view",
        type: "function",
      },
      {
        inputs: [
          {
            internalType: "address",
            name: "",
            type: "address",
          },
          {
            internalType: "address",
            name: "",
            type: "address",
          },
          {
            internalType: "uint256[]",
            name: "",
            type: "uint256[]",
          },
          {
            internalType: "uint256[]",
            name: "",
            type: "uint256[]",
          },
          {
            internalType: "bytes",
            name: "",
            type: "bytes",
          },
        ],
        name: "onERC1155BatchReceived",
        outputs: [
          {
            internalType: "bytes4",
            name: "",
            type: "bytes4",
          },
        ],
        stateMutability: "pure",
        type: "function",
      },
      {
        inputs: [
          {
            internalType: "address",
            name: "",
            type: "address",
          },
          {
            internalType: "address",
            name: "",
            type: "address",
          },
          {
            internalType: "uint256",
            name: "",
            type: "uint256",
          },
          {
            internalType: "uint256",
            name: "",
            type: "uint256",
          },
          {
            internalType: "bytes",
            name: "",
            type: "bytes",
          },
        ],
        name: "onERC1155Received",
        outputs: [
          {
            internalType: "bytes4",
            name: "",
            type: "bytes4",
          },
        ],
        stateMutability: "pure",
        type: "function",
      },
      {
        inputs: [
          {
            internalType: "address",
            name: "",
            type: "address",
          },
          {
            internalType: "address",
            name: "",
            type: "address",
          },
          {
            internalType: "uint256",
            name: "",
            type: "uint256",
          },
          {
            internalType: "bytes",
            name: "",
            type: "bytes",
          },
        ],
        name: "onERC721Received",
        outputs: [
          {
            internalType: "bytes4",
            name: "",
            type: "bytes4",
          },
        ],
        stateMutability: "pure",
        type: "function",
      },
      {
        inputs: [
          {
            internalType: "address",
            name: "targetContract",
            type: "address",
          },
          {
            internalType: "bytes",
            name: "calldataPayload",
            type: "bytes",
          },
        ],
        name: "simulate",
        outputs: [
          {
            internalType: "bytes",
            name: "response",
            type: "bytes",
          },
        ],
        stateMutability: "nonpayable",
        type: "function",
      },
      {
        inputs: [
          {
            internalType: "bytes4",
            name: "interfaceId",
            type: "bytes4",
          },
        ],
        name: "supportsInterface",
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
            name: "",
            type: "address",
          },
          {
            internalType: "address",
            name: "",
            type: "address",
          },
          {
            internalType: "address",
            name: "",
            type: "address",
          },
          {
            internalType: "uint256",
            name: "",
            type: "uint256",
          },
          {
            internalType: "bytes",
            name: "",
            type: "bytes",
          },
          {
            internalType: "bytes",
            name: "",
            type: "bytes",
          },
        ],
        name: "tokensReceived",
        outputs: [],
        stateMutability: "pure",
        type: "function",
      },
    ], // Optional. Only needed with web3.js
    signMessageLibAbi: [
      {
        anonymous: false,
        inputs: [
          {
            indexed: true,
            internalType: "bytes32",
            name: "msgHash",
            type: "bytes32",
          },
        ],
        name: "SignMsg",
        type: "event",
      },
      {
        inputs: [
          {
            internalType: "bytes",
            name: "message",
            type: "bytes",
          },
        ],
        name: "getMessageHash",
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
            internalType: "bytes",
            name: "_data",
            type: "bytes",
          },
        ],
        name: "signMessage",
        outputs: [],
        stateMutability: "nonpayable",
        type: "function",
      },
    ], // Optional. Only needed with web3.js
    createCallAbi: [
      {
        anonymous: false,
        inputs: [
          {
            indexed: false,
            internalType: "address",
            name: "newContract",
            type: "address",
          },
        ],
        name: "ContractCreation",
        type: "event",
      },
      {
        inputs: [
          {
            internalType: "uint256",
            name: "value",
            type: "uint256",
          },
          {
            internalType: "bytes",
            name: "deploymentData",
            type: "bytes",
          },
        ],
        name: "performCreate",
        outputs: [
          {
            internalType: "address",
            name: "newContract",
            type: "address",
          },
        ],
        stateMutability: "nonpayable",
        type: "function",
      },
      {
        inputs: [
          {
            internalType: "uint256",
            name: "value",
            type: "uint256",
          },
          {
            internalType: "bytes",
            name: "deploymentData",
            type: "bytes",
          },
          {
            internalType: "bytes32",
            name: "salt",
            type: "bytes32",
          },
        ],
        name: "performCreate2",
        outputs: [
          {
            internalType: "address",
            name: "newContract",
            type: "address",
          },
        ],
        stateMutability: "nonpayable",
        type: "function",
      },
    ], // Optional. Only needed with web3.js
    simulateTxAccessorAbi: [
      {
        inputs: [],
        stateMutability: "nonpayable",
        type: "constructor",
      },
      {
        inputs: [
          {
            internalType: "address",
            name: "to",
            type: "address",
          },
          {
            internalType: "uint256",
            name: "value",
            type: "uint256",
          },
          {
            internalType: "bytes",
            name: "data",
            type: "bytes",
          },
          {
            internalType: "enum Enum.Operation",
            name: "operation",
            type: "uint8",
          },
        ],
        name: "simulate",
        outputs: [
          {
            internalType: "uint256",
            name: "estimate",
            type: "uint256",
          },
          {
            internalType: "bool",
            name: "success",
            type: "bool",
          },
          {
            internalType: "bytes",
            name: "returnData",
            type: "bytes",
          },
        ],
        stateMutability: "nonpayable",
        type: "function",
      },
    ], // Optional. Only needed with web3.js
  },
};
