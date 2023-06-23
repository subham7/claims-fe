import React from "react";
import { BsPencil } from "react-icons/bs";
import { ClaimsInsightStyles } from "./claimsInsightStyles";

const ClaimEligibility = () => {
  const classes = ClaimsInsightStyles();

  return (
    <div className={classes.eligibilityContainer}>
      <div className={classes.flexContainer}>
        <p>Conditions for eligibility</p>
        <BsPencil
          style={{
            border: "0.5px solid #6475A3",
            padding: "5px",
            borderRadius: "5px",
            cursor: "pointer",
          }}
          size={25}
        />
      </div>
    </div>
  );
};

export default ClaimEligibility;
