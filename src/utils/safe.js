import { SafeFactory } from '@gnosis.pm/safe-core-sdk'
import { ethAdapter } from './web3-adapter'
import { safeConnected, safeDisconnected } from '../redux/reducers/gnosis'
import Web3 from 'web3'
import CreateDAO  from '../abis/DAO.json'
import store from '../redux/store'

async function gnosisSafePromise(owners, threshold, dispatch) {
  try{

    const safeFactory = await SafeFactory.create({ ethAdapter })

    const safeAccountConfig = {
      owners,
      threshold,
    }
    const safeSdk = await safeFactory.deploySafe({ safeAccountConfig })

    const newSafeAddress = safeSdk.getAddress()
    dispatch(safeConnected(newSafeAddress, safeSdk))
    return newSafeAddress
  }
  catch{
    return "Gnosis safe connection cannot be established!"
  }
  
}

export async function initiateConnection(owners, threshold, dispatch, tokenName, tokenSymbol, totalDeposit, minDeposit, maxDeposit, ownerFee, closeDate, feeUSDC, quoram, formThreshold) {

  await gnosisSafePromise(owners, threshold, dispatch)
    .then((safeAddress) => {
      console.log(successMsg)
      const days = Math.round((new Date(closeDate) - new Date()) / (1000 * 60 * 60 * 24))
      const web3 = new Web3('https://rinkeby.infura.io/v3/feaf3bb22fef436e996b4eb0e157dacd')
      const abi = CreateDAO.abi
      const address = '0xbfa33C88f614345F3cbaedB8174db04043E3E412'
      const contract = new web3.eth.Contract(abi, address)
      const value = contract.methods.createDAO(
        tokenName, 
        tokenSymbol, 
        totalDeposit, 
        minDeposit, 
        maxDeposit, 
        ownerFee, 
        days, 
        feeUSDC, 
        safeAddress, 
        quoram, 
        formThreshold
      ).call()
      console.log(value)
    })
  .catch((errorMsg) => {
    console.log(errorMsg)
  })
}