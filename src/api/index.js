import SafeAppsSDK from '@gnosis.pm/safe-apps-sdk';
import { fetchConfigById } from './config';

const opts = {
  allowedDomains: [/gnosis-safe.io/],
}

const appsSdk = new SafeAppsSDK(opts)

// Global variables
export const MAIN_API_URL = process.env.NEXT_PUBLIC_API_HOST
export let FACTORY_CONTRACT_ADDRESS = process.env.NEXT_PUBLIC_FACTORY_CONTRACT_ADDRESS
export let USDC_CONTRACT_ADDRESS = process.env.NEXT_PUBLIC_USDC_CONTRACT_ADDRESS
export let RPC_URL = process.env.NEXT_PUBLIC_RPC_URL
export let GNOSIS_TRANSACTION_URL = process.env.NEXT_PUBLIC_GNOSIS_TRANSACTION_URL

export function updateDynamicAddress(networkId) {
  const networkData = fetchConfigById(networkId)
  networkData.then((result) => {
    if (result.status != 200) {
      console.log(result.error)
    } else {
      console.log("Befored", FACTORY_CONTRACT_ADDRESS, USDC_CONTRACT_ADDRESS, RPC_URL, GNOSIS_TRANSACTION_URL)

      FACTORY_CONTRACT_ADDRESS = result.data[0].factoryContractAddress
      USDC_CONTRACT_ADDRESS = result.data[0].usdcContractAddress
      RPC_URL = result.data[0].rpcUrl
      GNOSIS_TRANSACTION_URL = result.data[0].gnosisTransactionUrl

      console.log(FACTORY_CONTRACT_ADDRESS, USDC_CONTRACT_ADDRESS, RPC_URL, GNOSIS_TRANSACTION_URL)
    }
  })
}