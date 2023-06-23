import React from "react";
import { ClaimsInsightStyles } from "./claimsInsightStyles";

const TotalClaimedInfo = () => {
  const classes = ClaimsInsightStyles();

  return (
    <div className={classes.infoBottomLeftContainer}>
      <p style={{ fontSize: "14px", fontWeight: "300" }}>Total Claimed</p>
      <h1>98000</h1>
      <p style={{ fontSize: "14px", fontWeight: "300" }}>Out of 1000000 $SHM</p>

      <div
        style={{
          marginTop: "35px",
        }}
        className={classes.flexContainer}>
        <div>
          <p style={{ fontSize: "14px", fontWeight: "300" }}>Claimed (%)</p>
          <p style={{ fontWeight: "700" }}>98%</p>
        </div>
        <div>
          <p style={{ fontSize: "14px", fontWeight: "300" }}>Ends in</p>
          <p style={{ fontWeight: "700" }}>10D: 04H: 17M</p>
        </div>
        <div>
          <p style={{ fontSize: "14px", fontWeight: "300" }}>Claim type</p>
          <p style={{ fontWeight: "700" }}>Pro-rata</p>
        </div>
      </div>
    </div>
  );
};

export default TotalClaimedInfo;
