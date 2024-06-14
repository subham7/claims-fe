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
      <Typography className={classes.heading} variant="inherit">
        {heading}
      </Typography>
      <Typography className={classes.subheading} variant="inherit">
        {subheading}
      </Typography>
    </Modal>
  );
};

export default TransactionLoadingModal;
