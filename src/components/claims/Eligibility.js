import { Skeleton } from "@mui/material";
import React from "react";
import { convertFromWeiGovernance } from "utils/globalFunctions";
import classes from "./NewClaim.module.scss";

const Eligibility = ({ claimsData, tokenDetails }) => {
  return (
    <div className={classes.whoCanClaimContainer}>
      <h3 className={classes.header}>Who can claim?</h3>
      <div>
        {claimsData ? (
          <h4>
            {claimsData?.claimType === "0"
              ? `${convertFromWeiGovernance(
                  claimsData?.minWhitelistTokenValue,
                  tokenDetails.whitelistTokenDecimal,
                )} ${tokenDetails.whitelistToken}`
              : claimsData?.claimType === "1"
              ? "Allowlisted users only"
              : claimsData?.claimType === "2"
              ? "Everyone"
              : "Pro-rata"}
          </h4>
        ) : (
          <Skeleton height={40} width={140} />
        )}

        {claimsData ? (
          <p>
            {claimsData?.claimType === "2"
              ? `Upto ${Number(
                  convertFromWeiGovernance(
                    claimsData?.maxClaimableAmount,
                    tokenDetails?.tokenDecimal,
                  ),
                )} ${tokenDetails.tokenSymbol} on first-come first serve basis.`
              : claimsData?.claimType === "1"
              ? "Only allowlisted users by the creator can claim from this drop."
              : claimsData?.claimType === "0"
              ? "Hold these token(s) to participate in this drop."
              : "This drop is pro-rata gated"}
          </p>
        ) : (
          <Skeleton />
        )}
      </div>
    </div>
  );
};

export default Eligibility;
