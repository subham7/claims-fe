import { Card, CardActionArea, Chip, Grid, Typography } from "@mui/material";
import { calculateDays } from "utils/globalFunctions";
import SvgTickerIcon from "../../../public/assets/icons/ticker_icon.js";
import SvgActionIcon from "../../../public/assets/icons/action_icon.js";
import SvgSurveyIcon from "../../../public/assets/icons/survey_icon.js";
import React, { useCallback, useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { ProposalCardStyles } from "@components/proposalComps/ProposalCardStyles";
import useCommonContractMethods from "hooks/useCommonContractMehods.js";
import { proposalData } from "utils/proposalData.js";
import { isNative, shortAddress } from "utils/helper.js";
import { useNetwork } from "wagmi";

const ProposalCard = ({ proposal, daoAddress, routeNetworkId }) => {
  const { chain } = useNetwork();
  const networkId = "0x" + chain?.id.toString(16);
  const classes = ProposalCardStyles();

  const tokenType = useSelector((state) => {
    return state.club.clubData.tokenType;
  });

  const clubData = useSelector((state) => {
    return state.club.clubData;
  });

  const [tokenDetails, setTokenDetails] = useState({
    decimals: 0,
    symbol: "",
  });
  const [proposalDetails, setProposalDetails] = useState({});

  const { getDecimals, getTokenSymbol } = useCommonContractMethods({
    routeNetworkId,
  });

  const fetchTokenDetails = useCallback(async () => {
    try {
      if (proposal) {
        let decimal = 18;
        let symbol = "";
        const depositTokenAddress = clubData.depositTokenAddress;
        const isNativeToken = isNative(clubData.depositTokenAddress, networkId);
        const {
          executionId,
          airDropToken,
          customToken,
          depositToken,
          withdrawToken,
          swapToken,
          stakeToken,
          unstakeToken,
          sendToken,
        } = proposal?.commands[0];
        if (tokenType === "erc20" || executionId !== 1) {
          decimal = await getDecimals(
            executionId === 0
              ? airDropToken
              : executionId === 1
              ? daoAddress
              : executionId === 4
              ? customToken
              : executionId === 14 || executionId === 24
              ? depositToken
              : executionId === 15 || executionId === 25
              ? withdrawToken
              : executionId === 17
              ? stakeToken
              : executionId === 18
              ? unstakeToken
              : executionId === 19
              ? swapToken
              : executionId === 21 || executionId === 22 || executionId === 23
              ? sendToken
              : "",
          );
        }

        symbol = await getTokenSymbol(
          executionId === 0
            ? airDropToken
            : executionId === 1
            ? daoAddress
            : executionId === 4
            ? customToken
            : executionId === 14 || executionId === 24
            ? depositToken
            : executionId === 15 || executionId === 25
            ? withdrawToken
            : executionId === 17
            ? stakeToken
            : executionId === 18
            ? unstakeToken
            : executionId === 19
            ? swapToken
            : executionId === 21 || executionId === 22 || executionId === 23
            ? sendToken
            : executionId === 13
            ? depositTokenAddress
            : "",
        );

        setTokenDetails({
          decimals: isNativeToken ? 18 : decimal,
          symbol: symbol ?? clubData?.depositTokenSymbol,
        });
      }
    } catch (error) {
      console.log(error);
    }
  }, [proposal, tokenType, daoAddress, clubData, networkId]);

  useEffect(() => {
    fetchTokenDetails();
  }, [fetchTokenDetails]);

  const getProposalData = () => {
    const response = proposalData({
      data: proposal.commands[0],
      decimals: tokenDetails.decimals,
      symbol: tokenDetails.symbol,
      factoryData: clubData,
      isNativeClub: isNative(clubData.depositTokenAddress, networkId),
    });
    setProposalDetails(response);
  };

  useEffect(() => {
    getProposalData();
  }, [
    proposal,
    tokenDetails.decimals,
    tokenDetails.symbol,
    clubData.depositTokenAddress,
    networkId,
  ]);

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
            <Typography fontSize={16} fontFamily={"avenir"} fontWeight={500}>
              Proposed by {shortAddress(proposal?.createdBy)} on{" "}
              {new Date(String(proposal?.updateDate)).toLocaleString()}
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
          <Typography
            fontSize={24}
            fontFamily={"avenir"}
            fontWeight={600}
            mt={-2}>
            {proposal?.name}
          </Typography>
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
