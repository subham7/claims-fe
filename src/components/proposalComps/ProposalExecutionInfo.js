import { Card, Divider, Grid, Typography } from "@mui/material";
import { makeStyles } from "@mui/styles";
import React, { useCallback, useEffect, useState } from "react";
import { SmartContract } from "../../api/contract";
import erc20ABI from "../../abis/usdcTokenContract.json";
import { useConnectWallet } from "@web3-onboard/react";
import Web3 from "web3";
import { useSelector } from "react-redux";
import { convertFromWeiGovernance } from "../../utils/globalFunctions";

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

const ProposalExecutionInfo = ({
  proposalData,
  fetched,
  USDC_CONTRACT_ADDRESS,
  daoDetails,
}) => {
  const classes = useStyles();
  const [{ wallet }] = useConnectWallet();

  const tokenType = useSelector((state) => {
    return state.club.clubData.tokenType;
  });

  const [tokenDetails, setTokenDetails] = useState({
    decimals: 0,
    symbol: "",
  });

  const GNOSIS_TRANSACTION_URL = useSelector((state) => {
    return state.gnosis.transactionUrl;
  });

  let walletAddress;
  if (typeof window !== "undefined") {
    walletAddress = Web3.utils.toChecksumAddress(wallet?.accounts[0].address);
  }

  const fetchAirDropContractDetails = useCallback(async () => {
    try {
      if (proposalData) {
        const airdropContract = new SmartContract(
          erc20ABI,
          proposalData?.commands[0]?.airDropToken
            ? proposalData?.commands[0]?.airDropToken
            : proposalData?.commands[0]?.customToken,
          walletAddress,
          USDC_CONTRACT_ADDRESS,
          GNOSIS_TRANSACTION_URL,
        );

        const decimal = await airdropContract.decimals();
        const symbol = await airdropContract.obtainSymbol();

        setTokenDetails({
          decimals: decimal,
          symbol: symbol,
        });
      }
    } catch (error) {
      console.log(error);
    }
  }, [
    GNOSIS_TRANSACTION_URL,
    USDC_CONTRACT_ADDRESS,
    proposalData,
    walletAddress,
  ]);

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
                    }}
                  >
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
                    }}
                  >
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
                          ? proposalData?.commands[0].totalDeposits *
                            +convertFromWeiGovernance(
                              daoDetails?.pricePerToken,
                              6,
                            )
                          : // Math.pow(
                            //   10,
                            //   parseInt(
                            //     proposalData?.commands[0].usdcTokenDecimal,
                            //   ),
                            // )
                            null}{" "}
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
            ) : null}
          </>
        </Card>
      ) : null}
    </Grid>
  );
};

export default ProposalExecutionInfo;
