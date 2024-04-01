import React from "react";
import classes from "@components/(settings)/Settings.module.scss";
import { Typography } from "@mui/material";

const SettingItem = ({ heading, description, children }) => {
  return (
    <div className={classes.settingItem}>
      <div className={classes.info}>
        <Typography className={classes.infoHeading} variant="inherit">
          {heading}
        </Typography>
        <Typography className={classes.infoSubHeading} variant="inherit">
          {description}
        </Typography>
      </div>
      <div>{children}</div>
    </div>
  );
};

export default SettingItem;
