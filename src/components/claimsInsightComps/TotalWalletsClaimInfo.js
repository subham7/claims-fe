import { useTheme } from "@mui/styles";
import React from "react";
import { convertFromWeiGovernance } from "../../utils/globalFunctions";
import { ClaimsInsightStyles } from "./claimsInsightStyles";

const TotalWalletsClaimInfo = ({
  numOfUsersClaimed,
  maxClaimableAmount,
  airdropTokenDetails,
  totalUsers = "",
}) => {
  const theme = useTheme();
  const classes = ClaimsInsightStyles(theme);
  return (
    <div className={classes.infoBottomRightContainer}>
      <p style={{ fontSize: "14px", fontWeight: "300" }}>Unique wallets</p>
      <h1>{numOfUsersClaimed}</h1>
      <p style={{ fontSize: "14px", fontWeight: "300" }}>
        {totalUsers > 0 ? `Out of ${totalUsers}` : "-"}
      </p>

      <div
        style={{
          marginTop: "35px",
        }}
        className={classes.flexContainer}>
        <div>
          <p style={{ fontSize: "14px", fontWeight: "300" }}>Max. claim</p>
          <p style={{ fontWeight: "700" }}>
            {convertFromWeiGovernance(
              maxClaimableAmount,
              airdropTokenDetails.tokenDecimal,
            )}{" "}
            ${airdropTokenDetails.tokenSymbol}
          </p>
        </div>

        <div>
          <div>
            <p style={{ fontSize: "14px", fontWeight: "300" }}>Avg price ($)</p>
            <p style={{ fontWeight: "700" }}>-</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TotalWalletsClaimInfo;
