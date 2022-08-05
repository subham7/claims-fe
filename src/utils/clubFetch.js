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
  addTresuryAddress,
  addTokenAddress,
addClubImageUrl
} from '../redux/reducers/create'
import { checkNetwork } from "./wallet"
import {loginToken} from "../api/auth";
import {setJwtToken, setRefreshToken} from "./auth";


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
                  setJwtToken(response.data.tokens.access.token)
                  setRefreshToken(response.data.tokens.refresh.token)
                }
              })
              dispatch(addWallet(checkedwallet))
              dispatch(addClubID(result.data[0].clubId))
              dispatch(addClubName(result.data[0].name))
              dispatch(addClubRoute(result.data[0].route))
              dispatch(addDaoAddress(result.data[0].daoAddress))
              dispatch(addTresuryAddress(result.data[0].treasuryAddress))
              dispatch(addTokenAddress(result.data[0].tokenAddress))
              dispatch(addClubImageUrl(result.data[0].imageUrl))
            }
          })
        }
      }, [clubId])

    return <Component />
    }
    return RetrieveDataComponent;
  }

export default ClubFetch