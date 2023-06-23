import React from "react";
import { convertFromWeiGovernance } from "../../utils/globalFunctions";
import { convertEpochTimeInCounterFormat } from "../../utils/helper";
import { ClaimsInsightStyles } from "./claimsInsightStyles";

const TotalClaimedInfo = ({
  airdropTokenDetails,
  totalAmountClaimed,
  totalClaimAmount,
  endTime,
  claimType,
}) => {
  const classes = ClaimsInsightStyles();

  const endingTimeInNum = new Date(+endTime * 1000);
  console.log(+endTime * 1000);

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
  ).toFixed(0);

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
            {convertEpochTimeInCounterFormat(endTime)}
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
