import React from "react"
import Onboard from "@web3-onboard/core"
import injectedModule from "@web3-onboard/injected-wallets"


const INFURA_ID = "sdf"
const ETH_ROPSTEN_RPC = `https://ropsten.infura.io/v3/946205020d6c477192b1178b3c5f8590`
const ETH_MAINNET_RPC = `https://mainnet.infura.io/v3/${INFURA_ID}`
const ETH_RINKEBY_RPC = `https://rinkeby.infura.io/v3/${INFURA_ID}`
const MATIC_MAINNET_RPC = 'https://matic-mainnet.chainstacklabs.com'

const injected = injectedModule()

export const onboard = Onboard({
  wallets: [injected],
  chains: [
    {
      id: "0x1", // chain ID must be in hexadecimel
      token: "ETH", // main chain token
      label: "Ethereum Mainnet",
      rpcUrl: ETH_MAINNET_RPC
    },
    {
      id: "0x3",
      token: "tROP",
      label: "Ethereum Ropsten Testnet",
      rpcUrl: ETH_ROPSTEN_RPC,
    },
    {
      id: "0x4",
      token: "rETH",
      label: "Ethereum Rinkeby Testnet",
      rpcUrl: ETH_RINKEBY_RPC,
    },
    {
      id: "0x38",
      token: "BNB",
      label: "Binance Smart Chain",
      rpcUrl: "https://bsc-dataseed.binance.org/",
    },
    {
      id: "0x89",
      token: "MATIC",
      label: "Matic Mainnet",
      rpcUrl: "https://matic-mainnet.chainstacklabs.com",
    },
    {
      id: "0xfa",
      token: "FTM",
      label: "Fantom Mainnet",
      rpcUrl: "https://rpc.ftm.tools/",
    },
  ],
  appMetadata: {
    name: "StationX",
    icon: "/assets/images/monogram.png",
    logo: "/assets/images/monogram.png",
    description: "My app using Onboard",
    recommendedInjectedWallets: [
      { name: "MetaMask", url: "https://metamask.io" },
    ],
  },
})

export async function connectWallet() {
  const wallets = await onboard.connectWallet()
  // const success = await onboard.setChain({ chainId: "0x38" })
  console.log(wallets)
}

export async function setUserChain() {
  const setChain = await onboard.setChain({ chainId: "0x1" })
  console.log(setChain)
}

const walletsSub = onboard.state.select('wallets')
const { unsubscribe } = walletsSub.subscribe(wallets => {
  const connectedWallets = wallets.map(({ label }) => label)
  localStorage.setItem(
    'connectedWallets',
    JSON.stringify(connectedWallets)
  )
})