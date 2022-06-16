import React, { createContext, useState, useContext, useEffect } from 'react'
import Router, { useRouter } from 'next/router'
import { useDispatch, useSelector } from "react-redux"
import { fetchClub } from "../api/index"
import { addClubID, addClubName, addClubRoute, addDaoAddress, addWallet } from '../redux/reducers/create'

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
            console.log(result.statusText)
            setDataFetched(false)
          } else {
            dispatch(addWallet(localStorage.getItem("wallet")))
            dispatch(addClubID(result.data[0].clubId))
            dispatch(addClubName(result.data[0].name))
            dispatch(addClubRoute(result.data[0].route))
            dispatch(addDaoAddress(result.data[0].daoAddress))
            setDataFetched(true)
          }
        })
      }
      useEffect(() => {
        if (!dataFetched && clubId) {
          fetchData(clubId)
        }
      }, [dataFetched, clubId])

    return <Component />
    }
    return RetrieveDataComponent;
  }

export default ClubFetch