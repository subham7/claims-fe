import { Skeleton, Typography } from "@mui/material";
import React, { useState } from "react";
import classes from "../claims/Claim.module.scss";
import { formatEpochTime } from "utils/helper";
import Image from "next/image";
import SwapInfo from "./SwapInfo";
// import ZkMe from "@components/zkMe/zkMe";
// import { verifyWithZkMeServices } from "@zkmelabs/widget";
import { useAccount } from "wagmi";
import { IoIosArrowRoundForward } from "react-icons/io";
import { IoCheckmark } from "react-icons/io5";
import { useSelector } from "react-redux";
import { CHAIN_CONFIG } from "utils/constants";

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
  daoAddress,
}) => {
  const [zkMeAppId, setZkMeAppId] = useState("");
  const [open, setOpen] = useState(false);
  const [isVerified, setIsVerified] = useState(false);
  const [loading, setLoading] = useState(true);
  const [kycEnabled, setKycEnabled] = useState(false);
  const { address } = useAccount();

  const clubData = useSelector((state) => {
    return state.club.clubData;
  });

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

  // const getKycSetting = async () => {
  //   try {
  //     const response = await getClubData(daoAddress);
  //     if (response) {
  //       setKycEnabled(response.kyc.isKycEnabled);
  //       if (response.kyc.isKycEnabled) {
  //         setZkMeAppId(response.kyc.zkmeAppId);
  //         const results = await verifyWithZkMeServices(
  //           response.kyc.zkmeAppId,
  //           address,
  //         );
  //         setIsVerified(results);
  //       }
  //       setLoading(false);
  //     }
  //   } catch (e) {
  //     console.error(e);
  //     setLoading(false);
  //   }
  // };

  // useEffect(() => {
  //   getKycSetting();
  // }, [address, daoAddress]);

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
        clubData?.depositTokenAddress ===
          CHAIN_CONFIG[networkId].usdcAddress && (
          <SwapInfo networkId={networkId} />
        )}

      {/* {open ? (
        <ZkMe
          daoAddress={daoAddress}
          zkMeAppId={zkMeAppId}
          routeNetworkId={routeNetworkId}
        />
      ) : null} */}
      {/* {loading || isVerified ? null : (
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
      )} */}

      {kycEnabled && !loading ? (
        <div className={classes.kycContainer}>
          <div>
            <Typography variant="inherit" fontWeight={600}>
              KYC Verification
            </Typography>

            {isVerified ? (
              <Typography className={classes.completed} variant="inherit">
                Completed
              </Typography>
            ) : (
              <Typography className={classes.action} variant="inherit">
                {address ? "Action Required" : "Connect Wallet"}
              </Typography>
            )}
          </div>

          {isVerified ? (
            <IoCheckmark />
          ) : (
            <div
              onClick={() => {
                if (address) {
                  setOpen(!open);
                }
              }}
              className={classes.kycButton}>
              <Typography variant="inherit">Complete KYC</Typography>
              <IoIosArrowRoundForward />
            </div>
          )}
        </div>
      ) : null}
    </>
  );
};

export default Header;
