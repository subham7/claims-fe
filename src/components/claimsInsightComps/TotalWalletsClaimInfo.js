import React from "react";
import { ClaimsInsightStyles } from "./claimsInsightStyles";

const TotalWalletsClaimInfo = () => {
  const classes = ClaimsInsightStyles();
  return (
    <div className={classes.infoBottomRightContainer}>
      <p style={{ fontSize: "14px", fontWeight: "300" }}>Unique wallets</p>
      <h1>60</h1>
      <p style={{ fontSize: "14px", fontWeight: "300" }}>Out of 70</p>

      <div
        style={{
          marginTop: "35px",
        }}
        className={classes.flexContainer}>
        <div>
          <p style={{ fontSize: "14px", fontWeight: "300" }}>Max. claim</p>
          <p style={{ fontWeight: "700" }}>Pro-rata</p>
        </div>

        <div>
          <div>
            <p style={{ fontSize: "14px", fontWeight: "300" }}>Avg price ($)</p>
            <p style={{ fontWeight: "700" }}>$2</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TotalWalletsClaimInfo;
