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
export const REFERRAL_ADDRESS = "0xe5ff122f1dc6deceef651bb324f8e8136375d1a6";

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
  "0x5",
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
    nativeToken: "0xeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee",
    usdcAddress: "0x2791Bca1f2de4661ED88A30C99A7a9449Aa84174",
    airdropContractAddress: "0x0DF19560f74749a42215A16C3FC22FfAA1c4029A",
    aavePoolAddress: "0x794a61358D6845594F94dc1DB02A252b5b4814aD",
    aaveMaticPoolAddress: "0x1e4b7A6b903680eab0c5dAbcb8fD429cD2a9598c",
    aaveWrappedUsdcAddress: "0x625E7708f30cA75bfd92586e17077590C60eb4cD",
    aaveWrappedMaticAddress: "0x6d80113e533a2C0fe82EaBD35f1875DcEA89Ea97",
    blockExplorerUrl: "https://polygonscan.com",
    logoUri: "/assets/networks/0x89.png",
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
    disburseContractAddress: "0xF83883501208AF71B70e76C60F331a23E074EC19",
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
    factoryContractAddress: "0x936eca063Bdd8e2C15637F8c7cd507216b9E7aAd",
    stationSubgraphUrl:
      "https://api.goldsky.com/api/public/project_clkur95905vrg38uwhvw24amx/subgraphs/stnx-goerli-1/0.0.1/gn",
    claimFactoryAddress: "0x14E92a30fc70F8544b0DDB5fd87B773bC0DD68e6",
    claimsSubgraphUrl:
      "https://api.thegraph.com/subgraphs/name/subham7/stnx-claim",
    covalentNetworkName: "eth-goerli",
    nativeToken: "0xeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee",
    usdcAddress: "0x07865c6E87B9F70255377e024ace6630C1Eaa37F",
    blockExplorerUrl: "https://goerli.etherscan.io",
    disburseContractAddress: "0x63D57d534a44f486EE2cCDcd53EbB7FA988cA5d5",
    gnosisTxUrl: "https://safe-transaction-goerli.safe.global/",
    staderStakingPoolAddress: "0xd0e400Ec6Ed9C803A9D9D3a602494393E806F823",
    staderETHxAddress: "0x3338eCd3ab3d3503c55c931d759fA6d78d287236",
    eigenLayerDepositPoolAddress: "0x779d1b5315df083e3F9E94cB495983500bA8E907",
    staderEigenStrategyAddress: "0x5d1E9DC056C906CBfe06205a39B0D965A6Df7C14",
    staderKelpPoolAddress: "0xd51d846ba5032b9284b12850373ae2f053f977b3",
    kelpRsETHAddress: "0xb4EA9175e99232560ac5dC2Bcbe4d7C833a15D56",
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
    factoryContractAddress: "0x3b0496DdFdC063E880630252Cabff2eEa6e8AA9e",
    stationSubgraphUrl:
      "https://api.goldsky.com/api/public/project_clkur95905vrg38uwhvw24amx/subgraphs/stnx-eth/prod/gn",
    usdcAddress: "0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48",
    airdropContractAddress: "0x22F3BDb0B4122dcDe2bFCb164ccD67650c630Ab3",
    claimFactoryAddress: "0x7aA33CC623Db79d5fFa859bA6cBE2Fb93c237401",
    claimsSubgraphUrl:
      "https://api.goldsky.com/api/public/project_clkur95905vrg38uwhvw24amx/subgraphs/stnx-claim-eth/prod/gn",
    covalentNetworkName: "eth-mainnet",
    nativeToken: "0xeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee",
    usdcAddress: "0xa0b86991c6218b36c1d19d4a2e9eb0ce3606eb48",
    blockExplorerUrl: "https://etherscan.io",
    disburseContractAddress: "0x8b41c0aa45c86cebcfed5fb3744bf99ac8fb45c3",
    gnosisTxUrl: "https://safe-transaction-mainnet.safe.global/",
    logoUri: "/assets/networks/0x1.png",
    kelpRsETHAddress: "0xA1290d69c65A6Fe4DF752f95823fae25cB99e5A7",
    staderKelpPoolAddress: "0x036676389e48133B63a802f8635AD39E752D375D",
    staderETHxAddress: "0xA35b1B31Ce002FBF2058D22F30f95D405200A15b",
    staderStakingPoolAddress: "0xcf5EA1b38380f6aF39068375516Daf40Ed70D299",
    staderEigenStrategyAddress: "0x9d7eD45EE2E8FC5482fa2428f15C971e6369011d",
    eigenLayerDepositPoolAddress: "0x858646372CC42E1A627fcE94aa7A7033e7CF075A",
    swellRswETHAddress: "0xFAe103DC9cf190eD75350761e95403b7b8aFa6c0",
    swellSwETHAddress: "0xf951E335afb289353dc249e82926178EaC7DEd78",
    swellEigenStrategyAddress: "0x0Fe4F44beE93503346A3Ac9EE5A26b130a5796d6",
    renzoStakingPoolAddress: "0x74a09653A083691711cF8215a6ab074BB4e99ef5",
    renzoEzETHAddress: "0xbf5495Efe5DB9ce00f80364C8B423567e58d2110",
    lidoStETHAddress: "0xae7ab96520DE3A18E5e111B5EaAb095312D7fE84",
    lidoEigenStrategyAddress: "0x93c4b944D05dfe6df7645A86cd2206016c51564D",
    restakeDepositPoolAddress: "0xe384251B5f445A006519A2197bc6bD8E5fA228E5",
    restakeRstETHAddress: "0xc3Ac43635d7Aa9Bf361094656C85de3311bE9a2c",
    rocketDepositPoolAddress: "0xDD3f50F8A6CafbE9b31a427582963f465E745AF8",
    rocketRETHAddress: "0xae78736Cd615f374D3085123A210448E74Fc6393",
    rocketEigenStrategyAddress: "0x1BeE69b7dFFfA4E2d53C2a2Df135C388AD25dCD2",
    mantleDepositPoolAddress: "0xe3cBd06D7dadB3F4e6557bAb7EdD924CD1489E8f",
    mantleMEthAddress: "0xd5F7838F5C461fefF7FE49ea5ebaF7728bB0ADfa",
    mantleEigenStrategyAddress: "0x298aFB19A105D59E74658C4C334Ff360BadE6dd2",
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
    disburseContractAddress: "0x63117D1D1405B582b13DAbddb57caa815E58F3e1",
    gnosisTxUrl: "https://safe-transaction-base.safe.global/",
    logoUri: "/assets/networks/0x2105.png",
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
    disburseContractAddress: "0x6d478Cb3bf01fCB71F9E4c9D06e2A26efCe27f9f",
    gnosisTxUrl: "https://safe-transaction-arbitrum.safe.global/",
    logoUri: "/assets/networks/0xa4b1.png",
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
    disburseContractAddress: "0xb6a15A4eaD9A15cD987e247AAF0d4283B9547A4D",
    gnosisTxUrl: "https://transaction.safe.linea.build",
    clipFinanceBatchAddressLinea: "0xfCcc0ECE0daD2Ef38c84de53168dC0923c6c68d1",
    clipFinanceStrategyRouterAddressLinea:
      "0x03A074D130144FcE6883F7EA3884C0a783d85Fb3",
    clipFinanceSharesTokenAddressLinea:
      "0xDD49bF14cAAE7a22bb6a58A76C4E998054859D9a",
    clipFinanceSharesPoolAddressLinea:
      "0xB4e319a082C61eDc7fddE36ec0f5f8B1f495D87A",
    stargateStakingAddresses: ["0xeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee"],
    stargateUnstakingAddresses: ["0xaad094f6a75a14417d39f04e690fc216f080a41a"],
    stargateRouterAddress: "0x2F6F07CDcf3588944Bf4C42aC74ff24bF56e7590",
    stargatNativeRouterAddress: "0x8731d54E9D02c286767d56ac03e8037C07e01e98",
    stargatePoolIds: {
      "0xeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee": 13,
      "0xaad094f6a75a14417d39f04e690fc216f080a41a": 13,
    },
    logoUri: "/assets/networks/0xe708.png",
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
    disburseContractAddress: "",
    gnosisTxUrl: "https://safe-transaction-bsc.safe.global/",
    logoUri: "/assets/networks/0x38.png",
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
    disburseContractAddress: "0xC34c665e3FAa1fAD30F3ADE71ADAec5F44459267",
    logoUri: "/assets/networks/0x1388.png",
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
    logoUri: "/assets/networks/0x64.png",
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
    logoUri: "/assets/networks/0x82750.png",
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
    logoUri: "/assets/networks/0xa9.png",
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
    logoUri: "/assets/networks/0x28c5f.png",
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
  [59144]: {
    safeMasterCopyAddress: "0xd9Db270c1B5E3Bd161E8c8503c55cEABeE709552",
    safeProxyFactoryAddress: "0xa6B71E26C5e0845f74c812102Ca7114b6a896AB2",
    multiSendAddress: "0xA238CBeb142c10Ef7Ad8442C6D1f9E89e07e7761",
    multiSendCallOnlyAddress: "0x40A2aCCbd92BCA938b02010E17A5b8929b49130D",
    fallbackHandlerAddress: "0xf48f2B2d2a534e402487b3ee7C18c33Aec0Fe5e4",
    signMessageLibAddress: "0xA65387F16B013cf2Af4605Ad8aA5ec25a2cbA3a2",
    createCallAddress: "0x7cbB62EaA69F79e6873cD1ecB2392971036cFAa4",
    simulateTxAccessorAddress: "0x59AD6735bCd8152B84860Cb256dD9e96b85F69Da",
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
  // {
  //   chainId: 100,
  //   networkId: "0x64",
  // },
  {
    chainId: 59144,
    networkId: "0xe708",
  },
];

export const ALLOWED_NETWORKS_FOR_STATION = ["0x89", "0x1", "0xe708"];
