import { Typography } from "@mui/material";
import React, { useState } from "react";
import WalletItem from "./WalletItem";
import { FaCirclePlus } from "react-icons/fa6";
import classes from "./WalletTracker.module.scss";
import WalletTrackerModal from "./WalletTrackerModal";

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
  const [showModal, setShowModal] = useState(false);

  const showModalHandler = () => {
    setShowModal(true);
  };

  return (
    <>
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
        <button onClick={showModalHandler} className={classes.addButton}>
          <FaCirclePlus />
          <Typography>Add</Typography>
        </button>
      </div>

      {showModal ? (
        <WalletTrackerModal
          onClose={() => {
            setShowModal(false);
          }}
        />
      ) : null}
    </>
  );
};

export default WalletTracker;
