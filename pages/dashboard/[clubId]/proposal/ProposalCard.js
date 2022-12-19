import { Card, CardActionArea, Chip, Grid, Typography } from "@mui/material";
import { makeStyles } from "@mui/styles";
import { calculateDays } from "../../../../src/utils/globalFunctions";
import actionIcon from "../../../../public/assets/icons/action_icon.svg";
import tickerIcon from "../../../../public/assets/icons/ticker_icon.svg";
import surveyIcon from "../../../../public/assets/icons/survey_icon.svg";
import React from "react";
import Image from "next/image";

const useStyles = makeStyles({
  clubAssets: {
    fontFamily: "Whyte",
    fontSize: "48px",
    color: "#FFFFFF",
  },
  addButton: {
    width: "11vw",
    height: "60px",
    background: "#3B7AFD 0% 0% no-repeat padding-box",
    borderRadius: "10px",
  },
  addButton2: {
    width: "242px",
    height: "60px",
    background: "#3B7AFD 0% 0% no-repeat padding-box",
    borderRadius: "10px",
    fontSize: "22px",
    fontFamily: "Whyte",
  },
  searchField: {
    "width": "28.5vw",
    "height": "55px",
    "color": "#C1D3FF",
    "background": "#111D38 0% 0% no-repeat padding-box",
    "border": "1px solid #C1D3FF40",
    "borderRadius": "10px",
    "&:hover": {
      boxShadow: "0px 0px 12px #C1D3FF40",
      border: "1px solid #C1D3FF40",
      borderRadius: "10px",
      opacity: 1,
    },
  },
  allIllustration: {
    width: "12px",
    height: "12px",
    marginRight: "15px",
    backgroundColor: "#3B7AFD",
    borderRadius: "50%",
  },
  activeIllustration: {
    height: "12px",
    width: "12px",
    backgroundColor: "#0ABB92",
    borderRadius: "50%",
    marginRight: "15px",
  },
  passedIllustration: {
    height: "12px",
    width: "12px",
    backgroundColor: "#FFB74D",
    borderRadius: "50%",
    marginRight: "15px",
  },
  executedIllustration: {
    height: "12px",
    width: "12px",
    backgroundColor: "#F75F71",
    borderRadius: "50%",
    marginRight: "15px",
  },
  failedIllustration: {
    height: "12px",
    width: "12px",
    backgroundColor: "#D55438",
    borderRadius: "50%",
    marginRight: "15px",
  },
  listFont: {
    fontSize: "22px",
    color: "#C1D3FF",
    fontFamily: "Whyte",
  },
  cardFont: {
    fontSize: "18px",
    color: "#C1D3FF",
    fontFamily: "Whyte",
  },
  cardFont1: {
    fontSize: "24px",
    color: "#EFEFEF",
    fontFamily: "Whyte",
  },
  actionChip: {
    border: "1px solid #0ABB92",
    background: "transparent",
    textTransform: "capitalize",
  },
  surveyChip: {
    border: "1px solid #6C63FF",
    background: "transparent",
    textTransform: "capitalize",
  },
  timeLeftChip: {
    background: "#111D38",
    borderRadius: "5px",
  },
  cardFontActive: {
    fontSize: "16px",
    backgroundColor: "#0ABB92",
    padding: "5px 5px 5px 5px",
  },
  cardFontExecuted: {
    fontSize: "16px",
    backgroundColor: "#F75F71",
    padding: "5px 5px 5px 5px",
  },
  cardFontPassed: {
    fontSize: "16px",
    backgroundColor: "#FFB74D",
    padding: "5px 5px 5px 5px",
  },
  cardFontFailed: {
    fontSize: "16px",
    backgroundColor: "#D55438",
    padding: "5px 5px 5px 5px",
  },
  dialogBox: {
    fontFamily: "Whyte",
    fontSize: "38px",
    color: "#FFFFFF",
    opacity: 1,
    fontStyle: "normal",
  },
  cardDropDown: {
    width: "340px",
  },
  cardTextBox: {
    color: "#C1D3FF",
    background: "#111D38 0% 0% no-repeat padding-box",
    border: "1px solid #C1D3FF40",
    borderRadius: "10px",
  },
  modalStyle: {
    width: "792px",
    backgroundColor: "#19274B",
  },
  proposalCard: {
    backgroundColor: "#142243",
    padding: 0,
    margin: 0,
  },
  mainCard: {
    borderRadius: "10px",
    border: "1px solid #C1D3FF40",
    backgroundColor: "#142243",
  },
  daysFont: {
    fontFamily: "Whyte",
    fontSize: "21px",
    color: "#FFFFFF",
  },
  datePicker: {
    borderRadius: "10px",
    backgroundColor: "#111D38",
    width: "90%",
  },
  banner: {
    width: "100%",
  },
});

