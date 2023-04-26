import SafeAppsSDK from "@gnosis.pm/safe-apps-sdk";
import { fetchConfigById } from "./config";
import { addContractAddress } from "../redux/reducers/gnosis";
import { ApolloClient, InMemoryCache } from "@apollo/client";

const opts = {
  allowedDomains: [/gnosis-safe.io/],
};
const appsSdk = new SafeAppsSDK(opts);

// Global variables
export const MAIN_API_URL = process.env.NEXT_PUBLIC_API_HOST;
export const RINKEYBY_RPC_URL = process.env.NEXT_PUBLIC_RINKEYBY_RPC_URL;
export const GOERLI_RPC_URL = process.env.NEXT_PUBLIC_GOERLI_RPC_URL;
export const USDC_FAUCET_ADDRESS = process.env.NEXT_PUBLIC_USDC_FAUCET_ADDRESS;
export const POLYGON_RPC_URL = process.env.NEXT_PUBLIC_POLYGON_RPC_URL;
export const CLAIM_FACTORY_ADDRESS =
  process.env.NEXT_PUBLIC_CLAIM_FACTORY_ADDRESS;
export const NEW_FACTORY_ADDRESS = process.env.NEXT_PUBLIC_NEW_FACTORY_ADDRESS;
export const SUBGRAPH_URL = process.env.NEXT_PUBLIC_SUBGRAPH_API_ENDPOINT;

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
          factoryContractAddress: result.data[0].factoryContractAddress,
          usdcContractAddress: result.data[0].usdcContractAddress,
          transactionUrl: result.data[0].gnosisTransactionUrl,
          networkHex: result.data[0].networkHex,
          networkId: result.data[0].networkId,
          networkName: result.data[0].name,
        }),
      );
    }
  });
}
