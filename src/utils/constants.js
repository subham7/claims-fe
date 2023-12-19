import { createCallAbi } from "abis/gnosis-abis/createCallAbi";
import { fallbackHandlerAbi } from "abis/gnosis-abis/fallbackHandlerAbi";
import { safeMasterCopyAbi } from "abis/gnosis-abis/safeMasterCopyAbi";
import { safeProxyFactoryAbi } from "abis/gnosis-abis/safeProxyFactoryAbi";
import {
  multiSendAbi,
  multiSendCallOnlyAbi,
} from "abis/gnosis-abis/safeSendAbi";
import { signMessageLibAbi } from "abis/gnosis-abis/signMessageLibAbi";
import { simulateTxAccessorAbi } from "abis/gnosis-abis/simulateTxAccessorAbi";

export const BLOCK_CONFIRMATIONS = 4;
export const BLOCK_TIMEOUT = 240000;
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

export const supportedChainsDrops = [
  "0x89",
  "0x2105",
  "0xa4b1",
  "0xe708",
  "0x38",
  "0x1388",
  "0x64",
  "0x82750",
  "0xa9",
  "0x28c5f",
  "0x1",
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
    factoryContractAddress: "0x726D3e4fBD321c4cD88769C16f5BAFfaC98D95Ad",
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
    logoUri: "/assets/networks/pol.jpeg",
    stargateStakingAddresses: [
      "0x2791bca1f2de4661ed88a30c99a7a9449aa84174",
      "0xc2132d05d31c914a87c6611c10748aeb04b58e8f",
      "0x8f3cf7ad23cd3cadbd9735aff958023239c6a063",
      "0xa3fa99a148fa48d14ed51d610c367c61876997f1",
    ],
    stargateUnstakingAddresses: [
      "0x1205f31718499dbf1fca446663b532ef87481fe1",
      "0x29e38769f23701a2e4a8ef0492e19da4604be62c",
      "0x1c272232df0bb6225da87f4decd9d37c32f63eea",
      "0x8736f92646b2542b3e5f3c63590ca7fe313e283b",
    ],
    stargateRouterAddress: "0x45A01E4e04F14f7A4a6702c74187c5F6222033cd",
    stargatePoolIds: {
      "0x2791bca1f2de4661ed88a30c99a7a9449aa84174": 1,
      "0xc2132d05d31c914a87c6611c10748aeb04b58e8f": 2,
      "0x8f3cf7ad23cd3cadbd9735aff958023239c6a063": 3,
      "0xa3fa99a148fa48d14ed51d610c367c61876997f1": 16,
      "0x1205f31718499dbf1fca446663b532ef87481fe1": 1,
      "0x29e38769f23701a2e4a8ef0492e19da4604be62c": 2,
      "0x1c272232df0bb6225da87f4decd9d37c32f63eea": 3,
      "0x8736f92646b2542b3e5f3c63590ca7fe313e283b": 16,
    },
    disburseContractAddress: "0x2F73a97D1be96853AF8E2b8F29E0F2AF332EA9f5",
    uniswapRouterAddress: "0xE592427A0AEce92De3Edee1F18E0157C05861564",
    gnosisTxUrl: "https://safe-transaction-polygon.safe.global/",
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
    factoryContractAddress: "",
    claimFactoryAddress: "0x14E92a30fc70F8544b0DDB5fd87B773bC0DD68e6",
    claimsSubgraphUrl:
      "https://api.thegraph.com/subgraphs/name/subham7/stnx-claim",
    covalentNetworkName: "goerli-testnet",
    nativeToken: "0xeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee",
    blockExplorerUrl: "https://goerli.etherscan.io",
    disburseContractAddress: "0x63D57d534a44f486EE2cCDcd53EbB7FA988cA5d5",
    gnosisTxUrl: "https://safe-transaction-goerli.safe.global/",
  },
  "0x1": {
    chainName: "Ethereum Mainnet",
    shortName: "Ethereum",
    chainId: 1,
    nativeCurrency: {
      name: "ETH",
      decimals: 18,
      symbol: "ETH",
    },
    rpcUrls: ["https://eth-rpc.gateway.pokt.network"],
    appRpcUrl: `https://mainnet.infura.io/v3/${process.env.NEXT_PUBLIC_INFURA_API_KEY}`,
    factoryContractAddress: "",
    claimFactoryAddress: "0x7aA33CC623Db79d5fFa859bA6cBE2Fb93c237401",
    claimsSubgraphUrl:
      "https://api.goldsky.com/api/public/project_clkur95905vrg38uwhvw24amx/subgraphs/stnx-claim-eth/prod/gn",
    covalentNetworkName: "eth-mainnet",
    nativeToken: "0xeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee",
    blockExplorerUrl: "https://etherscan.io",
    disburseContractAddress: "0x8b41c0aa45c86cebcfed5fb3744bf99ac8fb45c3",
    gnosisTxUrl: "https://safe-transaction-mainnet.safe.global/",
    logoUri: "/assets/networks/eth.png",
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
    factoryContractAddress: "0xeb6FE72d1Df22D9936D4FA317D7948E643aF92CB",
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
    disburseContractAddress: "0x9e812abE64b47FFB970ea908Db27a1E7Ca2f15b6",
    gnosisTxUrl: "https://safe-transaction-base.safe.global/",
    logoUri: "/assets/networks/base-mainnet.png",
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
    factoryContractAddress: "",
    claimFactoryAddress: "0x28F06a3415A741367303Db36a6646C354cCE1340",
    claimsSubgraphUrl:
      "https://api.goldsky.com/api/public/project_clkur95905vrg38uwhvw24amx/subgraphs/stnx-claim-arbitrum/prod/gn",
    covalentNetworkName: "arbitrum-mainnet",
    nativeToken: "0xeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee",
    blockExplorerUrl: "https://arbiscan.io",
    disburseContractAddress: "",
    gnosisTxUrl: "https://safe-transaction-arbitrum.safe.global/",
    logoUri: "/assets/networks/arbitrum.png",
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
    factoryContractAddress: "0xd3AfdA70B888388a1d5e8737Ba8b533fFE352e92",
    claimFactoryAddress: "0x50702Fd9086BAbDB0A3A576bFe22D4dD47b09937",
    claimsSubgraphUrl:
      "https://api.goldsky.com/api/public/project_clkur95905vrg38uwhvw24amx/subgraphs/stnx-claim-linea/0.0.1/gn",
    stationSubgraphUrl:
      "https://api.goldsky.com/api/public/project_clkur95905vrg38uwhvw24amx/subgraphs/stnx-linea/0.0.1/gn",
    covalentNetworkName: "linea-mainnet",
    nativeToken: "0xeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee",
    usdcAddress: "0x176211869cA2b568f2A7D4EE941E073a821EE1ff",
    airdropContractAddress: "0xd9b4bCCD76E4c35AFa4b473af723fBb19B3E65e8",
    blockExplorerUrl: "https://lineascan.build",
    disburseContractAddress: "0xE6301e65e1371eeECFBB124872a6C3d0F8288DE1",
    gnosisTxUrl: "https://transaction.safe.linea.build",
    stargateStakingAddresses: ["0xeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee"],
    stargateUnstakingAddresses: ["0xaad094f6a75a14417d39f04e690fc216f080a41a"],
    stargateRouterAddress: "0x2F6F07CDcf3588944Bf4C42aC74ff24bF56e7590",
    stargatNativeRouterAddress: "0x8731d54E9D02c286767d56ac03e8037C07e01e98",
    stargatePoolIds: {
      "0xeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee": 13,
      "0xaad094f6a75a14417d39f04e690fc216f080a41a": 13,
    },
    logoUri: "/assets/networks/linea-mainnet.webp",
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
    factoryContractAddress: "",
    claimFactoryAddress: "0x80e1429430cfB717187BD37eb5Bd0076d77dcE85",
    claimsSubgraphUrl:
      "https://api.goldsky.com/api/public/project_clkur95905vrg38uwhvw24amx/subgraphs/stnx-claim-bsc/prod/gn",
    covalentNetworkName: "bsc-mainnet",
    nativeToken: "0xeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee",
    blockExplorerUrl: "https://bscscan.com",
    disburseContractAddress: "0x2105929127a1e57c5D6FBb4136ADe15771503963",
    gnosisTxUrl: "https://safe-transaction-bsc.safe.global/",
    logoUri: "/assets/networks/bnb.jpeg",
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
    factoryContractAddress: "0x0F1B31723aB54D45aFd80D94542677881d524d8F",
    claimFactoryAddress: "0x28F06a3415A741367303Db36a6646C354cCE1340",
    claimsSubgraphUrl:
      "https://api.goldsky.com/api/public/project_clkur95905vrg38uwhvw24amx/subgraphs/stnx-claim-mantle/0.0.2/gn",
    covalentNetworkName: "mantle-mainnet",
    nativeToken: "0xeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee",
    blockExplorerUrl: "https://explorer.mantle.xyz",
    disburseContractAddress: "0x8d122Ab1a05b780D45C4334948604264Bc4845DD",
    logoUri: "/assets/networks/mantle-mainnet.png",
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
    stationSubgraphUrl:
      "https://api.thegraph.com/subgraphs/name/subham7/stnx-be-gnosis",
    covalentNetworkName: "gnosis-mainnet",
    nativeToken: "0x9c58bacc331c9aa871afd802db6379a98e80cedb",
    usdcAddress: "0xddafbb505ad214d7b80b1f830fccc89b60fb7a83",
    airdropContractAddress: "0x45a27ea11D159A86AacE1eC24d3ba3d103642D9f",
    blockExplorerUrl: "https://gnosisscan.io/",
    disburseContractAddress: "",
    gnosisTxUrl: "https://safe-transaction-gnosis-chain.safe.global/",
    logoUri: "/assets/networks/gnosis.png",
  },
  "0x82750": {
    chainName: "Scroll",
    shortName: "Scroll",
    chainId: 534352,
    nativeCurrency: {
      name: "ETH",
      decimals: 18,
      symbol: "ETH",
    },
    rpcUrls: ["https://rpc.scroll.io"],
    appRpcUrl: `https://scroll.blockpi.network/v1/rpc/public	`,
    stationSubgraphUrl: "",
    covalentNetworkName: "scroll-mainnet",
    factoryContractAddress: "0xa2b1079BeEC97C2CA4283e1439E59967B41fb41c",
    claimFactoryAddress: "0x563993D2c56628cfBBdec3FC3B3fb94744BbA9A6",
    claimsSubgraphUrl:
      "https://api.goldsky.com/api/public/project_clkur95905vrg38uwhvw24amx/subgraphs/stnx-claim-scroll/prod/gn",
    nativeToken: "",
    usdcAddress: "0x06eFdBFf2a14a7c8E15944D1F4A48F9F95F663A4",
    airdropContractAddress: "",
    blockExplorerUrl: "https://blockscout.scroll.io/",
    disburseContractAddress: "0x3DA9Fb55Ab77b10F99C1C1f52C150280dbd5a611",
    logoUri: "/assets/networks/scroll.jpeg",
  },
  "0xa9": {
    chainName: "Manta",
    shortName: "Manta",
    chainId: 169,
    nativeCurrency: {
      name: "ETH",
      decimals: 18,
      symbol: "ETH",
    },
    rpcUrls: ["https://pacific-rpc.manta.network/http"],
    appRpcUrl: `https://pacific-rpc.manta.network/http`,
    stationSubgraphUrl: "",
    covalentNetworkName: "manta-mainnet",
    factoryContractAddress: "",
    claimFactoryAddress: "0x50702Fd9086BAbDB0A3A576bFe22D4dD47b09937",
    claimsSubgraphUrl:
      "https://api.goldsky.com/api/public/project_clkur95905vrg38uwhvw24amx/subgraphs/stnx-claim-manta/prod/gn",
    nativeToken: "",
    usdcAddress: "0xb73603C5d87fA094B7314C74ACE2e64D165016fb",
    airdropContractAddress: "",
    blockExplorerUrl: "https://pacific-explorer.manta.network/",
    disburseContractAddress: "0x7aA33CC623Db79d5fFa859bA6cBE2Fb93c237401",
    logoUri: "/assets/networks/manta.png",
  },
  "0x28c5f": {
    chainName: "Taiko",
    shortName: "Taiko",
    chainId: 167007,
    nativeCurrency: {
      name: "ETH",
      decimals: 18,
      symbol: "ETH",
    },
    rpcUrls: ["https://rpc.jolnir.taiko.xyz	"],
    appRpcUrl: `https://rpc.jolnir.taiko.xyz`,
    stationSubgraphUrl: "",
    covalentNetworkName: "taiko-jolnir-testnet",
    factoryContractAddress: "",
    claimFactoryAddress: "0x563993D2c56628cfBBdec3FC3B3fb94744BbA9A6",
    claimsSubgraphUrl:
      "https://api.goldsky.com/api/public/project_clkur95905vrg38uwhvw24amx/subgraphs/stnx-claim-taiko-tn/prod/gn",
    nativeToken: "",
    usdcAddress: "0xf0380c236Eb7C3Fc51a9b46706D27bA738B0BE7f",
    airdropContractAddress: "",
    blockExplorerUrl: "https://explorer.jolnir.taiko.xyz/",
    disburseContractAddress: "0x3DA9Fb55Ab77b10F99C1C1f52C150280dbd5a611",
    logoUri: "/assets/networks/taiko.jpeg",
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

export const scrollMainnet = {
  id: 534352,
  name: "Scroll",
  network: "Scroll",
  nativeCurrency: {
    decimals: 18,
    name: "Ether ",
    symbol: "ETH",
  },
  rpcUrls: {
    public: { http: ["https://rpc.scroll.io"] },
    default: { http: ["https://scroll.blockpi.network/v1/rpc/public"] },
  },
  blockExplorers: {
    etherscan: { name: "BlockScout", url: "https://blockscout.scroll.io/" },
    default: { name: "BlockScout", url: "https://blockscout.scroll.io/" },
  },
  contracts: {
    multicall3: {
      address: "0xcA11bde05977b3631167028862bE2a173976CA11",
      blockCreated: 14,
    },
  },
};

export const mantaMainnet = {
  id: 169,
  name: "Manta",
  network: "Manta",
  nativeCurrency: {
    decimals: 18,
    name: "Ether ",
    symbol: "ETH",
  },
  rpcUrls: {
    public: { http: ["https://pacific-rpc.manta.network/http"] },
    default: { http: ["https://pacific-rpc.manta.network/http"] },
  },
  blockExplorers: {
    etherscan: {
      name: "Manta Pacific Explorer",
      url: "https://pacific-explorer.manta.network/",
    },
    default: {
      name: "Manta Pacific Explorer",
      url: "https://pacific-explorer.manta.network/",
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
    safeMasterCopyAbi: safeMasterCopyAbi, // Optional. Only needed with web3.js
    safeProxyFactoryAbi: safeProxyFactoryAbi, // Optional. Only needed with web3.js
    multiSendAbi: multiSendAbi, // Optional. Only needed with web3.js
    multiSendCallOnlyAbi: multiSendCallOnlyAbi, // Optional. Only needed with web3.js
    fallbackHandlerAbi: fallbackHandlerAbi, // Optional. Only needed with web3.js
    signMessageLibAbi: signMessageLibAbi, // Optional. Only needed with web3.js
    createCallAbi: createCallAbi, // Optional. Only needed with web3.js
    simulateTxAccessorAbi: simulateTxAccessorAbi, // Optional. Only needed with web3.js
  },
  [59144]: {
    safeMasterCopyAddress: "0xd9Db270c1B5E3Bd161E8c8503c55cEABeE709552",
    safeProxyFactoryAddress: "0xa6B71E26C5e0845f74c812102Ca7114b6a896AB2",
    multiSendAddress: "0xA238CBeb142c10Ef7Ad8442C6D1f9E89e07e7761",
    multiSendCallOnlyAddress: "0x40A2aCCbd92BCA938b02010E17A5b8929b49130D",
    fallbackHandlerAddress: "0xf48f2B2d2a534e402487b3ee7C18c33Aec0Fe5e4",
    signMessageLibAddress: "0xA65387F16B013cf2Af4605Ad8aA5ec25a2cbA3a2",
    createCallAddress: "0x7cbB62EaA69F79e6873cD1ecB2392971036cFAa4",
    simulateTxAccessorAddress: "0x59AD6735bCd8152B84860Cb256dD9e96b85F69Da",
    safeMasterCopyAbi: safeMasterCopyAbi, // Optional. Only needed with web3.js
    safeProxyFactoryAbi: safeProxyFactoryAbi, // Optional. Only needed with web3.js
    multiSendAbi: multiSendAbi, // Optional. Only needed with web3.js
    multiSendCallOnlyAbi: multiSendCallOnlyAbi, // Optional. Only needed with web3.js
    fallbackHandlerAbi: fallbackHandlerAbi, // Optional. Only needed with web3.js
    signMessageLibAbi: signMessageLibAbi, // Optional. Only needed with web3.js
    createCallAbi: createCallAbi, // Optional. Only needed with web3.js
    simulateTxAccessorAbi: simulateTxAccessorAbi, // Optional. Only needed with web3.js
  },
};

export const dropsNetworksChaindId = [
  {
    chainId: 137,
    networkId: "0x89",
  },
  {
    chainId: 8453,
    networkId: "0x2105",
  },
  {
    chainId: 42161,
    networkId: "0xa4b1",
  },
  {
    chainId: 59144,
    networkId: "0xe708",
  },
  {
    chainId: 56,
    networkId: "0x38",
  },
  {
    chainId: 5000,
    networkId: "0x1388",
  },
  {
    chainId: 100,
    networkId: "0x64",
  },
  {
    chainId: 534352,
    networkId: "0x82750",
  },
  {
    chainId: 169,
    networkId: "0xa9",
  },
  {
    chainId: 167007,
    networkId: "0x28c5f",
  },
  {
    chainId: 1,
    networkId: "0x1",
  },
];

export const stationNetworksChainId = [
  {
    chainId: 137,
    networkId: "0x89",
  },
  {
    chainId: 1,
    networkId: "0x1",
  },
  {
    chainId: 100,
    networkId: "0x64",
  },
  {
    chainId: 59144,
    networkId: "0xe708",
  },
];
