import { useRouter } from "next/router";
import React, { useEffect, useState } from "react";
import { AiFillCopy } from "react-icons/ai";
import { BsArrowLeftShort, BsLink45Deg } from "react-icons/bs";
import { AiOutlineEdit } from "react-icons/ai";
import { FiExternalLink } from "react-icons/fi";
import { ClaimsInsightStyles } from "./claimsInsightStyles";
import { useChainId } from "wagmi";
import EditDetails from "@components/settingsComps/modals/EditDetails";
import { useTheme } from "@mui/styles";

const ClaimDescriptionInfo = ({
  description,
  endTime,
  startTime,
  claimAddress,
  isActive,
  claimsNetwork,
}) => {
  const [claimActive, setClaimActive] = useState(false);
  const [isClaimStarted, setIsClaimStarted] = useState(false);
  const [claimEnabled, setClaimEnabled] = useState(false);
  const [open, setOpen] = useState(false);

  const chain = useChainId();
  const networkId = "0x" + chain?.toString(16);

  const handleClose = (event, reason) => {
    if (reason !== "backdropClick" && reason !== "escapeKeyDown") {
      setOpen(false);
    }
  };

  const router = useRouter();
  const theme = useTheme();
  const classes = ClaimsInsightStyles(theme);
  const copyHandler = () => {
    navigator.clipboard.writeText(
      `${window.location.origin}/claims/${networkId}/${claimAddress}`,
    );
  };

  const currentTime = Date.now() / 1000;
  const endingTimeInNum = new Date(+endTime * 1000);

  useEffect(() => {
    if (+startTime > currentTime) {
      setClaimActive(false);
      setIsClaimStarted(false);
    } else if (+endTime < currentTime) {
      setClaimActive(false);
      setIsClaimStarted(true);
    } else {
      setClaimActive(true);
      setIsClaimStarted(true);
    }

    setClaimEnabled(isActive);
  }, [endTime, startTime, currentTime, endingTimeInNum, isActive]);

  return (
    <div className={classes.infoTopContainer}>
      <div className={classes.flexContainer}>
        <div
          style={{
            cursor: "pointer",
          }}
          onClick={() => {
            router.push(`/claims/`);
          }}
          className={classes.gapContainer}>
          <BsArrowLeftShort size={25} />
          <p>Back</p>
        </div>
        <div className={classes.gapContainer}>
          <AiOutlineEdit
            onClick={() => setOpen(true)}
            className={classes.icon}
            size={25}
          />
          <BsLink45Deg
            onClick={() => {
              router.push(`/claim/${claimAddress}/${claimsNetwork}`);
            }}
            className={classes.icon}
            size={25}
          />
          <p
            style={{
              background: claimActive && claimEnabled ? "#0ABB92" : "#F75F71",
              padding: "2px 14px",
              fontSize: "14px",
              borderRadius: "25px",
            }}>
            {claimActive && isClaimStarted && claimEnabled
              ? "Active"
              : (!claimActive && isClaimStarted) || !claimEnabled
              ? "Inactive"
              : !claimActive && !isClaimStarted && "Not started yet"}
          </p>
        </div>
      </div>

      <h2
        style={{
          margin: 0,
          padding: 0,
        }}>
        {description}
      </h2>
      <div className={classes.copyContainer}>
        <p>{claimAddress}</p>
        <div className={classes.gapContainer}>
          <AiFillCopy
            onClick={copyHandler}
            style={{
              background: "#151515",
            }}
            className={classes.icon}
            size={25}
          />
          <FiExternalLink
            onClick={() => {
              window.open(
                `${CHAIN_CONFIG[networkId].blockExplorerUrl}/address/${claimAddress}`,
                "_blank",
              );
            }}
            style={{
              background: "#151515",
            }}
            className={classes.icon}
            size={25}
          />
        </div>
      </div>
      <EditDetails
        isClaims={true}
        claimAddress={claimAddress}
        open={open}
        setOpen={setOpen}
        onClose={handleClose}
        networkId={networkId}
      />
    </div>
  );
};

export default ClaimDescriptionInfo;
