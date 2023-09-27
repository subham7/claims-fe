import { Card, Grid, Typography } from "@mui/material";
import { makeStyles } from "@mui/styles";
import React from "react";
import ProgressBar from "../progressbar";

const useStyles = makeStyles({
  listFont: {
    fontSize: "20px",
    color: "#dcdcdc",
  },
  listFont2: {
    fontSize: "18px",
    color: "#dcdcdc",
  },
  listFont2Colourless: {
    fontSize: "18px",
    color: "#FFFFFF",
    fontWeight: "bold",
  },
});

const CurrentResults = ({ proposalData, fetched }) => {
  const classes = useStyles();

  const calculateVotePercentage = (voteReceived) => {
    let totalVote = 0;
    proposalData?.votingOptions.map((vote, key) => {
      totalVote += vote.count;
    });
    return (voteReceived / totalVote).toFixed(2) * 100;
  };
  return (
    <Card>
      <Grid container item mb={2}>
        <Typography className={classes.listFont}>Current results</Typography>
      </Grid>
      {fetched ? (
        proposalData?.votingOptions.length > 0 ? (
          proposalData?.votingOptions.map((vote, key) => {
            return (
              <Grid key={key} sx={{ marginBottom: "10px" }}>
                <Grid container>
                  <Grid item sx={{ display: "flex" }}>
                    <Typography className={classes.listFont2}>
                      {vote.text}
                    </Typography>
                    <Typography
                      sx={{
                        background: "#6475A3",
                        paddingX: "10px",
                        marginBottom: "5px",
                        borderRadius: "5px",
                      }}
                      mx={1}
                      variant="subtitle2">
                      {vote.count}
                    </Typography>
                  </Grid>
                  <Grid
                    item
                    xs
                    sx={{
                      display: "flex",
                      justifyContent: "flex-end",
                    }}>
                    <Typography className={classes.listFont2Colourless}>
                      {vote.count > 0 ? calculateVotePercentage(vote.count) : 0}
                      %
                    </Typography>
                  </Grid>
                </Grid>
                <ProgressBar
                  value={
                    vote.count > 0 ? calculateVotePercentage(vote.count) : 0
                  }
                />
              </Grid>
            );
          })
        ) : (
          <Typography className={classes.listFont2Colourless}>
            No previous results available
          </Typography>
        )
      ) : null}
    </Card>
  );
};

export default CurrentResults;
