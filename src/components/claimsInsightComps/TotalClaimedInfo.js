import { useTheme } from "@mui/styles";
import React from "react";
import { convertFromWeiGovernance } from "../../utils/globalFunctions";
import { formatEpochTime } from "../../utils/helper";
import { ClaimsInsightStyles } from "./claimsInsightStyles";

const TotalClaimedInfo = ({
  airdropTokenDetails,
  totalAmountClaimed,
  totalClaimAmount,
  endTime,
  claimType,
}) => {
  const theme = useTheme();
  const classes = ClaimsInsightStyles(theme);

  const percentage = Number(
    (Number(
      convertFromWeiGovernance(
        totalAmountClaimed,
        airdropTokenDetails.tokenDecimal,
      ),
    ) /
      Number(
        convertFromWeiGovernance(
          totalClaimAmount,
          airdropTokenDetails.tokenDecimal,
        ),
      )) *
      100,
  ).toFixed(2);

  return (
    <div className={classes.infoBottomLeftContainer}>
      <p style={{ fontSize: "14px", fontWeight: "300" }}>Total Claimed</p>
      <h1>
        {convertFromWeiGovernance(
          totalAmountClaimed,
          airdropTokenDetails.tokenDecimal,
        )}
      </h1>
      <p style={{ fontSize: "14px", fontWeight: "300" }}>
        Out of{" "}
        {convertFromWeiGovernance(
          totalClaimAmount,
          airdropTokenDetails.tokenDecimal,
        )}{" "}
        ${airdropTokenDetails.tokenSymbol}
      </p>

      <div
        style={{
          marginTop: "35px",
        }}
        className={classes.flexContainer}>
        <div>
          <p style={{ fontSize: "14px", fontWeight: "300" }}>Claimed (%)</p>
          <p style={{ fontWeight: "700" }}>{percentage}%</p>
        </div>
        <div>
          <p style={{ fontSize: "14px", fontWeight: "300" }}>Ends in</p>
          <p style={{ fontWeight: "700" }}>
            {Date.now() / 1000 < +endTime ? formatEpochTime(endTime) : "-"}
          </p>
        </div>
        <div>
          <p style={{ fontSize: "14px", fontWeight: "300" }}>Claim type</p>
          <p style={{ fontWeight: "700" }}>
            {claimType === "0"
              ? "Token Gated"
              : claimType === "1"
              ? "Whitelisted"
              : claimType === "2"
              ? "Everyone"
              : "Pro-rata"}
          </p>
        </div>
      </div>
    </div>
  );
};

export default TotalClaimedInfo;
