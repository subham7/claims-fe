import { Typography } from "@mui/material";
import React from "react";
import { convertFromWeiGovernance } from "utils/globalFunctions";
import classes from "../claims/Claim.module.scss";
import { CHAIN_CONFIG } from "utils/constants";

const Eligibility = ({
  contractData,
  tokenDetails,
  isTokenGated = false,
  isDeposit = false,
  gatedTokenDetails,
  isWhitelist = false,
  routeNetworkId,
}) => {
  const getClaimInfo = (claimType, contractData, tokenDetails) => {
    switch (claimType) {
      case "0":
        const minValue = tokenDetails?.whitelistTokenDecimal
          ? convertFromWeiGovernance(
              contractData?.minWhitelistTokenValue,
              tokenDetails?.whitelistTokenDecimal,
            )
          : contractData?.minWhitelistTokenValue;
        return {
          displayText: `${minValue} ${tokenDetails?.whitelistTokenSymbol}`,
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
          displayText: "Users verified with World ID",
          description: `Upto ${maxClaimableAmount} ${tokenDetails.tokenSymbol} on first-come first serve basis.`,
        };

      default:
        return {
          displayText: "Pro-rata",
          description: "Token will be distributed on pro-rata basis",
        };
    }
  };

  const { claimType } = contractData || {};
  const { displayText: defaultDisplayText, description: defaultDescription } =
    !isDeposit && getClaimInfo(claimType, contractData, tokenDetails);

  let gatedTokenText = "";

  // const getGatedTokenValue = (amount, decimal) => {
  //   return decimal > 0 ? convertFromWeiGovernance(amount, decimal) : amount;
  // };

  // if (isTokenGated) {
  //   const tokenAValue = getGatedTokenValue(
  //     gatedTokenDetails?.tokenAAmt,
  //     gatedTokenDetails?.tokenADecimal,
  //   );
  //   const tokenASymbol = gatedTokenDetails?.tokenASymbol;

  //   if (gatedTokenDetails?.tokenASymbol === gatedTokenDetails?.tokenBSymbol) {
  //     gatedTokenText = `Hold ${tokenAValue} ${tokenASymbol}`;
  //   } else {
  //     const tokenBValue = getGatedTokenValue(
  //       gatedTokenDetails?.tokenBAmt,
  //       gatedTokenDetails?.tokenBDecimal,
  //     );
  //     const tokenBSymbol = gatedTokenDetails?.tokenBSymbol;
  //     const operator = gatedTokenDetails?.operator === 0 ? "AND" : "OR";

  //     gatedTokenText = `Hold ${tokenAValue} ${tokenASymbol} ${operator} ${tokenBValue} ${tokenBSymbol}`;
  //   }
  // }

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

      {isTokenGated ? (
        <div>
          <Typography variant="inherit">
            Match {gatedTokenDetails?.operator === 1 ? "at least one of" : ""}{" "}
            the following condtion(s)
          </Typography>

          <div className={classes.tokenList}>
            {gatedTokenDetails?.tokensData.map((item, index) => (
              <div
                key={index}
                onClick={() => {
                  window.open(
                    `${CHAIN_CONFIG[routeNetworkId].blockExplorerUrl}/token/${item.address}`,
                    "_blank",
                  );
                }}
                className={classes.tokenContainer}>
                <Typography variant="inherit">
                  Hold {item.requiredAmount} {item.symbol}
                </Typography>
              </div>
            ))}
          </div>
        </div>
      ) : (
        <div>
          <h4>{displayText}</h4>
          <Typography variant="inherit">{description}</Typography>
        </div>
      )}
    </div>
  );
};

export default Eligibility;
