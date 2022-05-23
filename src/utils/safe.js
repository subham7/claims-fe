import { SafeFactory } from '@gnosis.pm/safe-core-sdk'
import { ethAdapter } from './web3-adapter'
import { safeConnected, safeDisconnected } from '../redux/reducers/gnosis'
import Web3 from 'web3'
import CreateDAO  from '../abis/DAO.json'

export async function initiateConnection(owners, threshold, dispatch) {
    const safeFactory = await SafeFactory.create({ ethAdapter })

    const safeAccountConfig = {
        owners,
        threshold,
      }
    const safeSdk = await safeFactory.deploySafe({ safeAccountConfig })
    const newSafeAddress = safeSdk.getAddress()
    dispatch(safeConnected(newSafeAddress, safeSdk))
}

export async function getValueFromContract(){
  const web3 = new Web3('https://ropsten.infura.io/v3/feaf3bb22fef436e996b4eb0e157dacd');
  const abi = CreateDAO.abi
  const address = '0xd4a461302d8c58A7EE9baC3734F17Be17f23D2dA'
  const contract = new web3.eth.Contract(abi, address)
  const value = await contract.methods.createDAO().call();
  console.log(value)
}