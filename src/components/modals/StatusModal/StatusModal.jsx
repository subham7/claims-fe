import Modal from "@components/common/Modal/Modal";
import { Button, Typography } from "@mui/material";
import Image from "next/image";
import { useRouter } from "next/router";
import React from "react";
import classes from "./StatusModal.module.scss";
import { addTokenToWallet } from "utils/walletHelper";
import { useSelector } from "react-redux";
import { IoMdClose } from "react-icons/io";

const StatusModal = ({
  heading,
  subheading,
  isError,
  onClose,
  buttonText,
  onButtonClick,
  isErc20,
}) => {
  const router = useRouter();
  const params = router.asPath.split("/");

  const clubData = useSelector((state) => {
    return state.club.clubData;
  });

  return (
    <Modal onClose={onClose} className={classes.statusModal}>
      <div className={classes.image}>
        <Image
          src={
            isError
              ? "/assets/images/astronaut2.png"
              : "/assets/images/astronaut_hurray.png"
          }
          height={220}
          width={isError ? 160 : 220}
          alt="Success"
        />

        <IoMdClose
          onClick={onClose}
          color="#fff"
          style={{
            cursor: "pointer",
            fontSize: "20px",
            position: "absolute",
            top: "20px",
            right: "20px",
          }}
        />
      </div>
      <Typography className={classes.heading} variant="inherit">
        {heading}
      </Typography>
      <Typography className={classes.subheading} variant="inherit">
        {subheading}
      </Typography>

      <Button
        onClick={onButtonClick}
        variant="outlined"
        color={isError ? "error" : "primary"}
        className={classes.button}>
        {buttonText}
      </Button>
      {isErc20 ? (
        <Button
          onClick={() =>
            addTokenToWallet(params[2], clubData?.symbol, clubData?.imgUrl)
          }
          variant="contained"
          sx={{
            width: "100%",
            padding: "12px 0",
            margin: "12px 0",
            fontFamily: "inherit",
            fontSize: "12px",
          }}>
          Add ${clubData?.symbol} Your Wallet
        </Button>
      ) : null}
    </Modal>
  );
};

export default StatusModal;
