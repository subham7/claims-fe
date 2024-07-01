import { ApolloClient, InMemoryCache } from "@apollo/client";

const opts = {
  allowedDomains: [/gnosis-safe.io/],
};

export const SEAPORT_CONTRACT_ADDRESS =
  "0x00000000000000ADc04C56Bf30aC9d3c0aAF14dC";

// Global variables
export const MAIN_API_URL = process.env.NEXT_PUBLIC_API_HOST;
export const SPACE_API_URL = process.env.NEXT_PUBLIC_SPACE_API_HOST;

// Faucet
export const USDC_FAUCET_ADDRESS = process.env.NEXT_PUBLIC_USDC_FAUCET_ADDRESS;

// API KEY
export const COVALENT_API = process.env.NEXT_PUBLIC_COVALENT_API_KEY;
export const NFT_SCAN_KEY = process.env.NEXT_PUBLIC_NFT_SCAN_API_KEY;

// Subgraph URL

// Not Using this for now
export const SUBGRAPH_CLIENT = new ApolloClient({
  uri: process.env.NEXT_PUBLIC_SUBGRAPH_API_ENDPOINT,
  cache: new InMemoryCache(),
});
