import { Card, Grid, Typography } from "@mui/material";
import { makeStyles } from "@mui/styles";

import React from "react";

const useStyles = makeStyles({
  listFont2: {
    fontSize: "19px",
    color: "#C1D3FF",
  },
  listFont2Colourless: {
    fontSize: "19px",
    color: "#FFFFFF",
    fontWeight: "bold",
  },
  proposalThreshold: {
    fontSize: "19px",
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
  ownerAddressess,
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
            {fetched
              ? proposalData?.createdBy.substring(0, 6) +
                ".........." +
                proposalData?.createdBy.substring(
                  proposalData?.createdBy.length - 4,
                )
              : null}
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
                  Math.ceil(members.users?.length * threshold) / 100,
                ).toFixed(0)
              : Number(
                  Math.ceil(ownerAddressess?.length * threshold) / 100,
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
