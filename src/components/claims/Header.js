import { Skeleton, Typography } from "@mui/material";
import React from "react";
import classes from "./Claim.module.scss";

const Header = ({ dropsData, isClaimActive, hasDropStarted, tokenDetails }) => {
  const getStatusText = () => {
    if (isClaimActive && hasDropStarted && dropsData?.isEnabled) {
      return "Active";
    } else if ((!isClaimActive && hasDropStarted) || !dropsData?.isEnabled) {
      return "Inactive";
    } else if (!isClaimActive && !hasDropStarted) {
      return "Not started yet";
    }
    return "";
  };

  const getStatusClassName = () => {
    return isClaimActive && dropsData?.isEnabled
      ? classes.active
      : classes.inactive;
  };

  const HeaderShimmer = () => {
    return (
      <>
        <Skeleton width={100} height={30} />
        <Skeleton width={150} height={50} />
        <Skeleton variant="text" width={450} />
      </>
    );
  };

  return (
    <>
      {tokenDetails?.tokenSymbol && dropsData ? (
        <>
          <Typography variant="inherit" className={getStatusClassName()}>
            {getStatusText()}
          </Typography>
          <h1>{tokenDetails?.tokenSymbol}</h1>
          <Typography variant="inherit" className={classes.endTime}>
            Claim this drop by{" "}
            {new Date(+dropsData?.endTime * 1000).toUTCString()}
          </Typography>
        </>
      ) : (
        <HeaderShimmer />
      )}
    </>
  );
};

export default Header;
