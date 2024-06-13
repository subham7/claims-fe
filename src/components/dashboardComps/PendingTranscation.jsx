import React from "react";
import classes from "./Dashboard.module.scss";
import { Typography } from "@mui/material";
import ProposalItem from "@components/(proposal)/ProposalItem";

const PendingTranscation = ({
  daoAddress,
  executionId,
  proposal,
  routeNetworkId,
}) => {
  return (
    <div className={classes.pendingTranscationContainer}>
      <Typography variant="inherit" color={"#707070"}>
        Pending Transaction
      </Typography>

      <ProposalItem
        daoAddress={daoAddress}
        executionId={executionId}
        proposal={proposal}
        routeNetworkId={routeNetworkId}
        type={"signed"}
      />
    </div>
  );
};

export default PendingTranscation;
