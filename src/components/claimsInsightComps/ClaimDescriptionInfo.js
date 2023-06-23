import React from "react";
import { AiFillCopy } from "react-icons/ai";
import { BsArrowLeftShort, BsLink45Deg } from "react-icons/bs";
import { FiExternalLink } from "react-icons/fi";
import { ClaimsInsightStyles } from "./claimsInsightStyles";

const ClaimDescriptionInfo = () => {
  const classes = ClaimsInsightStyles();
  return (
    <div className={classes.infoTopContainer}>
      <div className={classes.flexContainer}>
        <div className={classes.gapContainer}>
          <BsArrowLeftShort size={25} />
          <p>Back</p>
        </div>
        <div className={classes.gapContainer}>
          <BsLink45Deg
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
              background: "#0ABB92",
              padding: "2px 14px",
              fontSize: "14px",
              borderRadius: "25px",
            }}>
            Live
          </p>
        </div>
      </div>

      <h2
        style={{
          margin: 0,
          padding: 0,
        }}>
        Shardeum’s investment token distribution
      </h2>
      <div className={classes.copyContainer}>
        <p>0x51EEBc7765b246a4D16d02b28CEAC61299AB7d9d</p>
        <div className={classes.gapContainer}>
          <AiFillCopy
            style={{
              border: "0.5px solid #6475A3",
              padding: "4px",
              borderRadius: "5px",
              cursor: "pointer",
            }}
            size={25}
          />
          <FiExternalLink
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
