import { Skeleton } from "@mui/material";
import React from "react";
import classes from "./NewClaim.module.scss";

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

  return (
    <>
      <p className={getStatusClassName()}>{getStatusText()}</p>

      {tokenDetails?.tokenSymbol ? (
        <h1>{tokenDetails?.tokenSymbol}</h1>
      ) : (
        <Skeleton height={70} width={100} />
      )}

      {dropsData ? (
        <p className={classes.endTime}>
          Claim this drop by{" "}
          {new Date(+dropsData?.endTime * 1000).toUTCString()}
        </p>
      ) : (
        <Skeleton />
      )}
    </>
  );
};

export default Header;
