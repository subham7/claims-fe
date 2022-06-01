import { React, useEffect, useState } from "react"
import { AppBar, Box, Toolbar, IconButton, Button, Typography } from "@mui/material"
import MenuIcon from "@mui/icons-material/Menu"
import Image from "next/image"
import { makeStyles } from "@mui/styles"
import { connectWallet, setUserChain, onboard } from "../utils/wallet"
import Web3 from "web3"
import AccountButton from "./accountbutton"
import store from "../redux/store"
import { useDispatch } from "react-redux"

const useStyles = makeStyles({
  image: {
    height: "30px",
    width: "auto !important",
  },
  navbarText: {
    flexGrow: 1,
    fontSize: "18px",
    color: "#C1D3FF",
  },
  navButton: {
    borderRadius: "10px",
    width: "327px",
    height: "auto",
    background: "#111D38 0% 0% no-repeat padding-box",
    border: "1px solid #C1D3FF40",
    opacity: "1",
    fontSize: "18px",
  }
})

export default function Navbar2(props) {
  const dispatch = useDispatch()
  const classes = useStyles()
  const [previouslyConnectedWallet, setPreviouslyConnectedWallet] = useState(null)
  const [userDetails, setUserDetails] = useState(null)

  useEffect(() => {
    store.subscribe(() => {
      const { create } = store.getState()
      if (create.value) {
        setPreviouslyConnectedWallet(create.value)
      }
      else{
        setPreviouslyConnectedWallet(null)
      }
    })
    const checkConnection = async () => {

      var web3
      if (window.ethereum) {
        web3 = new Web3(window.ethereum)
      }
      else if (window.web3) {
        web3 = new Web3(window.web3.currentProvider)
      }
      try{
        web3.eth.getAccounts()
        .then((async) => {
          setUserDetails(async[0])
        }
      );
    }
    catch(err){
      setUserDetails(null)
    }
  };

  if (previouslyConnectedWallet) {
    onboard.connectWallet({ autoSelect: previouslyConnectedWallet[0] })
  }
      
    checkConnection()
  }, [previouslyConnectedWallet])
  
  const handleConnection = (event) => {
    try{
      const wallet = connectWallet(dispatch)
    }
    catch(err){
      console.log(err)
    }
  };


  return (
    <Box sx={{ flexGrow: 1 }}>
      <AppBar
        className={classes.root}
        position="fixed"
        sx={{ width: "100%", zIndex: (theme) => theme.zIndex.drawer + 1 }}
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
          <Image
            src="/assets/images/monogram.png"
            height="40"
            width="40"
            className={classes.image}
            alt="monogram"
          />
          <Typography  variant="h6" component="div" ml={20} className={classes.navbarText}> 
            No wallet connected
          </Typography>
          {previouslyConnectedWallet !== null ? (
            <AccountButton accountDetail={userDetails} />
          ) : (
            <Button
              sx={{ mr: 2, mt: 2 }}
              className={classes.navButton}
            >
              No wallet connected
            </Button>
          )}       
              
        </Toolbar>
      </AppBar>
    </Box>
  )
}
