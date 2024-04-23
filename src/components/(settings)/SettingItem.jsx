import React from "react";
import classes from "@components/(settings)/Settings.module.scss";
import { Typography } from "@mui/material";

const SettingItem = ({
  heading,
  description,
  children,
  isHidden = false,
  isDisabled = false,
  showStatusTag,
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

              {showStatusTag && isDisabled ? (
                <div className={classes.disabled}>Disabled</div>
              ) : (
                showStatusTag &&
                !isDisabled && <div className={classes.enabled}>Enabled</div>
              )}
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
