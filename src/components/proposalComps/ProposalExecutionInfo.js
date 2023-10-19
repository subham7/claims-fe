import { Card, Divider, Grid, Typography } from "@mui/material";
import { makeStyles } from "@mui/styles";
import React, { useCallback, useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { convertFromWeiGovernance } from "../../utils/globalFunctions";
import useCommonContractMethods from "hooks/useCommonContractMehods";
import { proposalDetailsData } from "utils/proposalData";

const useStyles = makeStyles({
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

const ProposalExecutionInfo = ({ proposalData, fetched, daoDetails }) => {
  const classes = useStyles();

  const { getDecimals, getTokenSymbol } = useCommonContractMethods();

  const tokenType = useSelector((state) => {
    return state.club.clubData.tokenType;
  });

  const factoryData = useSelector((state) => {
    return state.club.factoryData;
  });

  const [proposalDetails, setProposalDetails] = useState({});

  const [tokenDetails, setTokenDetails] = useState({
    decimals: 0,
    symbol: "",
    amount: 0,
  });

  const {
    executionId,
    airDropToken,
    customToken,
    depositToken,
    withdrawToken,
    depositAmount,
    withdrawAmount,
    airDropAmount,
    quorum,
    threshold,
    totalDeposits,
    customTokenAmounts,
    customTokenAddresses,
    mintGTAddresses,
    customNft,
    ownerAddress,
    nftLink,
    pricePerToken,
    mintGTAmounts,
    usdcGovernanceTokenDecimal,
    customNftToken,
    usdcTokenSymbol,
    whitelistAddresses,
    airDropCarryFee,
    stakeToken,
    stakeAmount,
    unstakeToken,
    unstakeAmount,
    swapToken,
    swapAmount,
    destinationToken,
  } = proposalData?.commands[0];

  const fetchAirDropContractDetails = useCallback(async () => {
    try {
      if (
        airDropToken ||
        customToken ||
        depositToken ||
        withdrawToken ||
        stakeToken ||
        unstakeToken ||
        swapToken
      ) {
        const decimal = await getDecimals(
          airDropToken
            ? airDropToken
            : customToken
            ? customToken
            : depositToken
            ? depositToken
            : withdrawToken
            ? withdrawToken
            : stakeToken
            ? stakeToken
            : unstakeToken
            ? unstakeToken
            : swapToken,
        );
        const symbol = await getTokenSymbol(
          airDropToken
            ? airDropToken
            : customToken
            ? customToken
            : depositToken
            ? depositToken
            : withdrawToken
            ? withdrawToken
            : stakeToken
            ? stakeToken
            : unstakeToken
            ? unstakeToken
            : swapToken,
        );

        const amount = convertFromWeiGovernance(
          depositAmount
            ? depositAmount
            : withdrawAmount
            ? withdrawAmount
            : stakeAmount
            ? stakeAmount
            : unstakeAmount
            ? unstakeAmount
            : swapAmount,
          decimal,
        );
        setTokenDetails({
          decimals: decimal,
          symbol: symbol,
          amount,
        });
      }
    } catch (error) {
      console.log(error);
    }
  }, [proposalData, tokenType, daoDetails]);

  useEffect(() => {
    fetchAirDropContractDetails();
  }, [fetchAirDropContractDetails]);

  const getProposalDetailsData = () => {
    debugger;
    const response = proposalDetailsData({
      data: proposalData?.commands[0],
      decimals: tokenDetails.decimals,
      symbol: tokenDetails.symbol,
      factoryData,
    });
    setProposalDetails(response);
  };

  useEffect(() => {
    getProposalDetailsData();
  }, [proposalData, tokenDetails.decimals, tokenDetails.symbol]);

  return (
    <Grid item md={9}>
      {proposalData?.commands.length && executionId ? (
        <Card>
          <>
            {proposalDetails.data && (
              <>
                <Grid container item mb={1}>
                  <Typography className={classes.listFont2Colourless}>
                    {proposalDetails.title}
                  </Typography>
                </Grid>
                <Divider />
                <Grid container mt={1}>
                  <Grid container spacing={3}>
                    {Object.keys(proposalDetails?.data).map((key, index) => (
                      <Grid item xs={12} md={4} key={index}>
                        <Typography className={classes.listFont2}>
                          {key}
                        </Typography>
                        <Typography className={classes.listFont2Colourless}>
                          {proposalDetails.data[key]}
                        </Typography>
                      </Grid>
                    ))}
                  </Grid>
                </Grid>
              </>
            )}
          </>
        </Card>
      ) : null}
    </Grid>
  );
};

export default ProposalExecutionInfo;
