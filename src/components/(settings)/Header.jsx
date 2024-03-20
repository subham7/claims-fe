import React from "react";
import { Typography } from "@mui/material";
import classes from "@components/(settings)/Settings.module.scss";

const Header = ({ clubName, clubSymbol }) => {
  return (
    <div className={classes.header}>
      <Typography variant="inherit" fontSize={24} fontWeight={700}>
        {clubName}
      </Typography>
      <Typography
        className={classes.subHeading}
        variant="inherit"
        fontSize={16}
        mt={0.5}>
        ${clubSymbol}
      </Typography>
    </div>
  );
};

export default Header;