const ProposalCard = ({
  proposal,
  indexKey,
  fetched,
  executionTransaction,
}) => {
  const classes = useStyles();
  //   console.log("key in card", indexKey);
  return (
    <CardActionArea sx={{ borderRadius: "10px" }}>
      <Card className={classes.mainCard}>
        <Grid container>
          <Grid item ml={2} mr={2}>
            <Typography className={classes.cardFont}>
              Proposed by{" "}
              {fetched
                ? proposal.createdBy.substring(0, 6) +
                  ".........." +
                  proposal.createdBy.substring(proposal.createdBy.length - 4)
                : null}{" "}
              on {new Date(String(proposal?.updateDate)).toLocaleDateString()}
            </Typography>
          </Grid>
          <Grid
            item
            ml={1}
            mr={1}
            xs
            sx={{
              display: "flex",
              justifyContent: "flex-end",
            }}
          >
            {fetched ? (
              <Grid
                container
                spacing={1}
                sx={{
                  display: "flex",
                  justifyContent: "flex-end",
                }}
              >
                <Grid item>
                  <Chip
                    className={classes.timeLeftChip}
                    label={
                      <Grid container>
                        <Image src={tickerIcon} alt="ticker-icon" />
                        <Typography ml={1}>
                          {" "}
                          {calculateDays(proposal.votingDuration) <= 0
                            ? "Voting closed"
                            : calculateDays(proposal.votingDuration) +
                              " days left"}
                        </Typography>
                      </Grid>
                    }
                  />
                </Grid>
                <Grid item>
                  <Chip
                    className={
                      proposal.type === "action"
                        ? classes.actionChip
                        : classes.surveyChip
                    }
                    label={
                      <Grid container>
                        {proposal.type === "action" ? (
                          <Image src={actionIcon} alt="action-icon" />
                        ) : (
                          <Image src={surveyIcon} alt="survey-icon" />
                        )}
                        <Typography ml={1}>{proposal.type}</Typography>
                      </Grid>
                    }
                  />
                </Grid>
                <Grid item>
                  {" "}
                  <Chip
                    className={
                      proposal.status === "active"
                        ? classes.cardFontActive
                        : proposal.status === "passed"
                        ? classes.cardFontPassed
                        : proposal.status === "executed"
                        ? classes.cardFontExecuted
                        : proposal.status === "failed"
                        ? classes.cardFontFailed
                        : classes.cardFontFailed
                    }
                    label={
                      proposal.status.charAt(0).toUpperCase() +
                      proposal.status.slice(1)
                    }
                  />
                </Grid>
              </Grid>
            ) : null}
          </Grid>
        </Grid>
        <Grid container>
          <Grid item ml={2} mr={2}>
            <Typography className={classes.cardFont1}>
              {executionTransaction ? (
                <> {proposal?.name}</>
              ) : (
                <>
                  [#{indexKey + 1}] {proposal?.name}
                </>
              )}
            </Typography>
          </Grid>
        </Grid>
        <Grid container>
          <Grid item ml={2} mr={2}>
            <Typography className={classes.cardFont}>
              {proposal?.description.substring(0, 200)}...
            </Typography>
          </Grid>
        </Grid>
        <Grid container>
          <Grid item ml={2} mr={2} mt={2}>
            <Grid container spacing={1}>
              {proposal?.commands[0]?.usdcTokenSymbol &&
              !proposal?.commands[0]?.quorum &&
              !proposal?.commands[0]?.totalDeposits ? (
                <Grid item sx={{ display: "flex" }}>
                  <Chip
                    className={classes.timeLeftChip}
                    label={
                      <Grid sx={{ display: "flex" }}>
                        {" "}
                        <Typography color="#C1D3FF" sx={{ marginRight: "5px" }}>
                          Asset:
                        </Typography>
                        <Typography color="#FFFFFF">
                          {proposal.commands[0].usdcTokenSymbol}
                        </Typography>
                      </Grid>
                    }
                  ></Chip>
                </Grid>
              ) : (
                <></>
              )}

              {proposal?.commands[0]?.airDropAmount ? (
                <Grid item>
                  <Chip
                    className={classes.timeLeftChip}
                    label={
                      proposal.commands[0].airDropAmount ? (
                        <Grid sx={{ display: "flex" }}>
                          {" "}
                          <Typography
                            color="#C1D3FF"
                            sx={{ marginRight: "5px" }}
                          >
                            Amount:
                          </Typography>
                          <Typography color="#FFFFFF">
                            {proposal.commands[0].airDropAmount /
                              10 ** proposal.commands[0].usdcTokenDecimal}
                          </Typography>
                        </Grid>
                      ) : null
                    }
                  ></Chip>
                </Grid>
              ) : null}

              {proposal?.commands[0]?.customTokenAmounts ? (
                <Grid item>
                  <Chip
                    className={classes.timeLeftChip}
                    label={
                      <Grid sx={{ display: "flex" }}>
                        {" "}
                        <Typography color="#C1D3FF" sx={{ marginRight: "5px" }}>
                          Amount:
                        </Typography>
                        <Typography color="#FFFFFF">
                          {proposal.commands[0].customTokenAmounts[0] /
                            10 ** proposal.commands[0].usdcTokenDecimal}
                        </Typography>
                      </Grid>
                    }
                  ></Chip>
                </Grid>
              ) : null}

              {proposal?.commands[0]?.customTokenAddresses ? (
                <Grid item>
                  <Chip
                    className={classes.timeLeftChip}
                    label={
                      <Grid sx={{ display: "flex" }}>
                        {" "}
                        <Typography color="#C1D3FF" sx={{ marginRight: "5px" }}>
                          Recipient:
                        </Typography>
                        <Typography color="#FFFFFF">
                          {proposal?.commands[0]?.customTokenAddresses[0].substring(
                            0,
                            6,
                          ) +
                            "....." +
                            proposal?.commands[0]?.customTokenAddresses[0].substring(
                              proposal?.commands[0]?.customTokenAddresses[0]
                                .length - 4,
                            )}
                        </Typography>
                      </Grid>
                    }
                  ></Chip>
                </Grid>
              ) : null}

              {proposal?.commands[0]?.quorum &&
              proposal?.commands[0]?.threshold ? (
                <>
                  <Grid item>
                    <Chip
                      className={classes.timeLeftChip}
                      label={
                        <Grid sx={{ display: "flex" }}>
                          {" "}
                          <Typography
                            color="#C1D3FF"
                            sx={{ marginRight: "5px" }}
                          >
                            Quorum:
                          </Typography>
                          <Typography color="#FFFFFF">
                            {proposal?.commands[0]?.quorum}
                          </Typography>
                        </Grid>
                      }
                    ></Chip>
                  </Grid>
                  <Grid item>
                    <Chip
                      className={classes.timeLeftChip}
                      label={
                        <Grid sx={{ display: "flex" }}>
                          {" "}
                          <Typography
                            color="#C1D3FF"
                            sx={{ marginRight: "5px" }}
                          >
                            Threshold:
                          </Typography>
                          <Typography color="#FFFFFF">
                            {proposal?.commands[0]?.threshold}
                          </Typography>
                        </Grid>
                      }
                    ></Chip>
                  </Grid>
                </>
              ) : null}
              {proposal?.commands[0]?.totalDeposits ? (
                <Grid item>
                  <Chip
                    className={classes.timeLeftChip}
                    label={
                      <Grid sx={{ display: "flex" }}>
                        {" "}
                        <Typography color="#C1D3FF" sx={{ marginRight: "5px" }}>
                          Raise Amount:
                        </Typography>
                        <Typography color="#FFFFFF">
                          {proposal?.commands[0]?.totalDeposits /
                            10 ** proposal?.commands[0]?.usdcTokenDecimal}{" "}
                          {proposal?.commands[0]?.usdcTokenSymbol}
                        </Typography>
                      </Grid>
                    }
                  ></Chip>
                </Grid>
              ) : null}
            </Grid>
          </Grid>
        </Grid>
      </Card>
    </CardActionArea>
  );
};

export default ProposalCard;
