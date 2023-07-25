import { Card, CardActionArea, Chip, Grid, Typography } from "@mui/material";
import {
  calculateDays,
  convertFromWeiGovernance,
  convertToWeiGovernance,
} from "../../../../src/utils/globalFunctions";
import actionIcon from "../../../../public/assets/icons/action_icon.svg";
import tickerIcon from "../../../../public/assets/icons/ticker_icon.svg";
import surveyIcon from "../../../../public/assets/icons/survey_icon.svg";
import React, { useCallback, useEffect, useState } from "react";
import Image from "next/image";
import { useSelector } from "react-redux";
import { useConnectWallet } from "@web3-onboard/react";
import { useRouter } from "next/router";
import { ProposalCardStyles } from "../../../../src/components/proposalComps/ProposalCardStyles";
import useSmartContractMethods from "../../../../src/hooks/useSmartContractMethods";

const ProposalCard = ({
  proposal,
  indexKey,

  executionTransaction,
}) => {
  const classes = ProposalCardStyles();
  const router = useRouter();
  const { clubId: daoAddress } = router.query;
  const [{ wallet }] = useConnectWallet();

  const tokenType = useSelector((state) => {
    return state.club.clubData.tokenType;
  });

  const [tokenDetails, setTokenDetails] = useState({
    decimals: 0,
    symbol: "",
  });

  const factoryData = useSelector((state) => {
    return state.club.factoryData;
  });

  const { getDecimals, getTokenSymbol } = useSmartContractMethods();

  const fetchAirDropContractDetails = useCallback(async () => {
    try {
      if (proposal) {
        if (tokenType === "erc20" || proposal?.commands[0].executionId !== 1) {
          const decimal = await getDecimals(
            proposal?.commands[0].executionId === 0
              ? proposal?.commands[0]?.airDropToken
              : proposal?.commands[0].executionId === 1
              ? daoAddress
              : proposal?.commands[0].executionId === 4
              ? proposal?.commands[0]?.customToken
              : "",
          );
          const symbol = await getTokenSymbol(
            proposal?.commands[0].executionId === 0
              ? proposal?.commands[0]?.airDropToken
              : proposal?.commands[0].executionId === 1
              ? daoAddress
              : proposal?.commands[0].executionId === 4
              ? proposal?.commands[0]?.customToken
              : "",
          );

          setTokenDetails({
            decimals: decimal,
            symbol: symbol,
          });
        } else if (
          tokenType === "erc721" &&
          proposal?.commands[0].executionId === 1
        ) {
          const symbol = await getTokenSymbol(
            proposal?.commands[0].executionId === 0
              ? proposal?.commands[0]?.airDropToken
              : proposal?.commands[0].executionId === 1
              ? daoAddress
              : proposal?.commands[0].executionId === 4
              ? proposal?.commands[0]?.customToken
              : "",
          );
          setTokenDetails({
            decimals: 18,
            symbol: symbol,
          });
        }
      }
    } catch (error) {
      console.log(error);
    }
  }, [proposal, tokenType, daoAddress]);

  useEffect(() => {
    fetchAirDropContractDetails();
  }, [fetchAirDropContractDetails]);

  return (
    <CardActionArea sx={{ borderRadius: "10px" }}>
      <Card className={classes.mainCard}>
        <Grid container>
          <Grid item ml={2} mr={2}>
            <Typography className={classes.cardFont}>
              Proposed by{" "}
              {proposal?.createdBy.substring(0, 6) +
                ".........." +
                proposal?.createdBy.substring(
                  proposal?.createdBy.length - 4,
                )}{" "}
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
            }}>
            <Grid
              container
              spacing={1}
              sx={{
                display: "flex",
                justifyContent: "flex-end",
              }}>
              <Grid item>
                <Chip
                  className={classes.timeLeftChip}
                  label={
                    <Grid container className={classes.flexContainer}>
                      <Image src={tickerIcon} alt="ticker-icon" />
                      <Typography ml={1}>
                        {" "}
                        {calculateDays(proposal?.votingDuration) <= 0
                          ? "Voting closed"
                          : calculateDays(proposal?.votingDuration) +
                            " days left"}
                      </Typography>
                    </Grid>
                  }
                />
              </Grid>
              <Grid item>
                <Chip
                  className={
                    proposal?.type === "action"
                      ? classes.actionChip
                      : classes.surveyChip
                  }
                  label={
                    <Grid container className={classes.flexContainer}>
                      {proposal?.type === "action" ? (
                        <Image src={actionIcon} alt="action-icon" />
                      ) : (
                        <Image src={surveyIcon} alt="survey-icon" />
                      )}
                      <Typography ml={1}>{proposal?.type}</Typography>
                    </Grid>
                  }
                />
              </Grid>
              <Grid item>
                {" "}
                <Chip
                  className={
                    proposal?.status === "active"
                      ? classes.cardFontActive
                      : proposal?.status === "passed"
                      ? classes.cardFontPassed
                      : proposal?.status === "executed"
                      ? classes.cardFontExecuted
                      : proposal?.status === "failed"
                      ? classes.cardFontFailed
                      : classes.cardFontFailed
                  }
                  label={
                    proposal?.status.charAt(0).toUpperCase() +
                    proposal?.status.slice(1)
                  }
                />
              </Grid>
            </Grid>
          </Grid>
        </Grid>
        <Grid container>
          <Grid item ml={2} mr={2}>
            <Typography className={classes.cardFont1}>
              {proposal?.name}
            </Typography>
          </Grid>
        </Grid>
        <Grid container>
          <Grid item ml={2} mr={2}>
            <Typography className={classes.cardFont}>
              {/* {proposal?.description.substring(0, 200)}... */}
            </Typography>
          </Grid>
        </Grid>
        <Grid container>
          <Grid item ml={2} mr={2} mt={2}>
            <Grid container spacing={1}>
              {(proposal?.commands[0]?.usdcTokenSymbol &&
                !proposal?.commands[0]?.quorum &&
                !proposal?.commands[0]?.totalDeposits &&
                !proposal?.commands[0].customNft &&
                !proposal?.commands[0]?.executionId === 6) ||
              !proposal?.commands[0]?.executionId === 7 ? (
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
                          ${tokenDetails.symbol}
                        </Typography>
                      </Grid>
                    }></Chip>
                </Grid>
              ) : (
                <></>
              )}

              {proposal?.commands[0]?.executionId === 5 ? (
                <Grid item sx={{ display: "flex" }}>
                  <Chip
                    className={classes.timeLeftChip}
                    label={
                      <Grid sx={{ display: "flex" }}>
                        {" "}
                        <Typography color="#C1D3FF" sx={{ marginRight: "5px" }}>
                          Nft:
                        </Typography>
                        <Typography color="#FFFFFF">
                          {proposal?.commands[0]?.customNft?.substring(0, 6) +
                            ".........." +
                            proposal?.commands[0]?.customNft?.substring(
                              proposal?.commands[0]?.customNft?.length - 4,
                            )}
                        </Typography>
                      </Grid>
                    }></Chip>
                </Grid>
              ) : (
                <></>
              )}

              {proposal?.commands[0]?.executionId === 6 ||
              proposal?.commands[0]?.executionId === 7 ? (
                <>
                  <Grid item sx={{ display: "flex" }}>
                    <Chip
                      className={classes.timeLeftChip}
                      label={
                        <Grid sx={{ display: "flex" }}>
                          {" "}
                          <Typography
                            color="#C1D3FF"
                            sx={{ marginRight: "5px" }}>
                            Owner Address:
                          </Typography>
                          <Typography color="#FFFFFF">
                            {proposal?.commands[0]?.ownerAddress.slice(0, 6) +
                              "...." +
                              proposal?.commands[0]?.ownerAddress.slice(
                                proposal?.commands[0]?.ownerAddress.length - 4,
                              )}
                          </Typography>
                        </Grid>
                      }></Chip>
                  </Grid>
                </>
              ) : (
                <></>
              )}

              {proposal?.commands[0]?.executionId === 10 ? (
                <Grid item sx={{ display: "flex" }}>
                  <Chip
                    className={classes.timeLeftChip}
                    label={
                      <Grid sx={{ display: "flex" }}>
                        {" "}
                        <Typography color="#C1D3FF" sx={{ marginRight: "5px" }}>
                          Allow whitelisting:
                        </Typography>
                        <Typography color="#FFFFFF">
                          {proposal?.commands[0]?.allowWhitelisting
                            ? "Yes"
                            : "No"}
                        </Typography>
                      </Grid>
                    }></Chip>
                </Grid>
              ) : null}

              {proposal?.commands[0]?.airDropAmount ? (
                <Grid item>
                  <Chip
                    className={classes.timeLeftChip}
                    label={
                      proposal?.commands[0].airDropAmount ? (
                        <Grid sx={{ display: "flex" }}>
                          {" "}
                          <Typography
                            color="#C1D3FF"
                            sx={{ marginRight: "5px" }}>
                            Amount:
                          </Typography>
                          <Typography color="#FFFFFF">
                            {convertFromWeiGovernance(
                              proposal?.commands[0].airDropAmount,
                              tokenDetails.decimals,
                            )}
                          </Typography>
                        </Grid>
                      ) : null
                    }></Chip>
                </Grid>
              ) : null}

              {proposal?.commands[0]?.executionId === 1 ? (
                <Grid item>
                  <Chip
                    className={classes.timeLeftChip}
                    label={
                      proposal.commands[0].mintGTAmounts[0] ? (
                        <Grid sx={{ display: "flex" }}>
                          {" "}
                          <Typography
                            color="#C1D3FF"
                            sx={{ marginRight: "5px" }}>
                            Amount:
                          </Typography>
                          <Typography color="#FFFFFF">
                            {tokenType === "erc20"
                              ? Number(
                                  convertFromWeiGovernance(
                                    proposal?.commands[0].mintGTAmounts[0],
                                    tokenDetails.decimals,
                                  ),
                                )
                              : proposal?.commands[0].mintGTAmounts[0]}
                          </Typography>
                        </Grid>
                      ) : null
                    }></Chip>
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
                            10 ** tokenDetails.decimals}
                        </Typography>
                      </Grid>
                    }></Chip>
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
                    }></Chip>
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
                            sx={{ marginRight: "5px" }}>
                            Quorum:
                          </Typography>
                          <Typography color="#FFFFFF">
                            {proposal?.commands[0]?.quorum}
                          </Typography>
                        </Grid>
                      }></Chip>
                  </Grid>
                  <Grid item>
                    <Chip
                      className={classes.timeLeftChip}
                      label={
                        <Grid sx={{ display: "flex" }}>
                          {" "}
                          <Typography
                            color="#C1D3FF"
                            sx={{ marginRight: "5px" }}>
                            Threshold:
                          </Typography>
                          <Typography color="#FFFFFF">
                            {proposal?.commands[0]?.threshold}
                          </Typography>
                        </Grid>
                      }></Chip>
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
                          {(convertToWeiGovernance(
                            convertToWeiGovernance(
                              proposal.commands[0].totalDeposits,
                              6,
                            ) / factoryData?.pricePerToken,
                            18,
                          ) /
                            10 ** 18) *
                            convertFromWeiGovernance(
                              factoryData?.pricePerToken,
                              6,
                            )}
                        </Typography>
                      </Grid>
                    }></Chip>
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
