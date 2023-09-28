import { Typography } from "@mui/material";
import React from "react";
import { convertFromWeiGovernance } from "utils/globalFunctions";
import classes from "./Claim.module.scss";

const Eligibility = ({
  contractData,
  tokenDetails,
  isTokenGated = false,
  isDeposit = false,
  gatedTokenDetails,
  isWhitelist = false,
}) => {
  const getClaimInfo = (claimType, contractData, tokenDetails) => {
    switch (claimType) {
      case "0":
        const minValue = convertFromWeiGovernance(
          contractData?.minWhitelistTokenValue,
          tokenDetails?.whitelistTokenDecimal,
        );
        return {
          displayText: `${minValue} ${tokenDetails.whitelistToken}`,
          description: "Hold these token(s) to participate in this drop.",
        };

      case "1":
        return {
          displayText: "Allowlisted users only",
          description:
            "Only allowlisted users by the creator can claim from this drop.",
        };

      case "2":
        const maxClaimableAmount = Number(
          convertFromWeiGovernance(
            contractData?.maxClaimableAmount,
            tokenDetails?.tokenDecimal,
          ),
        );
        return {
          displayText: "Everyone",
          description: `Upto ${maxClaimableAmount} ${tokenDetails.tokenSymbol} on first-come first serve basis.`,
        };

      default:
        return {
          displayText: "Pro-rata",
          description: "This drop is pro-rata gated",
        };
    }
  };

  const { claimType } = contractData || {};
  const { displayText: defaultDisplayText, description: defaultDescription } =
    getClaimInfo(claimType, contractData, tokenDetails);

  let gatedTokenText = "";
  const getGatedTokenValue = (amount, decimal) => {
    return decimal > 0 ? convertFromWeiGovernance(amount, decimal) : amount;
  };

  if (isTokenGated) {
    const tokenAValue = getGatedTokenValue(
      gatedTokenDetails?.tokenAAmt,
      gatedTokenDetails?.tokenADecimal,
    );
    const tokenASymbol = gatedTokenDetails?.tokenASymbol;

    if (gatedTokenDetails?.tokenASymbol === gatedTokenDetails?.tokenBSymbol) {
      gatedTokenText = `Hold ${tokenAValue} ${tokenASymbol}`;
    } else {
      const tokenBValue = getGatedTokenValue(
        gatedTokenDetails?.tokenBAmt,
        gatedTokenDetails?.tokenBDecimal,
      );
      const tokenBSymbol = gatedTokenDetails?.tokenBSymbol;
      const operator = gatedTokenDetails?.operator === 0 ? "AND" : "OR";

      gatedTokenText = `Hold ${tokenAValue} ${tokenASymbol} ${operator} ${tokenBValue} ${tokenBSymbol}`;
    }
  }

  const displayText = isDeposit
    ? isWhitelist
      ? "Allow listed users only"
      : isTokenGated
      ? gatedTokenText
      : "Everyone can join"
    : defaultDisplayText;
  const description = isDeposit
    ? isWhitelist
      ? "Only allowlisted users by the creator can join this station."
      : isTokenGated
      ? "You need to match the above condition(s) to join this Station."
      : "Anyone can join this Station on FCFS basis."
    : defaultDescription;

  return (
    <div className={classes.whoCanClaimContainer}>
      <h3 className={classes.header}>
        Who can {isDeposit ? "join" : "claim"}?
      </h3>
      <div>
        <h4>{displayText}</h4>
        <Typography variant="inherit">{description}</Typography>
      </div>
    </div>
  );
};

export default Eligibility;
