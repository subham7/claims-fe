import { Button, Skeleton, Typography } from "@mui/material";
import React from "react";
import classes from "../claims/Claim.module.scss";
import { formatEpochTime } from "utils/helper";
import { AiFillInfoCircle } from "react-icons/ai";
import Image from "next/image";

const HeaderShimmer = () => {
  return (
    <>
      <Skeleton width={100} height={30} />
      <Skeleton width={150} height={50} />
      <Skeleton variant="text" width={450} />
    </>
  );
};

const Header = ({
  contractData,
  isActive,
  hasStarted = false,
  tokenDetails,
  isDeposit = false,
  deadline,
  networkId,
  logoUrl,
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

  if (!tokenDetails?.tokenSymbol || !contractData) {
    return <HeaderShimmer />;
  }

  return (
    <>
      <div className={classes.infoContainer}>
        GM Astronaut! StationX is currently undergoing maintenance.
        <br />
        {`We'll be back shortly!`}
      </div>
      {logoUrl ? (
        <Image
          className={classes.logoImg}
          src={logoUrl}
          height={80}
          width={80}
          alt="Logo Image"
        />
      ) : null}
      <h1>
        {isDeposit ? contractData?.name : `$${tokenDetails?.tokenSymbol}`}
      </h1>
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: "10px",
        }}>
        <Typography variant="inherit" className={getStatusClassName()}>
          {getStatusText()}
        </Typography>

        {isActive ? (
          <Typography variant="inherit" className={classes.endTime}>
            | Closes in {formatEpochTime(deadline)}
          </Typography>
        ) : null}
      </div>
      {networkId === "0x89" && !tokenDetails?.isNativeToken && (
        <div className={classes.infoContainer}>
          <AiFillInfoCircle size={20} />
          This club accepts USDC.e as deposits
          <br />
          <Button
            style={{
              backgroundColor: "white",
              color: "black",
              textTransform: "none",
            }}
            variant="contained"
            onClick={() =>
              window.open(
                "https://quickswap.exchange/#/swap?swapIndex=0&currency0=0x3c499c542cEF5E3811e1192ce70d8cC03d5c3359&currency1=0x2791Bca1f2de4661ED88A30C99A7a9449Aa84174",
                "_blank",
              )
            }>
            Get USDC.e
          </Button>
        </div>
      )}
    </>
  );
};

export default Header;
