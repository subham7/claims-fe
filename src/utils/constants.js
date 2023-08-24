export const CHAIN_CONFIG = {
  "0x89": {
    chainName: "Polygon Mainnet",
    chainId: 137,
    nativeCurrency: {
      name: "MATIC",
      decimals: 18,
      symbol: "MATIC",
    },
    rpcUrls: ["https://polygon-rpc.com/"],
    appRpcUrl: `https://polygon-mainnet.infura.io/v3/${process.env.NEXT_PUBLIC_INFURA_API_KEY}`,
    claimFactoryAddress: "0x47e6bFA71e490ADC8f0E33385aAdF85282E71002",
    claimsSubgraphUrl:
      "https://api.thegraph.com/subgraphs/name/subham7/stnx-claim",
    covalentNetworkName: "matic-mainnet",
    nativeToken: "0x0000000000000000000000000000000000001010",
  },
  "0x5": {
    chainName: "Goerli Testnet",
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
    chainId: 8453,
    nativeCurrency: {
      name: "Base ETH",
      decimals: 18,
      symbol: "ETH",
    },
    rpcUrls: ["https://mainnet.base.org"],
    appRpcUrl: `https://multi-attentive-snowflake.base-mainnet.discover.quiknode.pro/${process.env.NEXT_PUBLIC_QUICKNODE_API_KEY}/`,
    claimFactoryAddress: "0x50702Fd9086BAbDB0A3A576bFe22D4dD47b09937",
    claimsSubgraphUrl:
      "https://api.thegraph.com/subgraphs/name/subham7/stnx-claim-base",
    covalentNetworkName: "base-mainnet",
    nativeToken: "0xeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee",
  },
  "0xa4b1": {
    chainName: "Arbitrum One",
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
    chainId: 59144,
    nativeCurrency: {
      name: "Ether",
      decimals: 18,
      symbol: "ETH",
    },
    rpcUrls: ["https://rpc.linea.build"],
    appRpcUrl: `https://linea-mainnet.infura.io/v3/${process.env.NEXT_PUBLIC_INFURA_API_KEY}`,
    claimFactoryAddress: "0x50702Fd9086BAbDB0A3A576bFe22D4dD47b09937",
    // claimsSubgraphUrl:
    //   "https://api.thegraph.com/subgraphs/name/subham7/stnx-claim-arbitrum",
    covalentNetworkName: "linea-mainnet",
    nativeToken: "0xeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee",
  },
  "0x38": {
    chainName: "BNB Smart Chain",
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
};
