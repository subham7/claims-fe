export const CLAIM_FACTORY_ADDRESS = {
  "0x5": "0x14E92a30fc70F8544b0DDB5fd87B773bC0DD68e6",
  "0x89": "0x47e6bFA71e490ADC8f0E33385aAdF85282E71002",
  "0x2105": "0x50702Fd9086BAbDB0A3A576bFe22D4dD47b09937",
  "0xa4b1": "0x28F06a3415A741367303Db36a6646C354cCE1340",
};

export const CLAIMS_SUBGRAPH_URL = {
  "0x5": "https://api.thegraph.com/subgraphs/name/subham7/stnx-claim",
  "0x89": "https://api.thegraph.com/subgraphs/name/subham7/stnx-claim",
  "0x2105": "https://api.thegraph.com/subgraphs/name/subham7/stnx-claim-base",
  "0xa4b1":
    "https://api.thegraph.com/subgraphs/name/subham7/stnx-claim-arbitrum",
};

export const NETWORK_RPC_URL = {
  "0x5": `https://eth-goerli.g.alchemy.com/v2/${process.env.NEXT_PUBLIC_ALCHEMY_API_KEY}`,
  "0x89": `https://polygon-mainnet.infura.io/v3/${process.env.NEXT_PUBLIC_INFURA_API_KEY}`,
  "0x2105": `https://multi-attentive-snowflake.base-mainnet.discover.quiknode.pro/${process.env.NEXT_PUBLIC_QUICKNODE_API_KEY}/`,
  "0xa4b1": `https://arbitrum-mainnet.infura.io/v3/${process.env.NEXT_PUBLIC_INFURA_API_KEY}`,
};

export const NETWORK_NAME = {
  "0x89": "matic-mainnet",
  "0x2105": "base-mainnet",
  "0xa4b1": "arbitrum-mainnet",
};

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
    claim_factory_address: "0x47e6bFA71e490ADC8f0E33385aAdF85282E71002",
    claims_subgraph_url:
      "https://api.thegraph.com/subgraphs/name/subham7/stnx-claim",
    covalent_network_name: "matic-mainnet",
    native_token: "0x0000000000000000000000000000000000001010",
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
    claim_factory_address: "0x14E92a30fc70F8544b0DDB5fd87B773bC0DD68e6",
    claims_subgraph_url:
      "https://api.thegraph.com/subgraphs/name/subham7/stnx-claim",
    native_token: "0xeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee",
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
    claim_factory_address: "0x50702Fd9086BAbDB0A3A576bFe22D4dD47b09937",
    claims_subgraph_url:
      "https://api.thegraph.com/subgraphs/name/subham7/stnx-claim-base",
    covalent_network_name: "base-mainnet",
    native_token: "0xeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee",
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
    claim_factory_address: "0x28F06a3415A741367303Db36a6646C354cCE1340",
    claims_subgraph_url:
      "https://api.thegraph.com/subgraphs/name/subham7/stnx-claim-arbitrum",
    covalent_network_name: "arbitrum-mainnet",
    native_token: "0xeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee",
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
    claim_factory_address: "0x50702Fd9086BAbDB0A3A576bFe22D4dD47b09937",
    // claims_subgraph_url:
    //   "https://api.thegraph.com/subgraphs/name/subham7/stnx-claim-arbitrum",
    covalent_network_name: "linea-mainnet",
    native_token: "0xeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee",
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
    claim_factory_address: "0x80e1429430cfB717187BD37eb5Bd0076d77dcE85",
    claims_subgraph_url:
      "https://api.thegraph.com/subgraphs/name/subham7/stnx-claim-bsc",
    covalent_network_name: "bsc-mainnet",
    native_token: "0xeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee",
  },
};
