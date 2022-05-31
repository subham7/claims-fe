import Web3 from 'web3'
import Web3Adapter from '@gnosis.pm/safe-web3-lib'

const web3 = new Web3(Web3.givenProvider)
const auth = web3.eth.getAccounts()
let safeOwner = null
auth.then((result) => {
  safeOwner = result
}, (error) => {
  console.log("Error connecting to Wallet!")
})

export const ethAdapter = new Web3Adapter({ web3, signerAddress: safeOwner })
