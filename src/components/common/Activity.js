import { Typography } from "@mui/material";
import React from "react";
import { MetaMaskAvatar } from "react-metamask-avatar";
import { convertFromWeiGovernance } from "utils/globalFunctions";
import { returnRemainingTime, shortAddress } from "utils/helper";
import classes from "../claims/Claim.module.scss";

const ClaimerActivity = ({ activity, tokenDetails }) => (
  <div className={classes.activity}>
    <div>
      <MetaMaskAvatar address={activity?.claimerAddress} />
      <Typography variant="inherit">
        {shortAddress(activity?.claimerAddress)}
      </Typography>
    </div>
    <Typography variant="inherit">
      {convertFromWeiGovernance(
        activity?.amountClaimed,
        tokenDetails.tokenDecimal,
      )}{" "}
      <span>{tokenDetails?.tokenSymbol}</span>
    </Typography>
  </div>
);

const DepositorActivity = ({ member }) => (
  <div key={member?.userAddress} className={classes.flexContainer}>
    <div
      style={{
        display: "flex",
        gap: "8px",
      }}>
      <MetaMaskAvatar address={member?.userAddress} />
      <Typography variant="inherit">
        {shortAddress(member?.userAddress)} joined this station
      </Typography>
    </div>
    <Typography variant="inherit" className={classes.time}>
      {returnRemainingTime(+member?.timeStamp)} ago
    </Typography>
  </div>
);

const Activity = ({ activityDetails, tokenDetails, isDeposit = false }) => {
  return (
    <div>
      <h3 className={classes.header}>Activity</h3>
      <div className={classes.activities}>
        {activityDetails.length ? (
          activityDetails.map((activity, index) =>
            isDeposit ? (
              <DepositorActivity key={index} member={activity} />
            ) : (
              <ClaimerActivity
                key={index}
                activity={activity}
                tokenDetails={tokenDetails}
              />
            ),
          )
        ) : (
          <Typography variant="inherit">No activities as of now!</Typography>
        )}
      </div>
    </div>
  );
};

export default Activity;
