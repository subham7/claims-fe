import { Typography } from "@mui/material";
import Image from "next/image";
import React from "react";
import { FaCopy } from "react-icons/fa";
import classes from "./WalletTracker.module.scss";

const WalletItem = ({ chainName, walletName, walletAddress }) => {
  return (
    <div className={classes.walletItem}>
      <div className={classes.flexContainer}>
        <div className={classes.imageContainer}>
          <Image
            src={`/assets/networks/${chainName}.jpeg`}
            height={25}
            width={25}
            alt={chainName}
          />
        </div>
        <Typography
          className={classes.walletAddress}
          variant="inherit"
          fontSize={14}>
          {walletName} / <span>{walletAddress}</span>
        </Typography>
      </div>

      <div className={classes.icons}>
        <FaCopy />
        <Image
          src={"/assets/icons/etherscan.png"}
          height={18}
          width={18}
          alt="Etherscan link"
        />
      </div>
    </div>
  );
};

export default WalletItem;
