import { Card, Divider, Grid, Typography } from "@mui/material";
import { makeStyles } from "@mui/styles";
import React, { useCallback, useEffect, useState } from "react";
import { useSelector } from "react-redux";
import {
  convertFromWeiGovernance,
  convertToWeiGovernance,
} from "../../utils/globalFunctions";
import { extractNftAdressAndId } from "utils/helper";
import useCommonContractMethods from "hooks/useCommonContractMehods";

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
  } = proposalData?.commands[0];

  const fetchAirDropContractDetails = useCallback(async () => {
    try {
      if (airDropToken || customToken || depositToken || withdrawToken) {
        const decimal = await getDecimals(
          airDropToken
            ? airDropToken
            : customToken
            ? customToken
            : depositToken
            ? depositToken
            : withdrawToken,
        );
        const symbol = await getTokenSymbol(
          airDropToken
            ? airDropToken
            : customToken
            ? customToken
            : depositToken
            ? depositToken
            : withdrawToken,
        );

        const amount = convertFromWeiGovernance(
          depositAmount ? depositAmount : withdrawAmount,
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
  }, [
    airDropToken,
    customToken,
    depositAmount,
    depositToken,

    withdrawAmount,
    withdrawToken,
  ]);

  useEffect(() => {
    fetchAirDropContractDetails();
  }, [fetchAirDropContractDetails]);

  return (
    <Grid item md={9}>
      {proposalData?.commands.length ? (
        <Card>
          <>
            {executionId == 0 ? (
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
                              airDropAmount,
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
                        {fetched ? airDropCarryFee : null}%
                      </Typography>
                    </Grid>
                  </Grid>
                </Grid>
              </>
            ) : executionId == 1 ? (
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
                          ? mintGTAmounts[0]
                          : mintGTAmounts[0] /
                            Math.pow(10, parseInt(usdcGovernanceTokenDecimal))
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
                        ? mintGTAddresses[0].slice(0, 6) +
                          "...." +
                          mintGTAddresses[0].slice(
                            mintGTAddresses[0].length - 4,
                          )
                        : null}
                    </Typography>
                  </Grid>
                </Grid>
              </>
            ) : executionId == 2 ? (
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
                        {fetched ? quorum : null}%
                      </Typography>
                    </Grid>
                    <Grid item xs={12} md={4}>
                      <Typography className={classes.listFont2}>
                        Threshold
                      </Typography>
                      <Typography className={classes.listFont2Colourless}>
                        {fetched ? threshold : null}%
                      </Typography>
                    </Grid>
                  </Grid>
                </Grid>
              </>
            ) : executionId == 3 ? (
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
                              convertToWeiGovernance(totalDeposits, 6) /
                                daoDetails?.pricePerToken,
                              18,
                            ) /
                              10 ** 18) *
                            convertFromWeiGovernance(
                              daoDetails?.pricePerToken,
                              6,
                            )
                          : null}{" "}
                        {usdcTokenSymbol}
                      </Typography>
                    </Grid>
                  </Grid>
                </Grid>
              </>
            ) : executionId == 4 ? (
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
                          ? customTokenAmounts[0] /
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
                          ? customTokenAddresses[0].slice(0, 6) +
                            "...." +
                            customTokenAddresses[0].slice(
                              customTokenAddresses[0].length - 4,
                            )
                          : null}
                      </Typography>
                    </Grid>
                  </Grid>
                </Grid>
              </>
            ) : executionId == 5 ? (
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
                          ? customNft.slice(0, 6) +
                            "...." +
                            customNft.slice(customNft.length - 4)
                          : null}
                      </Typography>
                    </Grid>
                    <Grid item xs={12} md={4}>
                      <Typography className={classes.listFont2}>
                        Nft Token Id
                      </Typography>
                      <Typography className={classes.listFont2Colourless}>
                        {fetched ? customNftToken : null}
                      </Typography>
                    </Grid>
                    <Grid item xs={12} md={4}>
                      <Typography className={classes.listFont2}>
                        Recipient
                      </Typography>
                      <Typography className={classes.listFont2Colourless}>
                        {fetched
                          ? customTokenAddresses[0].slice(0, 6) +
                            "...." +
                            customTokenAddresses[0].slice(
                              customTokenAddresses[0].length - 4,
                            )
                          : null}
                      </Typography>
                    </Grid>
                  </Grid>
                </Grid>
              </>
            ) : executionId == 6 || executionId == 7 ? (
              <>
                <Grid container item mb={1}>
                  <Typography className={classes.listFont2Colourless}>
                    {executionId == 6 ? "Add Signer" : "Remove Signer"}
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
                          ? ownerAddress.slice(0, 6) +
                            "...." +
                            ownerAddress.slice(ownerAddress.length - 4)
                          : null}
                      </Typography>
                    </Grid>
                  </Grid>
                </Grid>
              </>
            ) : executionId == 10 || executionId == 11 || executionId == 12 ? (
              <>
                <Grid container item mb={1}>
                  <Typography className={classes.listFont2Colourless}>
                    Enable whitelist for deposit
                  </Typography>
                </Grid>
                <Divider />
                <Grid container mt={1} maxHeight={"300px"} overflow="auto">
                  <Grid container spacing={3}>
                    <Grid item xs={12} md={4}>
                      <Typography mb={1} className={classes.listFont2}>
                        Whitelisted addresses
                      </Typography>

                      {whitelistAddresses.map((address, index) => (
                        <Typography key={index} mb={0.5}>
                          {address}
                        </Typography>
                      ))}
                    </Grid>
                  </Grid>
                </Grid>
              </>
            ) : executionId == 8 || executionId == 9 ? (
              <>
                <Grid container item mb={1}>
                  <Typography className={classes.listFont2Colourless}>
                    {executionId == 8
                      ? "Buy NFT from Opensea"
                      : "Sell NFT from Opensea"}
                  </Typography>
                </Grid>
                <Divider />
                <Grid container mt={1}>
                  <Grid container spacing={3}>
                    <Grid item xs={12} md={4}>
                      <Typography className={classes.listFont2}>
                        NFT Address
                      </Typography>
                      <Typography className={classes.listFont2Colourless}>
                        {extractNftAdressAndId(nftLink).nftAddress.slice(0, 6)}
                        ....
                        {extractNftAdressAndId(nftLink).nftAddress.slice(-6)}
                      </Typography>
                    </Grid>
                    <Grid item xs={12} md={4}>
                      <Typography className={classes.listFont2}>
                        Token Id
                      </Typography>
                      <Typography className={classes.listFont2Colourless}>
                        {extractNftAdressAndId(nftLink).tokenId}
                      </Typography>
                    </Grid>
                  </Grid>
                </Grid>
              </>
            ) : executionId === 13 ? (
              <>
                <Grid container item mb={1}>
                  <Typography className={classes.listFont2Colourless}>
                    Update price per token
                  </Typography>
                </Grid>
                <Divider />
                <Grid container mt={1}>
                  <Grid container spacing={3}>
                    <Grid item xs={12} md={4}>
                      <Typography className={classes.listFont2}>
                        Price per token
                      </Typography>
                      <Typography className={classes.listFont2Colourless}>
                        {fetched ? pricePerToken : ""} {usdcTokenSymbol}
                      </Typography>
                    </Grid>
                  </Grid>
                </Grid>
              </>
            ) : executionId === 14 || executionId === 15 ? (
              <>
                <Grid container item mb={1}>
                  <Typography className={classes.listFont2Colourless}>
                    {executionId === 14
                      ? "Deposit tokens in AAVE pool"
                      : "Withdraw tokens from AAVE pool"}
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
                        {fetched ? tokenDetails.symbol : null}
                      </Typography>
                    </Grid>
                    <Grid item xs={12} md={4}>
                      <Typography className={classes.listFont2}>
                        Amount
                      </Typography>
                      <Typography className={classes.listFont2Colourless}>
                        {fetched ? tokenDetails.amount : null}
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
