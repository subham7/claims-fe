import React, { createContext, useState, useContext, useEffect } from 'react'
import Web3 from "web3" 
import Router, { useRouter } from 'next/router'
import { useDispatch, useSelector } from "react-redux"
import { fetchClub } from "../api/club"
import {
  addClubID,
  addClubName,
  addClubRoute,
  addDaoAddress,
  addWallet,
  addTokenAddress,
addClubImageUrl
} from '../redux/reducers/create'
import { checkNetwork } from "./wallet"
import {loginToken, refreshToken} from "../api/auth";
import {getExpiryTime, getJwtToken, getRefreshToken, setExpiryTime, setJwtToken, setRefreshToken} from "./auth";
import { addSafeAddress } from '../redux/reducers/gnosis';


const ClubFetch = (Component) => {
    const RetrieveDataComponent = () => {
      const router = useRouter()
      const {clubId} = router.query
      const dispatch = useDispatch()


      useEffect(() => {
        const switched = checkNetwork()
        if(clubId) {
          const clubData = fetchClub(clubId)
          clubData.then((result) => {
            if (result.status !== 200) {
            } else {
              const web3 = new Web3(window.web3)
              const checkedwallet = web3.utils.toChecksumAddress(localStorage.getItem("wallet"))
              const getLoginToken = loginToken(checkedwallet)
              getLoginToken.then((response) => {
                if (response.status !== 200) {
                  console.log(response.data.error)
                  router.push('/')
                } else {
                  setExpiryTime(response.data.tokens.access.expires)
                  const expiryTime = getExpiryTime()
                  const currentDate = Date()
                  setJwtToken(response.data.tokens.access.token)
                  setRefreshToken(response.data.tokens.refresh.token)
                  if (expiryTime < currentDate) {
                    const obtainNewToken = refreshToken(getRefreshToken(), getJwtToken())
                    obtainNewToken.then((tokenResponse) => {
                      if (response.status !== 200) {
                        console.log(tokenResponse.data.error)
                      }
                      else {
                        setExpiryTime(tokenResponse.data.tokens.access.expires)
                        setJwtToken(tokenResponse.data.tokens.access.token)
                        setRefreshToken(tokenResponse.data.tokens.refresh.token)
                      }
                    })
                      .catch((error) => {
                        console.log(error)
                      })
                  }
                }
              })
              dispatch(addWallet(checkedwallet))
              dispatch(addClubID(result.data[0].clubId))
              dispatch(addClubName(result.data[0].name))
              dispatch(addClubRoute(result.data[0].route))
              dispatch(addDaoAddress(result.data[0].daoAddress))
              dispatch(addTokenAddress(result.data[0].tokenAddress))
              dispatch(addClubImageUrl(result.data[0].imageUrl))
              dispatch(addSafeAddress(result.data[0].gnosisAddress))
            }
          })
        }
      }, [clubId])

    return <Component />
    }
    return RetrieveDataComponent;
  }

export default ClubFetch
