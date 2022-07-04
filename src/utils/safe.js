import Web3 from "web3"
import Web3Adapter from "@gnosis.pm/safe-web3-lib"

import { SafeFactory } from "@gnosis.pm/safe-core-sdk"
//import { ethAdapter } from "./web3-adapter"
import { safeConnected, safeDisconnected } from "../redux/reducers/gnosis"
import { addDaoAddress, addClubID } from "../redux/reducers/create"
import store from "../redux/store"
import { createClub, SmartContract, FACTORY_CONTRACT_ADDRESS, fetchClub } from "../api"
import FactoryContract from "../abis/factoryContract.json"
import Router from "next/router"
import { createUser } from "../../src/api/index"

async function gnosisSafePromise(owners, threshold, dispatch) {
  try {
    const web3 = new Web3(Web3.givenProvider)
    const safeOwner = await web3.eth.getAccounts()
    const ethAdapter = new Web3Adapter({
      web3,
      signerAddress: safeOwner[0],
    })

    console.log(ethAdapter)
    const safeFactory = await SafeFactory.create({ ethAdapter })
    const safeAccountConfig = {
      owners,
      threshold,
    }
    const safeSdk = await safeFactory.deploySafe({ safeAccountConfig })
    const newSafeAddress = safeSdk.getAddress()
    dispatch(safeConnected(newSafeAddress, safeSdk))
    return newSafeAddress
  } catch {
    return "Gnosis safe connection cannot be established!"
  }
}

export async function initiateConnection(
  owners,
  threshold,
  dispatch,
  tokenName,
  tokenSymbol,
  totalDeposit,
  minDeposit,
  maxDeposit,
  ownerFee,
  closeDate,
  feeUSDC,
  quoram,
  formThreshold
) {
  const web3 = new Web3(Web3.givenProvider)
  const safeOwner = await web3.eth.getAccounts()
  let daoAddress = null
  let tokenAddress = null
  let walletAddress = safeOwner[0]

  const smartContract = new SmartContract(
    FactoryContract,
    FACTORY_CONTRACT_ADDRESS,
    undefined
  )
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
        formThreshold
      )
      value.then(
        (result) => {
          console.log(result)
          daoAddress = result.events[1].address
          tokenAddress = result.events[0].address
          dispatch(addDaoAddress(result[0]))
          const data = {
            name: tokenName,
            tokenAddress: tokenAddress,
            daoAddress: daoAddress,
            treasuryAddress: treasuryAddress,
          }
          const club = createClub(data)
          club.then((result) => {
            if (result.status !== 201) {
              console.log(result.statusText)
            } else {
              // create user in the API
              const data = {
                "userAddress": walletAddress,
                "clubs": [
                  {
                    "clubId": result.data.clubId,
                    "isAdmin": 1,
                  }
                ]
              }
              const createuser = createUser(
                data
              )
              createuser.then((result) => {
                if (result.error) {
                  console.log(result.error)
                }
              })

              dispatch(addDaoAddress(result.data.daoAddress))
              dispatch(addClubID(result.data.clubId))

              const { pathname } = Router
              if (pathname == "/create") {
                Router.push(`/dashboard/${result.data.clubId}`, undefined, {shallow: true})
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
