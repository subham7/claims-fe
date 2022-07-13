import React, { createContext, useState, useContext, useEffect } from 'react'
import Router, { useRouter } from 'next/router'
import { connectWallet } from "../utils/wallet"
import { useDispatch, useSelector } from "react-redux"
import store from "../../src/redux/store"
import { CircularProgress, Backdrop, Button, Typography } from "@mui/material"
import { checkNetwork } from "./wallet"



export default function ProtectRoute(Component) {
    const AuthenticatedComponent = () => {
      const router = useRouter()
      const dispatch = useDispatch()
      const [walletAddress, setWalletAddress] = useState(null)
      const [walletLoaded, setWalletLoaded] = useState(false)
      const wallet = useSelector(state => {return state.create.value})
      const [redirect, setRedirect] = useState(false)

      const handleRedirectClick = () => {
        router.push('/')
      }

    useEffect(() => {
      const switched = checkNetwork()
      const handleMount = async () => {
        if (wallet !== null) {
          setWalletAddress(wallet[0][0].address)
          setWalletLoaded(true)
        }
        if (walletAddress === null && !walletLoaded ){
          setRedirect(true)
        }
        if (redirect) {
          router.push('/')
          setRedirect(false)
        } 
      }
      handleMount();
    }, [])
        
    
    return walletLoaded ? <Component wallet={walletAddress} /> : (<Backdrop sx={{ color: "#fff", zIndex: (theme) => theme.zIndex.drawer + 1 }} open={redirect}><Button onClick={handleRedirectClick}>Home</Button></Backdrop>);
    }
    return AuthenticatedComponent;
  }