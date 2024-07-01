import React from "react";
import classes from "./Dashboard.module.scss";
import { Typography } from "@mui/material";
import PendingTransactionItem from "./PendingTransactionItem";

const PendingTranscation = ({
  daoAddress,
  executionId,
  proposal,
  routeNetworkId,
  onProposalUpdate,
}) => {
  return (
    <div className={classes.pendingTranscationContainer}>
      <Typography variant="inherit" color={"#707070"}>
        Pending Transaction
      </Typography>

      {proposal ? (
        <PendingTransactionItem
          daoAddress={daoAddress}
          executionId={executionId}
          proposal={proposal}
          routeNetworkId={routeNetworkId}
          onProposalUpdate={onProposalUpdate}
        />
      ) : (
        <Typography
          variant="inherit"
          py={4}
          sx={{
            textAlign: "center",
          }}>
          No active proposal.
        </Typography>
      )}
    </div>
  );
};

export default PendingTranscation;
