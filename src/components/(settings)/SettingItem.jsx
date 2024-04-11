import React from "react";
import classes from "@components/(settings)/Settings.module.scss";
import { Typography } from "@mui/material";

const SettingItem = ({
  heading,
  description,
  children,
  isHidden = false,
  isDisabled = false,
}) => {
  return (
    <>
      {!isHidden ? (
        <div className={classes.settingItem}>
          <div className={classes.info}>
            <div>
              <Typography className={classes.infoHeading} variant="inherit">
                {heading}
              </Typography>

              {isDisabled ? (
                <div className={classes.disabled}>Disabled</div>
              ) : null}
            </div>
            <Typography className={classes.infoSubHeading} variant="inherit">
              {description}
            </Typography>
          </div>
          <div>{children}</div>
        </div>
      ) : null}
    </>
  );
};

export default SettingItem;
