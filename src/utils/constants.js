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
  "0x5": process.env.NEXT_PUBLIC_GOERLI_RPC_URL,
  "0x89": process.env.NEXT_PUBLIC_POLYGON_MAINNET_RPC_URL,
  "0x2105": process.env.NEXT_PUBLIC_BASE_MAINNET_RPC_URL,
  "0xa4b1": process.env.NEXT_PUBLIC_ARBITRUM_ONE_RPC_URL,
};

export const NETWORK_NAME = {
  "0x89": "matic-mainnet",
  "0x2105": "base-mainnet",
  "0xa4b1": "arbitrum-mainnet",
};

export const IGNORE_TOKENS = [
  "0xeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee",
  "0x0000000000000000000000000000000000001010",
];

export const NETWORK_IDs = ["0x89", "0x2105", "0xa4b1"];

export const CHAIN_IDs = {
  137: "Polygon",
  5: "Goerli",
  8453: "Base",
  42161: "Arbitrum",
};
