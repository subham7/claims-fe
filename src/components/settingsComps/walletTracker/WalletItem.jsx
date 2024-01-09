import { Typography } from "@mui/material";
import Image from "next/image";
import React, { useState } from "react";
import { FaCopy } from "react-icons/fa";
import classes from "./WalletTracker.module.scss";
import { AiFillMinusCircle } from "react-icons/ai";
import { handleSignMessage } from "utils/helper";
import { removeWalletAddressToTrack } from "api/club";
import BackdropLoader from "@components/common/BackdropLoader";
import { useAccount } from "wagmi";
import { setAlertData } from "redux/reducers/alert";
import { useDispatch } from "react-redux";

const WalletItem = ({
  networkId,
  walletName,
  walletAddress,
  isRemovable = false,
  daoAddress,
  onRemoveSuccess,
}) => {
  const { address } = useAccount();
  const [loading, setLoading] = useState(false);
  const dispatch = useDispatch();

  const removeWalletHandler = async () => {
    try {
      setLoading(true);

      const data = {
        walletName,
        walletAddress,
        networkId,
      };

      const { signature } = await handleSignMessage(
        address,
        JSON.stringify(data),
      );

      await removeWalletAddressToTrack(
        {
          ...data,
          signature,
        },
        daoAddress,
      );
      onRemoveSuccess();
      setLoading(false);
      dispatch(
        setAlertData({
          open: true,
          message: "Wallet removed successfully!",
          severity: "success",
        }),
      );
    } catch (error) {
      setLoading(false);
      console.log(error);
      dispatch(
        setAlertData({
          open: true,
          message: "Wallet removal failed!",
          severity: "error",
        }),
      );
    }
  };

  return (
    <div className={classes.walletItem}>
      <div className={classes.flexContainer}>
        <div className={classes.imageContainer}>
          <Image
            src={`/assets/networks/${networkId}.png`}
            height={25}
            width={25}
            alt={networkId}
          />
        </div>
        <Typography
          className={classes.walletAddress}
          variant="inherit"
          fontSize={14}>
          {walletName ? walletName : ""} {walletName.length ? "/" : null}
          <span>{walletAddress}</span>
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
        {isRemovable && (
          <AiFillMinusCircle
            className={classes.remove}
            onClick={removeWalletHandler}
          />
        )}
      </div>

      <BackdropLoader isOpen={loading} />
    </div>
  );
};

export default WalletItem;
