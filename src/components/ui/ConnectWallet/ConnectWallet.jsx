import React from "react";
import classes from "./ConnectWallet.module.scss";
import { Typography } from "@mui/material";

const ConnectWallet = () => {
  return (
    <div className={classes.connectWalletSection}>
      <div>
        <Typography className={classes.heading} variant="inherit">
          The Easiest Way to Manage <br />
          Collective Ownership in Web3
        </Typography>
        <Typography className={classes.subHeading} variant="inherit">
          Onchain capital coordination protocol built for syndicates, venture
          DAOs, asset managers and communities.
        </Typography>

        <button className={classes.connectWalleButton}>Connect wallet</button>
      </div>

      <div>
        <div></div>
        <div></div>
        <div></div>
      </div>

      {/* <Footer/> */}
    </div>
  );
};

export default ConnectWallet;
