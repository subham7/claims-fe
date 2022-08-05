import React, { createContext, useState, useContext, useEffect } from 'react'
import Router, { useRouter } from 'next/router'
import { connectWallet } from "../utils/wallet"
import { useDispatch, useSelector } from "react-redux"
import store from "../../src/redux/store"
import { CircularProgress, Backdrop, Button, Typography } from "@mui/material"
import { checkNetwork } from "./wallet"
import {loginToken, refreshToken} from "../api/auth";


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
          const getLoginToken = loginToken(wallet[0][0].address)
          getLoginToken.then((response) => {
            if (response.status !== 200) {
              console.log(response.data.error)
              router.push('/')
            } else {
              console.log(response)
              setJwtToken(response.data.tokens.access.token)
              setRefreshToken(response.data.tokens.access.refreshToken)
            }
          })
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

export function getJwtToken() {
  return sessionStorage.getItem("jwt")
}

export function setJwtToken(token) {
  sessionStorage.setItem("jwt", token)
}

export function getRefreshToken() {
  return sessionStorage.getItem("refreshToken")
}

export function setRefreshToken(token) {
  sessionStorage.setItem("refreshToken", token)
}
