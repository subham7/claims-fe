import { Card, CardActionArea, Chip, Grid } from "@mui/material";
import { Typography } from "@components/ui";
import {
  calculateDays,
  convertFromWeiGovernance,
  convertToWeiGovernance,
} from "../../src/utils/globalFunctions";
import SvgTickerIcon from "../../public/assets/icons/ticker_icon.js";
import SvgActionIcon from "../../public/assets/icons/action_icon.js";
import SvgSurveyIcon from "../../public/assets/icons/survey_icon.js";
import React, { useCallback, useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { ProposalCardStyles } from "../../src/components/proposalComps/ProposalCardStyles";
import useSmartContractMethods from "../../src/hooks/useSmartContractMethods";

const ProposalCard = ({ proposal, daoAddress }) => {
  const classes = ProposalCardStyles();

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
    <CardActionArea>
      <Card className={classes.mainCard}>
        <div className={classes.proposalHeader}>
          <div>
            <Typography variant="body" className="text-blue">
              Proposed by{" "}
              {proposal?.createdBy.substring(0, 6) +
                ".........." +
                proposal?.createdBy.substring(
                  proposal?.createdBy.length - 4,
                )}{" "}
              on {new Date(String(proposal?.updateDate)).toLocaleDateString()}
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
          </div>
        </div>
        <div className="b-mar-1">
          <Typography variant="subheading">{proposal?.name}</Typography>
        </div>
        <div>
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
                    <div className="f-d f-v-c tb-pad-1">
                      <Typography variant="info" className="text-blue">
                        Asset:
                      </Typography>
                      <Typography variant="info">
                        ${tokenDetails.symbol}
                      </Typography>
                    </div>
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
                    <div className="f-d f-v-c tb-pad-1">
                      <Typography variant="info" className="text-blue">
                        Nft:
                      </Typography>
                      <Typography variant="info">
                        {proposal?.commands[0]?.customNft?.substring(0, 6) +
                          ".........." +
                          proposal?.commands[0]?.customNft?.substring(
                            proposal?.commands[0]?.customNft?.length - 4,
                          )}
                      </Typography>
                    </div>
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
                      <div className="f-d f-v-c tb-pad-1">
                        <Typography variant="info" className="text-blue">
                          Owner Address:
                        </Typography>
                        <Typography variant="info">
                          {proposal?.commands[0]?.ownerAddress.slice(0, 6) +
                            "...." +
                            proposal?.commands[0]?.ownerAddress.slice(
                              proposal?.commands[0]?.ownerAddress.length - 4,
                            )}
                        </Typography>
                      </div>
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
                    <div className="f-d f-v-c tb-pad-1">
                      <Typography variant="info">
                        Enable whitelisting
                      </Typography>
                    </div>
                  }></Chip>
              </Grid>
            ) : null}

            {proposal?.commands[0]?.executionId === 11 ||
            proposal?.commands[0]?.executionId === 12 ? (
              <Grid item sx={{ display: "flex" }}>
                <Chip
                  className={classes.timeLeftChip}
                  label={
                    <div className="f-d f-v-c tb-pad-1 f-gap-4">
                      <Typography variant="info">
                        {proposal?.commands[0]?.executionId === 11
                          ? "Lens profile id:"
                          : "Lens post link:"}
                      </Typography>
                      <Typography variant="info">
                        {proposal?.commands[0]?.executionId === 11
                          ? proposal?.commands[0]?.lensId
                          : proposal?.commands[0]?.lensPostLink}
                      </Typography>
                    </div>
                  }></Chip>
              </Grid>
            ) : null}

            {proposal?.commands[0]?.executionId === 13 ? (
              <Grid item>
                <Chip
                  className={classes.timeLeftChip}
                  label={
                    <div className="f-d f-v-c tb-pad-1">
                      {" "}
                      <Typography variant="info" className="text-blue r-pad-1">
                        Price per token:
                      </Typography>
                      <Typography variant="info">
                        {proposal.commands[0]?.pricePerToken} USDC
                      </Typography>
                    </div>
                  }></Chip>
              </Grid>
            ) : null}

            {proposal?.commands[0]?.airDropAmount ? (
              <Grid item>
                <Chip
                  size="medium"
                  className={classes.timeLeftChip}
                  label={
                    proposal?.commands[0].airDropAmount ? (
                      <div className="f-d f-v-c tb-pad-1">
                        <Typography
                          variant="info"
                          className="text-blue r-pad-1">
                          Amount:
                        </Typography>
                        <Typography variant="info">
                          {convertFromWeiGovernance(
                            proposal?.commands[0].airDropAmount,
                            tokenDetails.decimals,
                          )}
                        </Typography>
                      </div>
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
                      <div className="f-d f-v-c tb-pad-1">
                        <Typography
                          variant="info"
                          className="text-blue r-pad-1">
                          Amount:
                        </Typography>
                        <Typography variant="info">
                          {tokenType === "erc20"
                            ? Number(
                                convertFromWeiGovernance(
                                  proposal?.commands[0].mintGTAmounts[0],
                                  tokenDetails.decimals,
                                ),
                              )
                            : proposal?.commands[0].mintGTAmounts[0]}
                        </Typography>
                      </div>
                    ) : null
                  }></Chip>
              </Grid>
            ) : null}

            {proposal?.commands[0]?.customTokenAmounts ? (
              <Grid item>
                <Chip
                  className={classes.timeLeftChip}
                  label={
                    <div className="f-d f-v-c tb-pad-1">
                      {" "}
                      <Typography variant="info" className="text-blue r-pad-1">
                        Amount:
                      </Typography>
                      <Typography variant="info">
                        {proposal.commands[0].customTokenAmounts[0] /
                          10 ** tokenDetails.decimals}
                      </Typography>
                    </div>
                  }></Chip>
              </Grid>
            ) : null}

            {proposal?.commands[0]?.customTokenAddresses ? (
              <Grid item>
                <Chip
                  className={classes.timeLeftChip}
                  label={
                    <div className="f-d f-v-c tb-pad-1">
                      <Typography variant="info" className="text-blue r-pad-1">
                        Recipient:
                      </Typography>
                      <Typography variant="info">
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
                    </div>
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
                      <div className="f-d f-v-c tb-pad-1">
                        {" "}
                        <Typography
                          variant="info"
                          className="text-blue r-pad-1">
                          Quorum:
                        </Typography>
                        <Typography variant="info">
                          {proposal?.commands[0]?.quorum}
                        </Typography>
                      </div>
                    }></Chip>
                </Grid>
                <Grid item>
                  <Chip
                    className={classes.timeLeftChip}
                    label={
                      <div className="f-d f-v-c tb-pad-1">
                        <Typography
                          variant="info"
                          className="text-blue r-pad-1">
                          Threshold:
                        </Typography>
                        <Typography variant="info">
                          {proposal?.commands[0]?.threshold}
                        </Typography>
                      </div>
                    }></Chip>
                </Grid>
              </>
            ) : null}

            {proposal?.commands[0]?.totalDeposits ? (
              <Grid item>
                <Chip
                  className={classes.timeLeftChip}
                  label={
                    <div className="f-d f-v-c tb-pad-1">
                      {" "}
                      <Typography variant="info" className="text-blue r-pad-1">
                        Raise Amount:
                      </Typography>
                      <Typography variant="info">
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
                    </div>
                  }></Chip>
              </Grid>
            ) : null}
          </Grid>
        </div>
      </Card>
    </CardActionArea>
  );
};

export default ProposalCard;
