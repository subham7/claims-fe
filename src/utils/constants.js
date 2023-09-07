export const BLOCK_CONFIRMATIONS = 1;

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
      "https://api.thegraph.com/subgraphs/name/subham7/stnx-claim",
    covalentNetworkName: "matic-mainnet",
    nativeToken: "0x0000000000000000000000000000000000001010",
    airdropContractAddress: "0x0DF19560f74749a42215A16C3FC22FfAA1c4029A",
    aavePoolAddress: "0x794a61358D6845594F94dc1DB02A252b5b4814aD",
    aaveMaticPoolAddress: "0x1e4b7A6b903680eab0c5dAbcb8fD429cD2a9598c",
    aaveWrappedUsdcAddress: "0x625E7708f30cA75bfd92586e17077590C60eb4cD",
    aaveWrappedMaticAddress: "0x6d80113e533a2C0fe82EaBD35f1875DcEA89Ea97",
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
      "https://api.thegraph.com/subgraphs/name/subham7/stnx-claim-base",
    covalentNetworkName: "base-mainnet",
    nativeToken: "0xeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee",
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
      "https://api.thegraph.com/subgraphs/name/subham7/stnx-claim-arbitrum",
    covalentNetworkName: "arbitrum-mainnet",
    nativeToken: "0xeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee",
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
    covalentNetworkName: "linea-mainnet",
    nativeToken: "0xeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee",
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
      "https://api.thegraph.com/subgraphs/name/subham7/stnx-claim-bsc",
    covalentNetworkName: "bsc-mainnet",
    nativeToken: "0xeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee",
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
