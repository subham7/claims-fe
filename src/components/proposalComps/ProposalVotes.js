import { Card, Grid, Typography } from "@mui/material";
import { makeStyles } from "@mui/styles";
import React from "react";

const useStyles = makeStyles({
  listFont: {
    fontSize: "20px",
    color: "#C1D3FF",
  },
  listFont2: {
    fontSize: "19px",
    color: "#C1D3FF",
  },
  listFont2Colourless: {
    fontSize: "19px",
    color: "#FFFFFF",
    fontWeight: "bold",
  },
});

const ProposalVotes = ({ fetched, proposalData }) => {
  const classes = useStyles();

  const fetchVotingOptionChoice = (votingOptionAddress) => {
    let obj = proposalData?.votingOptions.find(
      (voteOption) => voteOption.votingOptionId === votingOptionAddress,
    );
    const voteId = parseInt(proposalData?.votingOptions.indexOf(obj));
    return proposalData?.votingOptions.indexOf(obj);
  };

  return (
    <Card>
      <Grid container item mb={2}>
        <Typography className={classes.listFont}>Votes</Typography>
      </Grid>
      {fetched ? (
        proposalData?.vote.length > 0 ? (
          proposalData?.vote.map((voter, key) => {
            if (key < 3) {
              return (
                <div key={key}>
                  <Grid container>
                    <Grid item>
                      <Typography className={classes.listFont2Colourless}>
                        {voter.voterAddress.substring(0, 6) +
                          "......" +
                          voter.voterAddress.substring(
                            voter.voterAddress.length - 4,
                          )}
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
                        {fetched
                          ? proposalData?.votingOptions[
                              parseInt(
                                fetchVotingOptionChoice(voter.votingOptionId),
                              )
                            ].text
                          : null}
                      </Typography>
                    </Grid>
                  </Grid>
                  <Grid container>
                    <Grid
                      item
                      xs
                      sx={{
                        display: "flex",
                        justifyContent: "flex-start",
                      }}>
                      <Typography variant="proposalSubHeading">
                        Signed on{" "}
                        {new Date(voter.createdAt).toLocaleDateString()}
                      </Typography>
                    </Grid>
                  </Grid>
                  <br />
                </div>
              );
            }
          })
        ) : (
          <Typography className={classes.listFont2Colourless}>
            No previous votes available
          </Typography>
        )
      ) : null}
      {/* {fetched && proposalData?.length >= 0 ? (
        <Grid container>
          <Grid item md={12}>
            <Button
              sx={{ width: "100%" }}
              variant="transparentWhite"
              onClick={() => handleShowMore()}
            >
              More
            </Button>
          </Grid>
        </Grid>
      ) : null} */}
    </Card>
  );
};

export default ProposalVotes;
