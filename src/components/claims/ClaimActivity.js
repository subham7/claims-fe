import React from "react";
import { MetaMaskAvatar } from "react-metamask-avatar";
import { convertFromWeiGovernance } from "utils/globalFunctions";
import classes from "./NewClaim.module.scss";

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
                <p>{`${activity?.claimerAddress.slice(
                  0,
                  7,
                )}....${activity?.claimerAddress.slice(-7)}`}</p>
              </div>
              <p>
                {convertFromWeiGovernance(
                  activity?.amountClaimed,
                  tokenDetails.tokenDecimal,
                )}{" "}
                <span>{tokenDetails?.tokenSymbol}</span>
              </p>
            </div>
          ))
        ) : (
          <p>No activities as of now!</p>
        )}
      </div>
    </div>
  );
};

export default ClaimActivity;
