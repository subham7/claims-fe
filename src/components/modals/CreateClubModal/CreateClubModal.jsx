import Modal from "@components/common/Modal/Modal";
import { Button, Typography } from "@mui/material";
import Image from "next/image";
import React from "react";
import classes from "../StatusModal/StatusModal.module.scss";

const CreateClubModal = ({ onClick }) => {
  return (
    <Modal className={classes.statusModal}>
      <div className={classes.image}>
        <Image
          src={"/assets/images/astronaut3.png"}
          height={220}
          width={220}
          alt="Create club"
        />
      </div>
      <Typography className={classes.heading} variant="inherit">
        Sign to get started!
      </Typography>

      <Button
        onClick={onClick}
        variant="outlined"
        color={"primary"}
        className={classes.button}>
        Sign here
      </Button>
    </Modal>
  );
};

export default CreateClubModal;
