import { SafeFactory } from '@gnosis.pm/safe-core-sdk'
import { ethAdapter } from './web3-adapter'
import { safeConnected, safeDisconnected } from '../redux/reducers/gnosis'
import store from '../redux/store'
import { createClub, createDAO } from '../api'

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
  let daoAddress = null;
  let tokenAddress = null;
  await gnosisSafePromise(owners, threshold, dispatch)
    .then((safeAddress) => {
      const value = createDAO(
        tokenName,
        tokenSymbol,
        totalDeposit,
        minDeposit,
        maxDeposit,
        ownerFee,
        closeDate,
        feeUSDC,
        safeAddress,
        quoram,
        formThreshold
      )
      value.then(
        (result) => {
          daoAddress = result[0]
          tokenAddress = result[1]
          const data = {
            "name": tokenName,
            "tokenAddress" : tokenAddress,
            "daoAddress": daoAddress,
            "treasuryAddress": safeAddress
          }
          const club = createClub(data)
          if(club.error){
            console.log(club.error)
          }
          else{
            console.log(club.data)
          }
        },
        (error) => {
        console.log(error)
        }
      )
    })
  .catch((errorMsg) => {
    console.log(errorMsg)
  })
}