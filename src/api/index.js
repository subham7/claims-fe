// import SafeAppsSDK from "@gnosis.pm/safe-apps-sdk";
import { fetchConfigById } from "./config";
import { addContractAddress } from "../redux/reducers/gnosis";
import { ApolloClient, InMemoryCache } from "@apollo/client";

const opts = {
  allowedDomains: [/gnosis-safe.io/],
};
// const appsSdk = new SafeAppsSDK(opts);

// Global variables
export const MAIN_API_URL = process.env.NEXT_PUBLIC_API_HOST;

// Faucet
export const USDC_FAUCET_ADDRESS = process.env.NEXT_PUBLIC_USDC_FAUCET_ADDRESS;

// RPCs
export const RINKEYBY_RPC_URL = process.env.NEXT_PUBLIC_RINKEYBY_RPC_URL;
export const GOERLI_RPC_URL = process.env.NEXT_PUBLIC_GOERLI_RPC_URL;
export const POLYGON_MAINNET_RPC_URL =
  process.env.NEXT_PUBLIC_POLYGON_MAINNET_RPC_URL;

// Claim Factory
export const CLAIM_FACTORY_ADDRESS_GOERLI =
  process.env.NEXT_PUBLIC_CLAIM_FACTORY_ADDRESS_GOERLI;
export const CLAIM_FACTORY_ADDRESS_POLYGON =
  process.env.NEXT_PUBLIC_CLAIM_FACTORY_ADDRESS_POLYGON;

// Club Factory
export const FACTORY_ADDRESS_GOERLI =
  process.env.NEXT_PUBLIC_NEW_FACTORY_ADDRES_GOERLI;
export const FACTORY_ADDRESS_POLYGON =
  process.env.NEXT_PUBLIC_NEW_FACTORY_ADDRESS_POLYGON;

// Action Contracts
export const AIRDROP_ACTION_ADDRESS_GOERLI =
  process.env.NEXT_PUBLIC_AIRDROP_ACTION_ADDRESS_GOERLI;
export const AIRDROP_ACTION_ADDRESS_POLYGON =
  process.env.NEXT_PUBLIC_AIRDROP_ACTION_ADDRESS_POLYGON;

// Subgraph URL
export const SUBGRAPH_URL_GOERLI =
  process.env.NEXT_PUBLIC_SUBGRAPH_API_ENDPOINT_GOERLI;
export const SUBGRAPH_URL_POLYGON =
  process.env.NEXT_PUBLIC_SUBGRAPH_API_ENDPOINT_POLYGON;

// Not Using this for now
export const SUBGRAPH_CLIENT = new ApolloClient({
  uri: process.env.NEXT_PUBLIC_SUBGRAPH_API_ENDPOINT,
  cache: new InMemoryCache(),
});

export function updateDynamicAddress(networkId, dispatch) {
  const networkData = fetchConfigById(networkId);
  networkData.then((result) => {
    if (result.status != 200) {
      console.log(result.error);
    } else {
      dispatch(
        addContractAddress({
          factoryContractAddress: "0x43d087bE7aa873B3F7cF012E6650b14042CF5129",
          usdcContractAddress: result.data[0].usdcContractAddress,
          actionContractAddress: "",
          subgraphUrl: "",
          transactionUrl: result.data[0].gnosisTransactionUrl,
          networkHex: result.data[0].networkHex,
          networkId: result.data[0].networkId,
          networkName: result.data[0].name,
        }),
      );
    }
  });
}
