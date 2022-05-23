import Web3 from 'web3'
import Web3Adapter from '@gnosis.pm/safe-web3-lib'

const web3 = new Web3(Web3.givenProvider || 'http://localhost:8545')
const safeOwner = "0x2f05FadE3F3030b387eCA20f7f7d5f5b12B8Dc06"

export const ethAdapter = new Web3Adapter({
  web3,
  signerAddress: safeOwner
})  
