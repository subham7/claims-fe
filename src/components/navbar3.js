import { React, useEffect, useState } from "react";
import {
  AppBar,
  Box,
  Toolbar,
  IconButton,
  Button,
  Typography,
} from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";
import Image from "next/image";
import { makeStyles } from "@mui/styles";
import { connectWallet, setUserChain, onboard } from "../utils/wallet";
import Web3 from "web3";
import AccountButton from "./accountbutton";
import NetworkSwitcher from "./networkSwitcher";
import store from "../redux/store";
import { useDispatch, useSelector } from "react-redux";
import { useRouter } from "next/router";
import { useAccountCenter, useConnectWallet } from "@web3-onboard/react";
// import "../../styles/globals.css";

const useStyles = makeStyles({
  image: {
    height: "30px",
    width: "auto !important",
  },
});

export default function Navbar3(props) {
  const router = useRouter();
  const dispatch = useDispatch();
  const classes = useStyles();
  // const [previouslyConnectedWallet, setPreviouslyConnectedWallet] =
  //   useState(null);
  // const [userDetails, setUserDetails] = useState(null);

  // useEffect(() => {
  //   store.subscribe(() => {
  //     const { create } = store.getState();
  //     if (create.value) {
  //       setPreviouslyConnectedWallet(create.value);
  //     } else {
  //       setPreviouslyConnectedWallet(null);
  //     }
  //   });
  //   const checkConnection = async () => {
  //     var web3;
  //     if (window.ethereum) {
  //       web3 = new Web3(window.ethereum);
  //     } else if (window.web3) {
  //       web3 = new Web3(window.web3.currentProvider);
  //     }
  //     try {
  //       web3.eth.getAccounts().then((async) => {
  //         setUserDetails(async[0]);
  //       });
  //     } catch (err) {
  //       setUserDetails(null);
  //     }
  //   };
  //   const autoSelectWallet = async () => {
  //     if (previouslyConnectedWallet) {
  //       await onboard.connectWallet({
  //         autoSelect: previouslyConnectedWallet[0],
  //         disableModals: true,
  //       });
  //     }
  //   };

  //   autoSelectWallet();
  //   checkConnection();
  // }, [previouslyConnectedWallet]);

  // const handleConnection = (event) => {
  //   const wallet = connectWallet(dispatch);
  //   wallet.then((response) => {
  //     if (!response) {
  //       console.log("Error connecting wallet");
  //     }
  //   });
  // };

  // const handleFaucetRedirect = () => {
  //   window.open("/faucet", "_ blank");
  // };

  const [{ wallet, connecting }, connect, disconnect] = useConnectWallet();
  const updateAccountCenter = useAccountCenter();

  // create an ethers provider
  let ethersProvider;

  if (wallet) {
    // ethersProvider = new ethers.providers.Web3Provider(wallet.provider, 'any')
    if (window.ethereum) {
      console.log("in hereeee");
      window.web3 = new Web3(window.ethereum);
    } else if (window.web3) {
      console.log("in elsee");
      window.web3 = new Web3(window.web3.currentProvider);
    }
  }
  // return (

  // )

  return (
    <Box sx={{ flexGrow: 1 }}>
      <AppBar position="static">
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
          {props.faucet ? (
            <Button
              variant="primary"
              color="primary"
              sx={{ mr: 2, mt: 2 }}
              // startIcon={<LocalFireDepartmentIcon />}
              onClick={handleFaucetRedirect}
            >
              USDC Faucet
            </Button>
          ) : null}
          {connecting ? (
            <Button
              // variant="navBar"
              sx={{ mr: 2, mt: 2 }}
              className={classes.navButton}
            >
              Connecting
            </Button>
          ) : wallet ? (
            <></>
          ) : (
            <Button
              // variant="navBar"
              sx={{ mr: 2, mt: 2 }}
              className={classes.navButton}
              onClick={() => (wallet ? disconnect(wallet) : connect())}
            >
              Connect wallet
            </Button>
          )}
        </Toolbar>
      </AppBar>
    </Box>
  );
}
