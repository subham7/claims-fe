import { fetchConfigById } from "./config";
import { addContractAddress } from "../redux/reducers/gnosis";
import { ApolloClient, InMemoryCache } from "@apollo/client";
import { NETWORK_RPC_URL } from "utils/constants";

const opts = {
  allowedDomains: [/gnosis-safe.io/],
};

// Global variables
export const MAIN_API_URL = process.env.NEXT_PUBLIC_API_HOST;

// Faucet
export const USDC_FAUCET_ADDRESS = process.env.NEXT_PUBLIC_USDC_FAUCET_ADDRESS;

// API KEY
export const COVALENT_API = process.env.NEXT_PUBLIC_COVALENT_API_KEY;

// Subgraph URL
export const SUBGRAPH_URL_GOERLI =
  process.env.NEXT_PUBLIC_SUBGRAPH_API_ENDPOINT_GOERLI;
export const SUBGRAPH_URL_POLYGON =
  process.env.NEXT_PUBLIC_SUBGRAPH_API_ENDPOINT_POLYGON;
export const CLAIMS_SUBGRAPH_URL_GOERLI =
  process.env.NEXT_PUBLIC_CLAIMS_SUBGRAPH_API_ENDPOINT_GOERLI;
export const CLAIMS_SUBGRAPH_URL_POLYGON =
  process.env.NEXT_PUBLIC_CLAIMS_SUBGRAPH_API_ENDPOINT_POLYGON;
export const CLAIMS_SUBGRAPH_URL_BASE =
  process.env.NEXT_PUBLIC_CLAIMS_SUBGRAPH_API_ENDPOINT_BASE;

// Not Using this for now
export const SUBGRAPH_CLIENT = new ApolloClient({
  uri: process.env.NEXT_PUBLIC_SUBGRAPH_API_ENDPOINT,
  cache: new InMemoryCache(),
});

export function updateDynamicAddress(networkId, dispatch) {
  try {
    const networkData = fetchConfigById(networkId);

    NETWORK_RPC_URL[networkId];
    networkData.then((result) => {
      if (result.status != 200) {
        console.log(result.error);
      } else {
        dispatch(
          addContractAddress({
            factoryContractAddress: result?.data[0]?.factoryContract,
            usdcContractAddress: result?.data[0]?.depositTokenContract,
            actionContractAddress: result?.data[0]?.tokenTransferActionContract,
            subgraphUrl: result?.data[0]?.subgraph,
            transactionUrl: result?.data[0]?.gnosisTransactionUrl,
            networkHex: result?.data[0]?.networkHex,
            networkId: result?.data[0]?.networkId,
            networkName: result?.data[0]?.name,
          }),
        );
      }
    });
  } catch (error) {
    console.log(error);
  }
}
