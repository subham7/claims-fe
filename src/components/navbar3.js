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
import { useDispatch } from "react-redux";
import { useRouter } from "next/router";

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
  const [previouslyConnectedWallet, setPreviouslyConnectedWallet] =
    useState(null);
  const [userDetails, setUserDetails] = useState(null);

  useEffect(() => {
    store.subscribe(() => {
      const { create } = store.getState();
      if (create.value) {
        setPreviouslyConnectedWallet(create.value);
      } else {
        setPreviouslyConnectedWallet(null);
      }
    });
    const checkConnection = async () => {
      var web3;
      if (window.ethereum) {
        web3 = new Web3(window.ethereum);
      } else if (window.web3) {
        web3 = new Web3(window.web3.currentProvider);
      }
      try {
        web3.eth.getAccounts().then((async) => {
          setUserDetails(async[0]);
        });
      } catch (err) {
        setUserDetails(null);
      }
    };
    const autoSelectWallet = async () => {
      if (previouslyConnectedWallet) {
        await onboard.connectWallet({
          autoSelect: previouslyConnectedWallet[0],
          disableModals: true,
        });
      }
    };

    autoSelectWallet();
    checkConnection();
  }, [previouslyConnectedWallet]);

  const handleConnection = (event) => {
    const wallet = connectWallet(dispatch);
    wallet.then((response) => {
      if (!response) {
        console.log("Error connecting wallet");
      }
    });
  };

  const handleFaucetRedirect = () => {
    window.open("/faucet", "_ blank");
  };

  return (
    <Box sx={{ flexGrow: 1 }}>
      <AppBar
        className={classes.root}
        position="fixed"
        sx={{
          width: "100%",
          zIndex: (theme) => theme.zIndex.drawer + 1,
          paddingBottom: "15px",
        }}
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
          <NetworkSwitcher />
          {previouslyConnectedWallet !== null ? (
            <AccountButton accountDetail={userDetails} />
          ) : (
            <Button
              variant="navBar"
              sx={{ mr: 2, mt: 2 }}
              className={classes.navButton}
            >
              No wallet connected
            </Button>
          )}
        </Toolbar>
      </AppBar>
    </Box>
  );
}
