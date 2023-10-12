import { Card, CardActionArea, Chip, Grid } from "@mui/material";
import { Typography } from "@components/ui";
import { calculateDays } from "utils/globalFunctions";
import SvgTickerIcon from "../../../public/assets/icons/ticker_icon.js";
import SvgActionIcon from "../../../public/assets/icons/action_icon.js";
import SvgSurveyIcon from "../../../public/assets/icons/survey_icon.js";
import React, { useCallback, useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { ProposalCardStyles } from "@components/proposalComps/ProposalCardStyles";
import useCommonContractMethods from "hooks/useCommonContractMehods.js";
import { proposalData } from "utils/proposalData.js";
import { shortAddress } from "utils/helper.js";

const ProposalCard = ({ proposal, daoAddress }) => {
  const classes = ProposalCardStyles();

  const tokenType = useSelector((state) => {
    return state.club.clubData.tokenType;
  });
  const factoryData = useSelector((state) => {
    return state.club.factoryData;
  });

  const [tokenDetails, setTokenDetails] = useState({
    decimals: 0,
    symbol: "",
  });
  const [proposalDetails, setProposalDetails] = useState({});

  const { getDecimals, getTokenSymbol } = useCommonContractMethods();

  const fetchTokenDetails = useCallback(async () => {
    try {
      if (proposal) {
        let decimal = 18;

        const {
          executionId,
          airDropToken,
          customToken,
          depositToken,
          withdrawToken,
          swapToken,
          stakeToken,
          unstakeToken,
        } = proposal?.commands[0];
        if (tokenType === "erc20" || executionId !== 1) {
          decimal = await getDecimals(
            executionId === 0
              ? airDropToken
              : executionId === 1
              ? daoAddress
              : executionId === 4
              ? customToken
              : executionId === 14
              ? depositToken
              : executionId === 15
              ? withdrawToken
              : executionId === 17
              ? stakeToken
              : executionId === 18
              ? unstakeToken
              : executionId === 19
              ? swapToken
              : "",
          );
        }

        const symbol = await getTokenSymbol(
          executionId === 0
            ? airDropToken
            : executionId === 1
            ? daoAddress
            : executionId === 4
            ? customToken
            : executionId === 14
            ? depositToken
            : executionId === 15
            ? withdrawToken
            : executionId === 17
            ? stakeToken
            : executionId === 18
            ? unstakeToken
            : executionId === 19
            ? swapToken
            : "",
        );

        setTokenDetails({
          decimals: decimal,
          symbol: symbol,
        });
      }
    } catch (error) {
      console.log(error);
    }
  }, [proposal, tokenType, daoAddress]);

  useEffect(() => {
    fetchTokenDetails();
  }, [fetchTokenDetails]);

  const getProposalData = () => {
    const response = proposalData({
      data: proposal.commands[0],
      decimals: tokenDetails.decimals,
      symbol: tokenDetails.symbol,
      factoryData,
    });
    setProposalDetails(response);
  };

  useEffect(() => {
    getProposalData();
  }, [proposal, tokenDetails.decimals, tokenDetails.symbol]);

  const statusClassMap = {
    active: classes.cardFontActive,
    passed: classes.cardFontPassed,
    executed: classes.cardFontExecuted,
    failed: classes.cardFontFailed,
  };
  return (
    <CardActionArea>
      <Card className={classes.mainCard}>
        <div className={classes.proposalHeader}>
          <div>
            <Typography variant="body" className="text-blue">
              Proposed by {shortAddress(proposal?.createdBy)} on{" "}
              {new Date(String(proposal?.updateDate)).toLocaleDateString()}
            </Typography>
          </div>
          <div>
            <Grid
              container
              gap={1}
              sx={{
                display: "flex",
                justifyContent: "flex-end",
              }}>
              <Chip
                className={classes.timeLeftChip}
                icon={<SvgTickerIcon />}
                label={
                  calculateDays(proposal?.votingDuration) <= 0
                    ? "Voting closed"
                    : calculateDays(proposal?.votingDuration) + " days left"
                }
              />
              <Chip
                className={
                  proposal?.type === "action"
                    ? classes.actionChip
                    : classes.surveyChip
                }
                icon={
                  proposal?.type === "action" ? (
                    <SvgActionIcon />
                  ) : (
                    <SvgSurveyIcon />
                  )
                }
                label={proposal?.type}
              />
              <Chip
                className={statusClassMap[proposal.status]}
                label={
                  proposal?.status.charAt(0).toUpperCase() +
                  proposal?.status.slice(1)
                }
              />
            </Grid>
          </div>
        </div>
        <div className="b-mar-1">
          <Typography variant="subheading">{proposal?.name}</Typography>
        </div>
        <Grid container spacing={1}>
          {proposalDetails &&
            Object.keys(proposalDetails).map((key, index) => (
              <Grid item key={index}>
                <Chip
                  className={classes.timeLeftChip}
                  label={
                    <div className="f-d f-v-c tb-pad-1">
                      <Typography variant="info" className="text-blue r-pad-1">
                        {key}
                      </Typography>
                      <Typography variant="info">
                        {proposalDetails[key]}
                      </Typography>
                    </div>
                  }></Chip>
              </Grid>
            ))}
        </Grid>
      </Card>
    </CardActionArea>
  );
};

export default ProposalCard;
