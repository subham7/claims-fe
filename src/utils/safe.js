import { SafeFactory } from '@gnosis.pm/safe-core-sdk'
import { ethAdapter } from './web3-adapter'
import { safeConnected, safeDisconnected } from '../redux/reducers/gnosis'
import { addDaoAddress } from '../redux/reducers/create'
import store from '../redux/store'
import { createClub, SmartContract, FACTORY_CONTRACT_ADDRESS } from '../api'
import CreateDAO from '../abis/DAO.json'
import Router from 'next/router'


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
  const smartContract = new SmartContract(CreateDAO, FACTORY_CONTRACT_ADDRESS)
  await gnosisSafePromise(owners, threshold, dispatch)
    .then((safeAddress) => {
      console.log(safeAddress)
      const value = smartContract.createDAO(
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
          dispatch(addDaoAddress(result[0]))
          const data = {
            "name": tokenName,
            "tokenAddress" : tokenAddress,
            "daoAddress": daoAddress,
            "treasuryAddress": safeAddress
          }
          const club = createClub(data)
          club.then((result) => {
            if(result.error){
              console.log(result.error)
            }
            else{
              const {pathname} = Router
              if(pathname == '/create' ){
                Router.push('/dashboard')
              }
            }
          })          
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