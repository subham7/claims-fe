import { Button, Skeleton, Typography } from "@mui/material";
import React, { useEffect, useState } from "react";
import classes from "../claims/Claim.module.scss";
import { formatEpochTime } from "utils/helper";
import Image from "next/image";
import SwapInfo from "./SwapInfo";
import ZkMe from "@components/zkMe/zkMe";
import { verifyWithZkMeServices } from "@zkmelabs/widget";
import { useAccount } from "wagmi";

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
  routeNetworkId = "0x89",
}) => {
  const [open, setOpen] = useState(false);
  const [isVerified, setIsVerified] = useState(false);
  const [loading, setLoading] = useState(true);
  const { address } = useAccount();

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

  const checkIfUserHasVerified = async () => {
    const results = await verifyWithZkMeServices(
      "M2024031204490984947737391718575",
      address,
    );

    setIsVerified(results);
    setLoading(false);
  };

  useEffect(() => {
    checkIfUserHasVerified();
  }, []);

  if (!tokenDetails?.tokenSymbol || !contractData) {
    return <HeaderShimmer />;
  }

  return (
    <>
      {/* {routeNetworkId === "0x1" && (
        <div className={classes.infoContainer}>
          GM Astronaut! StationX is currently undergoing maintenance.
          <br />
          {`We'll be back shortly!`}
        </div>
      )} */}
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

      {(networkId === "0x89" || networkId === "0xa4b1") &&
        !tokenDetails?.isNativeToken && <SwapInfo networkId={networkId} />}

      {open ? <ZkMe /> : null}
      {loading || isVerified ? null : (
        <Button
          onClick={() => setOpen(!open)}
          variant="contained"
          sx={{
            width: "100%",
            padding: "10px 0",
            margin: "10px 0",
            fontFamily: "inherit",
          }}>
          Perform KYC
        </Button>
      )}
    </>
  );
};

export default Header;
