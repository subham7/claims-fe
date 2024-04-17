import React from "react";
import { Typography } from "@mui/material";
import { IoMdClose } from "react-icons/io";
import classes from "./DepositCardModal.module.scss";

const ModalTitle = ({ title, onClose }) => {
  return (
    <div className={classes.heading}>
      <Typography variant="inherit" fontSize={22} fontWeight={700}>
        {title}
      </Typography>
      <IoMdClose
        onClick={onClose}
        color="#707070"
        style={{ cursor: "pointer", fontSize: "20px" }}
      />
    </div>
  );
};

export default ModalTitle;
