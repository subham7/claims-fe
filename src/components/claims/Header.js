import { Skeleton, Typography } from "@mui/material";
import React from "react";
import classes from "./Claim.module.scss";
import { formatEpochTime } from "utils/helper";

const Header = ({
  contractData,
  isActive,
  hasStarted = false,
  tokenDetails,
  isDeposit = false,
  daoAddress = "",
  deadline,
}) => {
  const getStatusText = () => {
    if (isDeposit) {
      return isActive ? "Active" : "Finished";
    } else if (isActive && hasStarted && contractData?.isEnabled) {
      return "Active";
    } else if (!contractData?.isEnabled || (!isActive && hasStarted)) {
      return "Inactive";
    } else if (!isActive && !hasStarted) {
      return "Not started yet";
    }
    return "";
  };

  const getStatusClassName = () => {
    if (isActive && (isDeposit || contractData?.isEnabled)) {
      return classes.active;
    }
    return classes.inactive;
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
      {/* {tokenDetails?.tokenSymbol && contractData ? ( */}
      {contractData ? (
        <>
          <Typography variant="inherit" className={getStatusClassName()}>
            {getStatusText()}
          </Typography>
          <h1>{tokenDetails?.tokenSymbol}</h1>
          <Typography variant="inherit" className={classes.endTime}>
            Closes in {formatEpochTime(deadline)}
          </Typography>
        </>
      ) : (
        <HeaderShimmer />
      )}
    </>
  );
};

export default Header;
