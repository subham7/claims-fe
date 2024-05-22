import { Typography } from "@mui/material";
import React from "react";
import classes from "./Common.module.scss";
import { Button } from "@components/ui";

const ComponentHeader = ({
  title,
  subtext,
  showButton = false,
  buttonText = "",
  onClickHandler = () => {},
}) => {
  return (
    <div className={classes.headerContainer}>
      <div>
        <Typography className={classes.stationName} variant="inherit">
          {title}
        </Typography>
        <Typography className={classes.subText} variant="inherit">
          {subtext}
        </Typography>
      </div>
      {showButton && (
        <Button
          onClick={onClickHandler}
          className={classes.button}
          variant="contained">
          {buttonText}
        </Button>
      )}
    </div>
  );
};

export default ComponentHeader;
