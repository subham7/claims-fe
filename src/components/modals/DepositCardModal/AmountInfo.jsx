import React from "react";
import { Typography } from "@mui/material";
import classes from "./DepositCardModal.module.scss";

const AmountInfo = ({ title, amount, icon }) => {
  return (
    <div className={classes.item}>
      <div style={{ display: "flex", alignItems: "center" }}>
        {icon}
        <Typography variant="inherit" fontSize={16} color={"#797979"}>
          {title}
        </Typography>
      </div>
      <Typography variant="inherit" fontSize={16} fontWeight={700}>
        {amount}
      </Typography>
    </div>
  );
};

export default AmountInfo;
