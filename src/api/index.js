import SafeAppsSDK from '@gnosis.pm/safe-apps-sdk';
import { fetchConfigById } from './config';

const opts = {
  allowedDomains: [/gnosis-safe.io/],
}

const appsSdk = new SafeAppsSDK(opts)

      // Global variables
export const MAIN_API_URL = process.env.NEXT_PUBLIC_API_HOST
export const FACTORY_CONTRACT_ADDRESS = process.env.NEXT_PUBLIC_FACTORY_CONTRACT_ADDRESS
export const USDC_CONTRACT_ADDRESS = process.env.NEXT_PUBLIC_USDC_CONTRACT_ADDRESS
export const RPC_URL = process.env.NEXT_PUBLIC_RPC_URL
export const GNOSIS_TRANSACTION_URL = process.env.NEXT_PUBLIC_GNOSIS_TRANSACTION_URL