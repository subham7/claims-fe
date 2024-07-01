import { Typography } from "@mui/material";
import React from "react";
import classes from "./Common.module.scss";
import { Button } from "@components/ui";
import CustomSkeleton from "@components/skeleton/CustomSkeleton";
import { Box } from "@mui/material";
const ComponentHeader = ({
  title,
  subtext,
  showButton = false,
  loading,
  buttonText = "",
  onClickHandler = () => {},
}) => {
  return (
    <>
      {loading ? (
        <Box sx={{ width: "200px" }}>
          <CustomSkeleton width={"100%"} height={60} length={1} />
        </Box>
      ) : (
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
      )}
    </>
  );
};

export default ComponentHeader;
