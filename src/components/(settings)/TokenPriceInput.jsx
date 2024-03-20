import React from "react";
import UpdateAmountTextfield from "./UpdateAmountTextfield";
import { Typography } from "@mui/material";
import classes from "@components/(settings)/Settings.module.scss";

const TokenPriceInput = () => {
  return (
    <div className={classes.tokenPriceContainer}>
      <div className={classes.tokenPrice}>
        <Typography variant="inherit" fontSize={14}>
          1 $bECLIPSE =
        </Typography>
      </div>
      <UpdateAmountTextfield className={classes.tokenPriceInput} />
    </div>
  );
};

export default TokenPriceInput;
