"use client";

import React from "react";
import classes from "./ConnectWallet.module.scss";
import { Typography } from "@mui/material";
import Footer from "../Footer/Footer";
import { useWeb3Modal } from "@web3modal/wagmi/react";

const ConnectWallet = () => {
  const { open } = useWeb3Modal();

  const connectWalletHandler = async () => {
    await open();
  };

  return (
    <div className={classes.section}>
      <div className={classes.connectWalletSection}>
        <div className={classes.firstDiv}>
          <Typography className={classes.heading} variant="inherit">
            The Easiest Way to Manage <br />
            Collective Ownership in Web3
          </Typography>
          <Typography className={classes.subHeading} variant="inherit">
            Onchain capital coordination protocol built for syndicates, venture
            DAOs, asset managers and communities.
          </Typography>

          <button
            onClick={connectWalletHandler}
            className={classes.connectWalletButton}>
            Connect wallet
          </button>
        </div>

        <div className={classes.stationsInfo}>
          <div className={classes.info}>
            <Typography className={classes.value}>31,291</Typography>
            <Typography className={classes.title}>
              Total stations deployed
            </Typography>
          </div>
          <div className={classes.info}>
            <Typography className={classes.value}>$4,025,857.23</Typography>
            <Typography className={classes.title}>
              Total volume of capital raised via stations
            </Typography>
          </div>
          <div className={classes.info}>
            <Typography className={classes.value}>10,203</Typography>
            <Typography className={classes.title}>
              Total unique members
            </Typography>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default ConnectWallet;
