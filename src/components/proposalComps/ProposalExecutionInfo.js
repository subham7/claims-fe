import { Card, Divider, Grid, Typography } from "@mui/material";
import { makeStyles } from "@mui/styles";
import React, { useCallback, useEffect, useState } from "react";
import { useSelector } from "react-redux";
import {
  convertFromWeiGovernance,
  convertToWeiGovernance,
} from "../../utils/globalFunctions";
import useSmartContractMethods from "../../hooks/useSmartContractMethods";

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
});

const ProposalExecutionInfo = ({ proposalData, fetched, daoDetails }) => {
  const classes = useStyles();

  const { getDecimals, getTokenSymbol } = useSmartContractMethods();

  const tokenType = useSelector((state) => {
    return state.club.clubData.tokenType;
  });

  const [tokenDetails, setTokenDetails] = useState({
    decimals: 0,
    symbol: "",
  });

  const fetchAirDropContractDetails = useCallback(async () => {
    try {
      if (proposalData) {
        const decimal = await getDecimals(
          proposalData?.commands[0]?.airDropToken
            ? proposalData?.commands[0]?.airDropToken
            : proposalData?.commands[0]?.customToken,
        );
        const symbol = await getTokenSymbol(
          proposalData?.commands[0]?.airDropToken
            ? proposalData?.commands[0]?.airDropToken
            : proposalData?.commands[0]?.customToken,
        );

        setTokenDetails({
          decimals: decimal,
          symbol: symbol,
        });
      }
    } catch (error) {
      console.log(error);
    }
  }, [proposalData]);

  useEffect(() => {
    fetchAirDropContractDetails();
  }, [fetchAirDropContractDetails]);

  return (
    <Grid item md={9}>
      {proposalData?.commands.length ? (
        <Card>
          <>
            {proposalData?.commands[0].executionId == 0 ? (
              <>
                <Grid container item mb={1}>
                  <Typography className={classes.listFont2Colourless}>
                    Distribute tokens to a wallet
                  </Typography>
                </Grid>
                <Divider />
                <Grid container mt={1}>
                  <Grid container spacing={3}>
                    <Grid item xs={12} md={4}>
                      <Typography className={classes.listFont2}>
                        Token
                      </Typography>
                      <Typography className={classes.listFont2Colourless}>
                        {tokenDetails.symbol}
                      </Typography>
                    </Grid>
                    <Grid item xs={12} md={4}>
                      <Typography className={classes.listFont2}>
                        Amount
                      </Typography>
                      <Typography className={classes.listFont2Colourless}>
                        {fetched
                          ? convertFromWeiGovernance(
                              proposalData?.commands[0].airDropAmount,
                              tokenDetails.decimals,
                            )
                          : null}
                      </Typography>
                    </Grid>
                    <Grid item xs={12} md={4}>
                      <Typography className={classes.listFont2}>
                        Carry fee
                      </Typography>
                      <Typography className={classes.listFont2Colourless}>
                        {fetched
                          ? proposalData?.commands[0].airDropCarryFee
                          : null}
                        %
                      </Typography>
                    </Grid>
                  </Grid>
                </Grid>
              </>
            ) : proposalData?.commands[0].executionId == 1 ? (
              <>
                <Grid container item>
                  <Typography className={classes.listFont2Colourless}>
                    Mint governance tokens to a wallet
                  </Typography>
                </Grid>
                <Grid container>
                  <Grid item>
                    <Typography className={classes.listFont2}>
                      Amount
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
                        ? tokenType === "erc721"
                          ? proposalData?.commands[0].mintGTAmounts[0]
                          : proposalData?.commands[0].mintGTAmounts[0] /
                            Math.pow(
                              10,
                              parseInt(
                                proposalData?.commands[0]
                                  .usdcGovernanceTokenDecimal,
                              ),
                            )
                        : null}
                    </Typography>
                  </Grid>
                </Grid>
                <Grid container>
                  <Grid item>
                    <Typography className={classes.listFont2}>
                      Recipient
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
                        ? proposalData?.commands[0].mintGTAddresses[0].slice(
                            0,
                            6,
                          ) +
                          "...." +
                          proposalData?.commands[0].mintGTAddresses[0].slice(
                            proposalData?.commands[0].mintGTAddresses[0]
                              .length - 4,
                          )
                        : null}
                    </Typography>
                  </Grid>
                </Grid>
              </>
            ) : proposalData?.commands[0].executionId == 2 ? (
              <>
                <Grid container item mb={1}>
                  <Typography className={classes.listFont2Colourless}>
                    Update governance settings of the club
                  </Typography>
                </Grid>
                <Divider />
                <Grid container mt={1}>
                  <Grid container spacing={3}>
                    <Grid item xs={12} md={4}>
                      <Typography className={classes.listFont2}>
                        Quorum
                      </Typography>
                      <Typography className={classes.listFont2Colourless}>
                        {fetched ? proposalData?.commands[0].quorum : null}%
                      </Typography>
                    </Grid>
                    <Grid item xs={12} md={4}>
                      <Typography className={classes.listFont2}>
                        Threshold
                      </Typography>
                      <Typography className={classes.listFont2Colourless}>
                        {fetched ? proposalData?.commands[0].threshold : null}%
                      </Typography>
                    </Grid>
                  </Grid>
                </Grid>
              </>
            ) : proposalData?.commands[0].executionId == 3 ? (
              <>
                <Grid container item mb={1}>
                  <Typography className={classes.listFont2Colourless}>
                    Update total raise amount
                  </Typography>
                </Grid>
                <Divider />
                <Grid container mt={1}>
                  <Grid container spacing={3}>
                    <Grid item xs={12} md={4}>
                      <Typography className={classes.listFont2}>
                        Total amount
                      </Typography>
                      <Typography className={classes.listFont2Colourless}>
                        {fetched
                          ? (convertToWeiGovernance(
                              convertToWeiGovernance(
                                proposalData.commands[0].totalDeposits,
                                6,
                              ) / daoDetails?.pricePerToken,
                              18,
                            ) /
                              10 ** 18) *
                            convertFromWeiGovernance(
                              daoDetails?.pricePerToken,
                              6,
                            )
                          : null}{" "}
                        {proposalData?.commands[0].usdcTokenSymbol}
                      </Typography>
                    </Grid>
                  </Grid>
                </Grid>
              </>
            ) : proposalData?.commands[0].executionId == 4 ? (
              <>
                <Grid container item mb={1}>
                  <Typography className={classes.listFont2Colourless}>
                    Transfer token to a wallet
                  </Typography>
                </Grid>
                <Divider />
                <Grid container mt={1}>
                  <Grid container spacing={3}>
                    <Grid item xs={12} md={4}>
                      <Typography className={classes.listFont2}>
                        Amount
                      </Typography>
                      <Typography className={classes.listFont2Colourless}>
                        {fetched
                          ? proposalData?.commands[0].customTokenAmounts[0] /
                            Math.pow(10, parseInt(tokenDetails.decimals))
                          : null}{" "}
                        {tokenDetails.symbol}
                      </Typography>
                    </Grid>
                    <Grid item xs={12} md={4}>
                      <Typography className={classes.listFont2}>
                        Recipient
                      </Typography>
                      <Typography className={classes.listFont2Colourless}>
                        {fetched
                          ? proposalData.commands[0].customTokenAddresses[0].slice(
                              0,
                              6,
                            ) +
                            "...." +
                            proposalData.commands[0].customTokenAddresses[0].slice(
                              proposalData.commands[0].customTokenAddresses[0]
                                .length - 4,
                            )
                          : null}
                      </Typography>
                    </Grid>
                  </Grid>
                </Grid>
              </>
            ) : proposalData?.commands[0].executionId == 5 ? (
              <>
                <Grid container item mb={1}>
                  <Typography className={classes.listFont2Colourless}>
                    Send Nft to an address
                  </Typography>
                </Grid>
                <Divider />
                <Grid container mt={1}>
                  <Grid container spacing={3}>
                    <Grid item xs={12} md={4}>
                      <Typography className={classes.listFont2}>
                        Nft Address
                      </Typography>
                      <Typography className={classes.listFont2Colourless}>
                        {fetched
                          ? proposalData.commands[0].customNft.slice(0, 6) +
                            "...." +
                            proposalData.commands[0].customNft.slice(
                              proposalData.commands[0].customNft.length - 4,
                            )
                          : null}
                      </Typography>
                    </Grid>
                    <Grid item xs={12} md={4}>
                      <Typography className={classes.listFont2}>
                        Nft Token Id
                      </Typography>
                      <Typography className={classes.listFont2Colourless}>
                        {fetched
                          ? proposalData.commands[0].customNftToken
                          : null}
                      </Typography>
                    </Grid>
                    <Grid item xs={12} md={4}>
                      <Typography className={classes.listFont2}>
                        Recipient
                      </Typography>
                      <Typography className={classes.listFont2Colourless}>
                        {fetched
                          ? proposalData.commands[0].customTokenAddresses[0].slice(
                              0,
                              6,
                            ) +
                            "...." +
                            proposalData.commands[0].customTokenAddresses[0].slice(
                              proposalData.commands[0].customTokenAddresses[0]
                                .length - 4,
                            )
                          : null}
                      </Typography>
                    </Grid>
                  </Grid>
                </Grid>
              </>
            ) : proposalData?.commands[0].executionId == 6 ? (
              <>
                <Grid container item mb={1}>
                  <Typography className={classes.listFont2Colourless}>
                    Add/remove safe owners
                  </Typography>
                </Grid>
                <Divider />
                <Grid container mt={1}>
                  <Grid container spacing={3}>
                    <Grid item xs={12} md={4}>
                      <Typography className={classes.listFont2}>
                        Owner Address
                      </Typography>
                      <Typography className={classes.listFont2Colourless}>
                        {fetched
                          ? proposalData.commands[0].ownerAddress.slice(0, 6) +
                            "...." +
                            proposalData.commands[0].ownerAddress.slice(
                              proposalData.commands[0].ownerAddress.length - 4,
                            )
                          : null}
                      </Typography>
                    </Grid>
                    <Grid item xs={12} md={4}>
                      <Typography className={classes.listFont2}>
                        Owner Change Command
                      </Typography>
                      <Typography className={classes.listFont2Colourless}>
                        {fetched
                          ? proposalData.commands[0].ownerChangeAction
                          : null}
                      </Typography>
                    </Grid>
                  </Grid>
                </Grid>
              </>
            ) : null}
          </>
        </Card>
      ) : null}
    </Grid>
  );
};

export default ProposalExecutionInfo;
