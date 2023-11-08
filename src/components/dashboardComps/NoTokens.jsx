import { Typography } from "@mui/material";
import React from "react";
import classes from "./Dashboard.module.scss";

const NoTokens = ({ title, subtext }) => {
  return (
    <div className={classes.noTokensContainer}>
      <Typography className={classes.title} variant="inherit">
        {title}
      </Typography>
      <Typography className={classes.subtext} variant="inherit">
        {subtext}
      </Typography>
    </div>
  );
};

export default NoTokens;
