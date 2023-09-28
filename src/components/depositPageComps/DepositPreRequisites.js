import React from "react";
import classes from "./DepositPreRequisites.module.scss";
import OpenInNewIcon from "@mui/icons-material/OpenInNew";
import RadioButtonUncheckedIcon from "@mui/icons-material/RadioButtonUnchecked";
import { Typography } from "@mui/material";

const DepositPreRequisites = () => {
  return (
    <div>
      <Typography>Complete these steps</Typography>
      <div className={classes.stepContainer}>
        <RadioButtonUncheckedIcon className={classes.icons} />
        <div style={{ marginRight: "0.5rem" }}>Sign subscription agreement</div>
        <OpenInNewIcon className={classes.icons} />
      </div>
      <div className={classes.stepContainer}>
        <RadioButtonUncheckedIcon className={classes.icons} />
        <div style={{ marginRight: "0.5rem" }}>Complete KYC</div>
        <OpenInNewIcon className={classes.icons} />
      </div>
      <div className={classes.stepContainer}>
        <RadioButtonUncheckedIcon className={classes.icons} />
        <div style={{ marginRight: "0.5rem" }}>Upload w8ben</div>
        <OpenInNewIcon className={classes.icons} />
      </div>
    </div>
  );
};

export default DepositPreRequisites;
