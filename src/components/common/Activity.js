import { Typography } from "@mui/material";
import React from "react";
import { MetaMaskAvatar } from "react-metamask-avatar";
import { convertFromWeiGovernance } from "utils/globalFunctions";
import { returnRemainingTime, shortAddress } from "utils/helper";
import classes from "../claims/Claim.module.scss";
import { useEnsName } from "wagmi";
import { CHAIN_CONFIG } from "utils/constants";
import Image from "next/image";

const ClaimerActivity = ({ activity, tokenDetails }) => {
  const { data: ensName } = useEnsName({
    address: activity?.claimerAddress,
    chainId: 1,
  });

  return (
    <div className={classes.activity}>
      <div>
        <MetaMaskAvatar address={activity?.claimerAddress} />
        <Typography variant="inherit">
          {ensName ? ensName : shortAddress(activity?.claimerAddress)}
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
};

const DepositorActivity = ({ member, routeNetworkId }) => {
  const { data: ensName } = useEnsName({
    address: member?.userAddress,
    chainId: 1,
  });

  return (
    <div key={member?.userAddress} className={classes.flexContainer}>
      <div
        style={{
          display: "flex",
          gap: "8px",
        }}>
        {CHAIN_CONFIG[routeNetworkId]?.theme?.metamask_icon ? (
          <Image
            src={CHAIN_CONFIG[routeNetworkId]?.theme?.metamask_icon}
            height={20}
            width={20}
            alt="Avatar"
          />
        ) : (
          <MetaMaskAvatar address={member?.userAddress} />
        )}

        <Typography variant="inherit">
          {ensName ? ensName : shortAddress(member?.userAddress)} joined this{" "}
          {CHAIN_CONFIG[routeNetworkId]?.theme?.stationType}
        </Typography>
      </div>
      <Typography variant="inherit" className={classes.time}>
        {returnRemainingTime(+member?.timeStamp)} ago
      </Typography>
    </div>
  );
};

const Activity = ({
  activityDetails,
  tokenDetails,
  isDeposit = false,
  routeNetworkId,
}) => {
  return (
    <div>
      <h3 className={classes.header}>Activity</h3>
      <div className={classes.activities}>
        {activityDetails.length ? (
          activityDetails.map((activity, index) =>
            isDeposit ? (
              <DepositorActivity
                routeNetworkId={routeNetworkId}
                key={index}
                member={activity}
              />
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
