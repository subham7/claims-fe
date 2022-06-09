import React, { createContext, useState, useContext, useEffect } from 'react'
import Router, { useRouter } from 'next/router'
import { connectWallet } from "../utils/wallet"
import { useDispatch } from "react-redux"
import store from "../../src/redux/store"

export function ProtectRoute(Component) {
  const AuthenticatedComponent = () => {
    const router = useRouter()
    const dispatch = useDispatch()
    const [walletAddress, setWalletAddress] = useState(null)
    const [walletLoaded, setWalletLoaded] = useState(false)

    useEffect(() => {
      setWalletAddress(localStorage.getItem('wallet'))
      setWalletLoaded(localStorage.getItem('isWalletConnected'))
      const auth = async () => {
        if (!walletLoaded) {
          Router.push('/')
        }
      }
      auth()
    }, [walletAddress])
    return <Component wallet={walletAddress} />
  }
  return AuthenticatedComponent
}