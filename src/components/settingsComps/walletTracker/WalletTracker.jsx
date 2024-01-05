import { Typography } from "@mui/material";
import React from "react";
import WalletItem from "./WalletItem";
import { FaCirclePlus } from "react-icons/fa6";
import classes from "./WalletTracker.module.scss";

const DUMMY_DATA = [
  {
    walletName: "Treasury",
    walletAddress: "0xD9A5A56eE4eCAD795B274015e3c90884402b2138",
    chainName: "polygon",
  },
  {
    walletName: "Wallet 1",
    walletAddress: "0xD9A5A56eE4eCAD795B274015e3c90884402b2138",
    chainName: "bnb",
  },
];

const WalletTracker = () => {
  return (
    <div className={classes.container}>
      <Typography fontSize={24} fontWeight={500} mb={5} variant="inherit">
        Track wallets
      </Typography>
      <div>
        {DUMMY_DATA.map((wallet) => (
          <WalletItem
            key={wallet.walletAddress}
            walletAddress={wallet.walletAddress}
            walletName={wallet.walletName}
            chainName={wallet.chainName}
          />
        ))}
      </div>
      <button className={classes.addButton}>
        <FaCirclePlus />
        <Typography>Add</Typography>
      </button>
    </div>
  );
};

export default WalletTracker;
