import { Typography } from "@mui/material";
import React from "react";
import { MetaMaskAvatar } from "react-metamask-avatar";
import { convertFromWeiGovernance } from "utils/globalFunctions";
import { shortAddress } from "utils/helper";
import classes from "./Claim.module.scss";

const ClaimActivity = ({ activityDetails, tokenDetails }) => {
  return (
    <div>
      <h3 className={classes.header}>Activity</h3>

      <div className={classes.activities}>
        {activityDetails.length ? (
          activityDetails?.map((activity, index) => (
            <div className={classes.activity} key={index}>
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
          ))
        ) : (
          <Typography variant="inherit">No activities as of now!</Typography>
        )}
      </div>
    </div>
  );
};

export default ClaimActivity;
