import Modal from "@components/common/Modal/Modal";
import { Typography } from "@mui/material";
import Image from "next/image";
import React from "react";
import classes from "./StatusModal.module.scss";
import useLockBodyScroll from "hooks/useLockBodyScroll";

const TransactionLoadingModal = ({ heading, subheading, onClose }) => {
  useLockBodyScroll(true);
  return (
    <Modal onClose={onClose} className={classes.statusModal}>
      <div className={classes.image}>
        <Image
          src={"/assets/images/astronaut1.png"}
          height={200}
          width={240}
          alt="Success"
        />
      </div>

      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: "4px",
          justifyContent: "center",
        }}>
        <Typography className={classes.heading} variant="inherit">
          {heading}
        </Typography>
        <Image
          src={"/assets/icons/gifs/hourglass.gif"}
          height={30}
          width={30}
          alt="time"
        />
      </div>
      <Typography className={classes.subheading} variant="inherit">
        {subheading}
      </Typography>
    </Modal>
  );
};

export default TransactionLoadingModal;
