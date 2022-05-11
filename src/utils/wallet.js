import React from "react"
import Onboard from "@web3-onboard/core"
import injectedModule from "@web3-onboard/injected-wallets"

const injected = injectedModule()

const INFURA_ID = "sdf"

const onboard = Onboard({
  wallets: [injected],
  chains: [
    {
      id: "0x1", // chain ID must be in hexadecimel
      token: "ETH", // main chain token
      label: "Ethereum Mainnet",
      rpcUrl: `https://mainnet.infura.io/v3/${INFURA_ID}`, // rpcURL required for wallet balances
    },
    {
      id: "0x3",
      token: "tROP",
      label: "Ethereum Ropsten Testnet",
      rpcUrl: `https://ropsten.infura.io/v3/946205020d6c477192b1178b3c5f8590`,
    },
    {
      id: "0x4",
      token: "rETH",
      label: "Ethereum Rinkeby Testnet",
      rpcUrl: `https://rinkeby.infura.io/v3/${INFURA_ID}`,
    },
    {
      id: "0x38",
      token: "BNB",
      label: "Binance Smart Chain",
      rpcUrl: "https://bsc-dataseed.binance.org/",
    },
    // {
    //   id: "0x89",
    //   token: "MATIC",
    //   label: "Matic Mainnet",
    //   rpcUrl: "https://matic-mainnet.chainstacklabs.com",
    // },
    {
      id: "0xfa",
      token: "FTM",
      label: "Fantom Mainnet",
      rpcUrl: "https://rpc.ftm.tools/",
    },
  ],
  appMetadata: {
    name: "My App",
    icon: "<SVG_ICON_STRING>",
    logo: "<SVG_LOGO_STRING>",
    description: "My app using Onboard",
    recommendedInjectedWallets: [
      { name: "Coinbase", url: "https://wallet.coinbase.com/" },
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
