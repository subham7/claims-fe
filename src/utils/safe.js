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
  let walletAddress = null;
  store.subscribe(() => {
    const { create } = store.getState()
    if (create.value) {
      walletAddress = create.value[0][0].address
      console.log(walletAddress)
    }
  })
  const smartContract = new SmartContract(CreateDAO, FACTORY_CONTRACT_ADDRESS, walletAddress)
  await gnosisSafePromise(owners, threshold, dispatch)
    .then((treasuryAddress) => {
      
      const value = smartContract.createDAO(
        tokenName,
        tokenSymbol,
        totalDeposit,
        minDeposit,
        maxDeposit,
        ownerFee,
        closeDate,
        feeUSDC,
        treasuryAddress,
        quoram,
        formThreshold,
      )
      value.then(
        (result) => {
          console.log(result)
          daoAddress = result.events[1].address
          tokenAddress = result.events[0].address
          dispatch(addDaoAddress(result[0]))
          const data = {
            "name": tokenName,
            "tokenAddress" : tokenAddress,
            "daoAddress": daoAddress,
            "treasuryAddress": treasuryAddress
          }
          console.log(data)
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