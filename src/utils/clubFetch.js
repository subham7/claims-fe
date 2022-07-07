import React, { createContext, useState, useContext, useEffect } from 'react'
import Web3 from "web3" 
import Router, { useRouter } from 'next/router'
import { useDispatch, useSelector } from "react-redux"
import { fetchClub } from "../api/index"
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


const ClubFetch = (Component) => {
    const RetrieveDataComponent = () => {
      const router = useRouter()
      const {clubId} = router.query
      const dispatch = useDispatch()
      const [dataFetched, setDataFetched] = useState(false)

      const fetchData = (clubId) => {
        const clubData = fetchClub(clubId)
        clubData.then((result) => {
          if (result.status != 200) {
            setDataFetched(false)
          } else {
            const web3 = new Web3(window.web3)
            const checkedwallet = web3.utils.toChecksumAddress(localStorage.getItem("wallet"))
            dispatch(addWallet(checkedwallet))
            dispatch(addClubID(result.data[0].clubId))
            dispatch(addClubName(result.data[0].name))
            dispatch(addClubRoute(result.data[0].route))
            dispatch(addDaoAddress(result.data[0].daoAddress))
            dispatch(addTresuryAddress(result.data[0].treasuryAddress))
            dispatch(addTokenAddress(result.data[0].tokenAddress))
            dispatch(addClubImageUrl(result.data[0].imageUrl))
            setDataFetched(true)
          }
        })
      }
      useEffect(() => {
        checkNetwork()
        if (!dataFetched && clubId) {
          fetchData(clubId)
        }
      }, [dataFetched, clubId])

    return <Component />
    }
    return RetrieveDataComponent;
  }

export default ClubFetch