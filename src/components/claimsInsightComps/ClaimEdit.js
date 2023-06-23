import React from "react";
import { IoIosArrowForward } from "react-icons/io";
import { ClaimsInsightStyles } from "./claimsInsightStyles";

const ClaimEdit = () => {
  const classes = ClaimsInsightStyles();

  return (
    <div className={classes.claimEditContainer}>
      <div className={classes.flexContainer}>
        <p>Add more tokens</p>
        <IoIosArrowForward />
      </div>
      <div className={classes.flexContainer}>
        <p>Rollback unclaimed tokens</p>
        <IoIosArrowForward />
      </div>
      <div className={classes.flexContainer}>
        <p>Modify end/start of claims</p>
        <IoIosArrowForward />
      </div>
    </div>
  );
};

export default ClaimEdit;
