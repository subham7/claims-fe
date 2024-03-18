import React from "react";
import { Typography } from "@mui/material";
import classes from "@components/(settings)/Settings.module.scss";

const Header = () => {
  return (
    <div className={classes.header}>
      <Typography variant="inherit" fontSize={24} fontWeight={700}>
        Eclipse Deal
      </Typography>
      <Typography
        className={classes.subHeading}
        variant="inherit"
        fontSize={16}
        mt={0.5}>
        $bEcli
      </Typography>
    </div>
  );
};

export default Header;
