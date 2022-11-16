import Web3 from "web3"
import Web3Adapter from "@gnosis.pm/safe-web3-lib"
import { SafeFactory } from "@gnosis.pm/safe-core-sdk"
import { safeConnected, safeDisconnected } from "../redux/reducers/gnosis"
import { addDaoAddress, addClubID } from "../redux/reducers/create"
import store from "../redux/store"
import { SmartContract } from "../api/contract"
import { createClub, fetchClub } from "../api/club"
import FactoryContract from "../abis/factoryContract.json"
import Router from "next/router"
import { createUser } from "../api/user"

async function gnosisSafePromise(owners, threshold, dispatch) {
  try {
    let th = owners.length - 1
    console.log("th", th)
    console.log("threshold", threshold)
    const web3 = new Web3(Web3.givenProvider)
    const safeOwner = await web3.eth.getAccounts()
    const ethAdapter = new Web3Adapter({
      web3,
      signerAddress: safeOwner[0],
    })
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
  formThreshold,
  factoryContractAddress,
  usdcContractAddress,
  gnosisTransactionUrl,
  usdcConvertDecimal
) {
  const web3 = new Web3(Web3.givenProvider)
  const safeOwner = await web3.eth.getAccounts()
  let daoAddress = null
  let tokenAddress = null
  let walletAddress = safeOwner[0]
  let networkId = null

  await web3.eth.net
    .getId()
    .then((id) => {
      networkId = id
    })
    .catch((err) => {
      console.log(err)
    })

  const smartContract = new SmartContract(
    FactoryContract,
    factoryContractAddress,
    undefined,
    usdcContractAddress,
    gnosisTransactionUrl
  )
  await gnosisSafePromise(owners, threshold, dispatch)
    .then((treasuryAddress) => {
      const value = smartContract.createDAO(
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
        treasuryAddress,
        quoram,
        formThreshold,
        usdcConvertDecimal
      )
      value.then(
        (result) => {
          daoAddress = result.events[0].address
          dispatch(addDaoAddress(result.events[0].address))
          // TODO: as of now, setting the tokenType to be static, by default erc20NonTransferable will be the contract
          const data = {
            name: tokenName,
            daoAddress: daoAddress,
            gnosisAddress: treasuryAddress,
            networkId: networkId,
            tokenType: "erc20NonTransferable",
          }
          const club = createClub(data)
          club.then((result) => {
            if (result.status !== 201) {
              console.log(result.statusText)
            } else {
              // create user in the API
              const data = {
                userAddress: walletAddress,
                clubs: [
                  {
                    clubId: result.data.clubId,
                    isAdmin: 1,
                  },
                ],
              }
              const createuser = createUser(data)
              createuser.then((result) => {
                if (result.error) {
                  console.log(result.error)
                }
              })

              let admins = owners
              admins.shift()
              console.log("admin", admins.length, admins, owners)
              if (admins.length) {
                for (let i in admins) {
                  const data = {
                    userAddress: admins[i],
                    clubs: [
                      {
                        clubId: result.data.clubId,
                        isAdmin: 1,
                      },
                    ],
                  }
                  const createuser = createUser(data)
                  createuser.then((result) => {
                    if (result.error) {
                      console.log(result.error)
                    }
                  })
                }
              }
              // 0xCcc701BD1c50807A26336bD07c5aA9cf0622cDB5, 0xF477909A8bda0a7afd2dc7dF30e42F20433d879c,0x5bcF355A4F0340A34695ED20688Cf71Dc9835F17
              console.log(owners)

              dispatch(addDaoAddress(result.data.daoAddress))
              dispatch(addClubID(result.data.clubId))

              const { pathname } = Router
              if (pathname == "/create") {
                Router.push(`/dashboard/${result.data.clubId}`, undefined, {
                  shallow: true,
                })
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
