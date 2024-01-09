import { Typography } from "@mui/material";
import React, { useEffect, useState } from "react";
import WalletItem from "./WalletItem";
import { FaCirclePlus } from "react-icons/fa6";
import classes from "./WalletTracker.module.scss";
import WalletTrackerModal from "./WalletTrackerModal";
import { fetchClubByDaoAddress } from "api/club";
import { useSelector } from "react-redux";

const WalletTracker = ({ daoAddress }) => {
  const [showModal, setShowModal] = useState(false);
  const [allWallets, setAllWallets] = useState([]);

  const gnosisAddress = useSelector((state) => {
    return state.club.clubData.gnosisAddress;
  });

  const showModalHandler = () => {
    setShowModal(true);
  };

  const fetchAllWalletsHandler = async () => {
    try {
      const data = await fetchClubByDaoAddress(daoAddress);
      setAllWallets(data.data?.hotWallets);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    if (daoAddress) fetchAllWalletsHandler();
  }, [daoAddress]);

  return (
    <>
      <div className={classes.container}>
        <Typography fontSize={24} fontWeight={500} mb={5} variant="inherit">
          Track wallets
        </Typography>
        <div>
          <WalletItem
            walletAddress={gnosisAddress}
            walletName={"Treasury"}
            networkId={"0x89"}
          />
          {allWallets.map((wallet) => (
            <WalletItem
              key={`${wallet.walletAddress}${wallet.networkId}`}
              walletAddress={wallet.walletAddress}
              walletName={wallet.walletName}
              networkId={wallet.networkId}
              isRemovable={true}
              daoAddress={daoAddress}
              onRemoveSuccess={fetchAllWalletsHandler}
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
          onAddSuccess={fetchAllWalletsHandler}
          daoAddress={daoAddress}
          onClose={() => {
            setShowModal(false);
          }}
        />
      ) : null}
    </>
  );
};

export default WalletTracker;
