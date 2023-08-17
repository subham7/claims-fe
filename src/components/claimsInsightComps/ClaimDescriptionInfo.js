import { useRouter } from "next/router";
import React, { useEffect, useState } from "react";
import { AiFillCopy } from "react-icons/ai";
import { BsArrowLeftShort, BsLink45Deg } from "react-icons/bs";
import { FiExternalLink } from "react-icons/fi";
import { ClaimsInsightStyles } from "./claimsInsightStyles";

const ClaimDescriptionInfo = ({
  description,
  endTime,
  startTime,
  claimAddress,
  isActive,
}) => {
  const [claimActive, setClaimActive] = useState(false);
  const [isClaimStarted, setIsClaimStarted] = useState(false);
  const [claimEnabled, setClaimEnabled] = useState(false);

  const router = useRouter();
  const classes = ClaimsInsightStyles();
  const copyHandler = () => {
    navigator.clipboard.writeText(
      `${window.location.origin}/claims/${claimAddress}`,
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
            router.push("/claims");
          }}
          className={classes.gapContainer}>
          <BsArrowLeftShort size={25} />
          <p>Back</p>
        </div>
        <div className={classes.gapContainer}>
          <BsLink45Deg
            onClick={() => {
              router.push(`/claims/${claimAddress}`);
            }}
            style={{
              border: "0.5px solid #6475A3",
              padding: "3px",
              borderRadius: "5px",
              cursor: "pointer",
            }}
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
              border: "0.5px solid #6475A3",
              padding: "4px",
              borderRadius: "5px",
              cursor: "pointer",
            }}
            size={25}
          />
          <FiExternalLink
            onClick={() => {
              window.open(
                `https://polygonscan.com/address/${claimAddress}`,
                "_blank",
              );
            }}
            style={{
              border: "0.5px solid #6475A3",
              padding: "4px",
              borderRadius: "5px",
              cursor: "pointer",
            }}
            size={25}
          />
        </div>
      </div>
    </div>
  );
};

export default ClaimDescriptionInfo;
