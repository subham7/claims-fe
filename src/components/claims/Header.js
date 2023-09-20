import { Skeleton } from "@mui/material";
import React from "react";
import classes from "./NewClaim.module.scss";

const Header = ({ dropsData, isClaimActive, hasDropStarted, tokenDetails }) => {
  return (
    <>
      <p
        className={`${
          isClaimActive && dropsData?.isEnabled
            ? classes.active
            : classes.inactive
        }`}>
        {isClaimActive && hasDropStarted && dropsData?.isEnabled
          ? "Active"
          : (!isClaimActive && hasDropStarted) || !dropsData?.isEnabled
          ? "Inactive"
          : !isClaimActive && !hasDropStarted && "Not started yet"}
      </p>

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
