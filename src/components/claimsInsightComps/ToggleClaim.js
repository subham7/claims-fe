import { FormControlLabel, Switch } from "@mui/material";
import React from "react";
import { ClaimsInsightStyles } from "./claimsInsightStyles";

const ToggleClaim = () => {
  const classes = ClaimsInsightStyles();
  return (
    <div className={classes.toggleClaimContainer}>
      <p>Turn on/off claims</p>
      <FormControlLabel control={<Switch checked={false} />} />
    </div>
  );
};

export default ToggleClaim;
