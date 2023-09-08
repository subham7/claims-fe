import { Card, Grid, Typography } from "@mui/material";
import { makeStyles } from "@mui/styles";

import React from "react";
import { shortAddress } from "utils/helper";

const useStyles = makeStyles({
  listFont2: {
    fontSize: "18px",
    color: "#C1D3FF",
  },
  listFont2Colourless: {
    fontSize: "18px",
    color: "#FFFFFF",
    fontWeight: "bold",
  },
  proposalThreshold: {
    fontSize: "18px",
    color: "#0ABB92",
    fontWeight: "bold",
  },
});

const ProposalInfo = ({
  proposalData,
  fetched,
  members,
  threshold,
  isGovernanceActive,
  ownerAddresses,
}) => {
  const classes = useStyles();
  return (
    <Card>
      <Grid container>
        <Grid item>
          <Typography className={classes.listFont2}>Proposed by</Typography>
        </Grid>
        <Grid item xs sx={{ display: "flex", justifyContent: "flex-end" }}>
          <Typography className={classes.listFont2Colourless}>
            {fetched ? shortAddress(proposalData?.createdBy) : null}
          </Typography>
        </Grid>
      </Grid>
      <Grid container>
        <Grid item>
          <Typography className={classes.listFont2}>Voting system</Typography>
        </Grid>
        <Grid item xs sx={{ display: "flex", justifyContent: "flex-end" }}>
          <Typography className={classes.listFont2Colourless}>
            Single choice
          </Typography>
        </Grid>
      </Grid>

      <Grid container>
        <Grid item>
          <Typography className={classes.listFont2}>Threshold</Typography>
        </Grid>
        <Grid item xs sx={{ display: "flex", justifyContent: "flex-end" }}>
          <Typography className={classes.proposalThreshold}>
            {isGovernanceActive
              ? Number(
                  Math.ceil(members?.users?.length * threshold) / 100,
                ).toFixed(0)
              : Number(
                  Math.ceil(ownerAddresses?.length * threshold) / 100,
                ).toFixed(0)}{" "}
            Votes
          </Typography>
        </Grid>
      </Grid>
      <Grid container>
        <Grid item>
          <Typography className={classes.listFont2}>Start date</Typography>
        </Grid>
        <Grid item xs sx={{ display: "flex", justifyContent: "flex-end" }}>
          <Typography className={classes.listFont2Colourless}>
            {fetched
              ? new Date(String(proposalData?.updateDate)).toLocaleDateString()
              : null}
          </Typography>
        </Grid>
      </Grid>
      <Grid container>
        <Grid item>
          <Typography className={classes.listFont2}>End date</Typography>
        </Grid>
        <Grid item xs sx={{ display: "flex", justifyContent: "flex-end" }}>
          <Typography className={classes.listFont2Colourless}>
            {fetched
              ? new Date(
                  String(proposalData?.votingDuration),
                ).toLocaleDateString()
              : null}
          </Typography>
        </Grid>
      </Grid>
    </Card>
  );
};

export default ProposalInfo;
