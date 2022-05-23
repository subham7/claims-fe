import { SafeFactory } from '@gnosis.pm/safe-core-sdk'
import { ethAdapter } from './web3-adapter'
import { safeConnected, safeDisconnected } from '../redux/reducers/gnosis'


export async function initiateConnection(owners, threshold) {
    console.log(ethAdapter)
    const safeFactory = await SafeFactory.create({ ethAdapter })

    const safeAccountConfig = {
        owners,
        threshold,
      }
    const safeSdk = await safeFactory.deploySafe({ safeAccountConfig })
    const newSafeAddress = safeSdk.getAddress()
    dispatch(safeConnected(newSafeAddress, safeSdk))
}