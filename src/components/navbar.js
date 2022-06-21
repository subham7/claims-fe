import { React, useEffect, useState } from "react"
import { AppBar, Box, Toolbar, IconButton, Button } from "@mui/material"
import MenuIcon from "@mui/icons-material/Menu"
import Image from "next/image"
import { makeStyles } from "@mui/styles"
import { connectWallet, setUserChain, onboard } from "../utils/wallet"
import Web3 from "web3"
import AccountButton from "./accountbutton"
import store from "../redux/store"
import { useDispatch, useSelector } from "react-redux"
import { addWallet } from "../redux/reducers/create"

const useStyles = makeStyles({
  image: {
    height: "30px",
    width: "auto !important",
  },
})

export default function Navbar(props) {
  const dispatch = useDispatch()
  const classes = useStyles()
  const [previouslyConnectedWallet, setPreviouslyConnectedWallet] = useState(null)
  const [userDetails, setUserDetails] = useState(null)
  const wallet = useSelector(state => { return state.create.value })

  useEffect(() => {
    if (wallet !== null) {
      console.log(wallet[0][0].address)
      setPreviouslyConnectedWallet(wallet[0][0].address)
      setUserDetails(wallet[0][0].address)
    }

  }, [previouslyConnectedWallet])

  const handleConnection = async (event) => {
    const wallet = connectWallet(dispatch)
    wallet.then((response) => {
      if (!response) {
        console.log("Error connecting wallet")
      }
    })
  };

  //setUserChain()

  return (
    <Box sx={{ flexGrow: 1 }}>
      <AppBar
        className={classes.root}
        position="fixed"
        sx={{ width: "100%", zIndex: (theme) => theme.zIndex.drawer + 1, fontFamily: "Whyte",  borderBottom: "1px solid #C1D3FF",  paddingBottom: "15px"  }}
      >
        <Toolbar>
          <IconButton
            color="inherit"
            aria-label="open drawer"
            edge="start"
            onClick={props.handleDrawerToggle}
            sx={{ mr: 2, display: { sm: "none" } }}
          >
            <MenuIcon />
          </IconButton>
          <Box sx={{ flexGrow: 1 }}>
            <Image
              src="/assets/images/monogram.png"
              height="40"
              width="40"
              className={classes.image}
              alt="monogram"
            />
          </Box>
          {previouslyConnectedWallet !== null ? (
            <AccountButton accountDetail={userDetails} />
          ) : (
            <Button
              variant="contained"
              color="primary"
              sx={{ mr: 2, fontFamily: "Whyte" }}
              onClick={() => handleConnection()}
            >
              Connect Wallet
            </Button>
          )}

        </Toolbar>
      </AppBar>
    </Box>
  )
}
