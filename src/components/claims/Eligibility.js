import { Typography } from "@mui/material";
import React from "react";
import { convertFromWeiGovernance } from "utils/globalFunctions";
import classes from "./Claim.module.scss";

const Eligibility = ({ claimsData, tokenDetails }) => {
  const getClaimInfo = (claimType, claimsData, tokenDetails) => {
    let displayText = "";
    let description = "";

    switch (claimType) {
      case "0":
        const minValue = convertFromWeiGovernance(
          claimsData?.minWhitelistTokenValue,
          tokenDetails?.whitelistTokenDecimal,
        );
        displayText = `${minValue} ${tokenDetails.whitelistToken}`;
        description = "Hold these token(s) to participate in this drop.";
        break;

      case "1":
        displayText = "Allowlisted users only";
        description =
          "Only allowlisted users by the creator can claim from this drop.";
        break;

      case "2":
        displayText = "Everyone";
        const maxClaimableAmount = Number(
          convertFromWeiGovernance(
            claimsData?.maxClaimableAmount,
            tokenDetails?.tokenDecimal,
          ),
        );
        description = `Upto ${maxClaimableAmount} ${tokenDetails.tokenSymbol} on first-come first serve basis.`;
        break;

      default:
        displayText = "Pro-rata";
        description = "This drop is pro-rata gated";
    }

    return { displayText, description };
  };

  const { displayText, description } = getClaimInfo(
    claimsData?.claimType,
    claimsData,
    tokenDetails,
  );

  return (
    <div className={classes.whoCanClaimContainer}>
      <h3 className={classes.header}>Who can claim?</h3>
      <div>
        <h4>{displayText}</h4>
        <Typography variant="inherit">{description}</Typography>
      </div>
    </div>
  );
};

export default Eligibility;
