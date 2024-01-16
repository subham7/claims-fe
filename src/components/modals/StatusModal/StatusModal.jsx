import Modal from "@components/common/Modal/Modal";
import { Button, Typography } from "@mui/material";
import Image from "next/image";
import { useRouter } from "next/router";
import React from "react";
import classes from "./StatusModal.module.scss";

const StatusModal = ({
  heading,
  subheading,
  isError,
  onClose,
  buttonText,
  onButtonClick,
}) => {
  const router = useRouter();

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
      </div>
      <Typography className={classes.heading} variant="inherit">
        {heading}
      </Typography>
      <Typography className={classes.subheading} variant="inherit">
        {subheading}
      </Typography>

      <Button
        // onClick={() => {
        //   if (isError) {
        //     onClose();
        //   } else router.push(dashboardRoute);
        // }}
        onClick={onButtonClick}
        variant="outlined"
        color={isError ? "error" : "primary"}
        className={classes.button}>
        {buttonText}
      </Button>
    </Modal>
  );
};

export default StatusModal;
