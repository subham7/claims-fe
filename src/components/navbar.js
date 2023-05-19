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

import store from "../redux/store";
import { useDispatch, useSelector } from "react-redux";
import Router from "next/router";
import { useAccountCenter, useConnectWallet } from "@web3-onboard/react";
import { addWalletAddress } from "../redux/reducers/user";
// import "../../styles/globals.css";

const useStyles = makeStyles({
  image: {
    height: "30px",
    width: "auto !important",
    zIndex: "99999 !important",
    position: "absolute",
  },
});

export default function Navbar3(props) {
  const dispatch = useDispatch();
  const classes = useStyles();
  const [{ wallet, connecting }, connect, disconnect] = useConnectWallet();

  let walletAddress;

  if (typeof window !== "undefined") {
    const web3 = new Web3(window.web3);
    walletAddress = web3.utils.toChecksumAddress(wallet?.accounts[0].address);
  }

  if (wallet) {
    if (window.ethereum) {
      window.web3 = new Web3(window.ethereum);
    } else if (window.web3) {
      window.web3 = new Web3(window.web3.currentProvider);
    }
  }
  useEffect(() => {
    if (wallet) {
      dispatch(addWalletAddress(wallet ? walletAddress : null));
    }
  }, [dispatch, wallet, walletAddress]);

  const handleFaucetRedirect = () => {
    window.open("/faucet", "_ blank");
  };

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
            {/* <Link href={"/"}> */}
            <Image
              src="/assets/images/monogram.png"
              height="40"
              width="40"
              className={classes.image}
              alt="monogram"
              onClick={() => Router.reload()}
            />
            {/* </Link> */}
          </Box>
          {/* {props.faucet ? (
            <Button
              variant="primary"
              color="primary"
              sx={{ mr: 40, mt: 2 }}
              onClick={handleFaucetRedirect}
            >
              USDC Faucet
            </Button>
          ) : null} */}
          {connecting ? (
            <Button sx={{ mr: 2, mt: 2 }} className={classes.navButton}>
              Connecting
            </Button>
          ) : wallet ? (
            <></>
          ) : (
            <Button
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
