import React from "react";
import UpdateAmountTextfield from "./UpdateAmountTextfield";
import { Typography } from "@mui/material";
import classes from "@components/(settings)/Settings.module.scss";

const TokenPriceInput = ({
  symbol,
  routeNetworkId,
  daoAddress,
  prevAmount,
  handleActionComplete,
  setLoading,
}) => {
  return (
    <div className={classes.tokenPriceContainer}>
      <div className={classes.tokenPrice}>
        <Typography variant="inherit" fontSize={14}>
          1 ${symbol} =
        </Typography>
      </div>
      <UpdateAmountTextfield
        routeNetworkId={routeNetworkId}
        daoAddress={daoAddress}
        prevAmount={prevAmount}
        type="updatePricePerToken"
        className={classes.tokenPriceInput}
        setLoading={setLoading}
        handleActionComplete={handleActionComplete}
      />
    </div>
  );
};

export default TokenPriceInput;
