import {
  Card,
  Divider,
  Grid,
  Paper,
  Skeleton,
  Stack,
  Typography,
} from "@mui/material";
import React, { useState } from "react";
import ProgressBar from "../progressbar";

import { SettingsInfoStlyes } from "./SettingsInfoStyles";
import {
  calculateTreasuryTargetShare,
  convertFromWeiGovernance,
} from "../../utils/globalFunctions";
import EditIcon from "@mui/icons-material/Edit";
import TelegramIcon from "@mui/icons-material/Telegram";
import TwitterIcon from "@mui/icons-material/Twitter";
import { RiDiscordFill } from "react-icons/ri";
import ReactHtmlParser from "react-html-parser";
import EditDetails from "./modals/EditDetails";
import { useNetwork } from "wagmi";
import { useSelector } from "react-redux";

const SettingsInfo = ({
  daoDetails,
  treasuryAmount,
  tokenType,
  erc20TokenDetails,
  members,
  remainingDays,
  walletAddress,
  remainingTimeInSecs,
  clubInfo,
  isAdminUser,
  daoAddress,
}) => {
  const classes = SettingsInfoStlyes();
  const [open, setOpen] = useState(false);

  const { chain } = useNetwork();
  const networkId = "0x" + chain?.id.toString(16);

  const clubData = useSelector((state) => {
    return state.club.clubData;
  });

  const handleClose = (event, reason) => {
    if (reason !== "backdropClick" && reason !== "escapeKeyDown") {
      setOpen(false);
    }
  };

  return (
    <>
      <Grid container spacing={3} paddingTop={2}>
        <Grid sx={{ width: "70%" }} item>
          <Card className={classes.cardRegular}>
            <Grid
              container
              spacing={2}
              sx={{ display: "flex", justifyContent: "space-between" }}>
              <Grid item ml={2} mt={4}>
                <Stack spacing={0}>
                  <Typography className={classes.heading}>
                    {daoDetails.daoName ? daoDetails.daoName : null}
                  </Typography>
                  <Typography className={classes.subHeading}>
                    {daoDetails.daoSymbol ? "$" + daoDetails.daoSymbol : null}
                  </Typography>
                </Stack>
              </Grid>

              <Grid item ml={2} mb={7}>
                {clubInfo?.twitter && (
                  <TwitterIcon
                    onClick={() => window.open(clubInfo?.twitter, "_blank")}
                    className={classes.icon}
                    size={20}
                  />
                )}
                {clubInfo?.discord && (
                  <RiDiscordFill
                    onClick={() => window.open(clubInfo?.discord, "_blank")}
                    className={classes.icon}
                    size={20}
                  />
                )}
                {clubInfo?.telegram && (
                  <TelegramIcon
                    onClick={() => window.open(clubInfo?.telegram, "_blank")}
                    className={classes.icon}
                    size={20}
                  />
                )}
                {isAdminUser && (
                  <EditIcon
                    onClick={() => setOpen(true)}
                    className={classes.icon}
                    size={20}
                  />
                )}
              </Grid>
            </Grid>

            <Grid item ml={2} mb={4}>
              <div
                style={{
                  maxHeight: "200px",
                  overflowY: "scroll",
                  marginTop: "20px",
                }}>
                <div
                  dangerouslySetInnerHTML={{
                    __html: ReactHtmlParser(clubInfo?.bio),
                  }}></div>
              </div>
            </Grid>

            <Divider variant="middle" />
            <Paper
              style={{
                background: "transparent",
                boxShadow: "none",
                paddingTop: "24px",
                paddingLeft: "12px",
              }}>
              <Grid container spacing={7}>
                <Grid item md={3}>
                  <Typography variant="p" className={classes.valuesDimStyle}>
                    Deposits deadline
                  </Typography>
                  {/* <Grid container> */}
                  <Grid item mt={1}>
                    <Typography variant="p" className={classes.valuesStyle}>
                      {daoDetails.depositDeadline ? (
                        new Date(parseInt(daoDetails.depositDeadline) * 1000)
                          ?.toJSON()
                          ?.slice(0, 10)
                          .split("-")
                          .reverse()
                          .join("/")
                      ) : (
                        <Skeleton
                          variant="rectangular"
                          width={100}
                          height={25}
                        />
                      )}
                    </Typography>
                  </Grid>
                  <Grid item mt={1}>
                    {walletAddress ? (
                      daoDetails ? (
                        remainingDays >= 0 && remainingTimeInSecs > 0 ? (
                          <Card className={classes.openTag}>
                            <Typography className={classes.openTagFont}>
                              Open
                            </Typography>
                          </Card>
                        ) : (
                          <Card className={classes.closeTag}>
                            <Typography className={classes.closeTagFont}>
                              Closed
                            </Typography>
                          </Card>
                        )
                      ) : (
                        <Skeleton
                          variant="rectangular"
                          width={100}
                          height={25}
                        />
                      )
                    ) : null}
                  </Grid>
                  {/* </Grid> */}
                </Grid>

                <Grid item md={3}>
                  <Grid container direction="column">
                    {tokenType === "erc721" ? (
                      <>
                        <Grid container direction="column">
                          <Grid item>
                            <Typography
                              variant="p"
                              className={classes.valuesDimStyle}>
                              Max Token Per User
                            </Typography>
                          </Grid>
                          <Grid item mt={1}>
                            <Typography
                              variant="p"
                              className={classes.valuesStyle}>
                              {daoDetails.maxTokensPerUser !== null ? (
                                daoDetails.maxTokensPerUser
                              ) : (
                                <Skeleton
                                  variant="rectangular"
                                  width={100}
                                  height={25}
                                />
                              )}
                            </Typography>
                          </Grid>
                        </Grid>
                      </>
                    ) : (
                      <>
                        <Grid item>
                          <Typography
                            variant="p"
                            className={classes.valuesDimStyle}>
                            Minimum Deposit
                          </Typography>
                        </Grid>
                        <Grid item mt={1}>
                          <Typography
                            variant="p"
                            className={classes.valuesStyle}>
                            {daoDetails.minDeposit ? (
                              `${convertFromWeiGovernance(
                                daoDetails.minDeposit,
                                erc20TokenDetails.tokenDecimal,
                              )} ${erc20TokenDetails.tokenSymbol}`
                            ) : (
                              <Skeleton
                                variant="rectangular"
                                width={100}
                                height={25}
                              />
                            )}
                          </Typography>
                        </Grid>
                      </>
                    )}
                  </Grid>
                </Grid>
                <Grid item md={3}>
                  <Grid container direction="column">
                    {tokenType === "erc721" ? (
                      <>
                        <Grid item>
                          <Typography
                            variant="p"
                            className={classes.valuesDimStyle}>
                            NFT Tranferable
                          </Typography>
                        </Grid>
                        <Grid item mt={1}>
                          <Typography
                            variant="p"
                            className={classes.valuesStyle}>
                            {daoDetails?.isTransferable !== null ? (
                              daoDetails.isTransferable ? (
                                "Yes"
                              ) : (
                                "No"
                              )
                            ) : (
                              <Skeleton
                                variant="rectangular"
                                width={100}
                                height={25}
                              />
                            )}
                          </Typography>
                        </Grid>
                      </>
                    ) : (
                      <>
                        <Grid item>
                          <Typography
                            variant="p"
                            className={classes.valuesDimStyle}>
                            Maximum Deposit
                          </Typography>
                        </Grid>
                        <Grid item mt={1}>
                          <Typography
                            variant="p"
                            className={classes.valuesStyle}>
                            {daoDetails.maxDeposit ? (
                              `${convertFromWeiGovernance(
                                daoDetails.maxDeposit,
                                erc20TokenDetails.tokenDecimal,
                              )} ${erc20TokenDetails.tokenSymbol}`
                            ) : (
                              <Skeleton
                                variant="rectangular"
                                width={100}
                                height={25}
                              />
                            )}
                          </Typography>
                        </Grid>
                      </>
                    )}
                  </Grid>
                </Grid>
                <Grid item md={3}>
                  <Grid container direction="column">
                    <Grid item>
                      <Typography
                        variant="p"
                        className={classes.valuesDimStyle}>
                        Members
                      </Typography>
                    </Grid>
                    <Grid item mt={1}>
                      <Typography variant="p" className={classes.valuesStyle}>
                        {members ? members.length : 0}
                      </Typography>
                    </Grid>
                  </Grid>
                </Grid>
                <Grid item md={3}>
                  <Grid container direction="column">
                    <Grid item>
                      <Typography
                        variant="p"
                        className={classes.valuesDimStyle}>
                        Treasury wallet
                      </Typography>
                    </Grid>
                    <Grid item mt={2}>
                      <Typography variant="p" className={classes.valuesStyle}>
                        $
                        {treasuryAmount >= 0 ? (
                          treasuryAmount.toFixed(3)
                        ) : (
                          <Skeleton
                            variant="rectangular"
                            width={100}
                            height={25}
                          />
                        )}
                      </Typography>
                    </Grid>
                  </Grid>
                </Grid>
                {daoDetails.isGovernance ? (
                  <>
                    <Grid item md={3}>
                      <Grid container direction="column">
                        <Grid item>
                          <Typography
                            variant="p"
                            className={classes.valuesDimStyle}>
                            Threshold
                          </Typography>
                        </Grid>
                        <Grid item mt={2}>
                          <Typography
                            variant="p"
                            className={classes.valuesStyle}>
                            {daoDetails.threshold ? (
                              daoDetails.threshold / 100
                            ) : (
                              <Skeleton
                                variant="rectangular"
                                width={100}
                                height={25}
                              />
                            )}
                            %
                          </Typography>
                        </Grid>
                      </Grid>
                    </Grid>
                    <Grid item md={3}>
                      <Grid container direction="column">
                        <Grid item>
                          <Typography
                            variant="p"
                            className={classes.valuesDimStyle}>
                            Quorum
                          </Typography>
                        </Grid>
                        <Grid item mt={2}>
                          <Typography
                            variant="p"
                            className={classes.valuesStyle}>
                            {daoDetails.quorum ? (
                              daoDetails.quorum / 100
                            ) : (
                              <Skeleton
                                variant="rectangular"
                                width={100}
                                height={25}
                              />
                            )}
                            %
                          </Typography>
                        </Grid>
                      </Grid>
                    </Grid>
                  </>
                ) : (
                  <>
                    {tokenType === "erc721" && (
                      <Grid item md={3}>
                        <Grid container direction="column">
                          <Grid item>
                            <Typography
                              variant="p"
                              className={classes.valuesDimStyle}>
                              Total Raise Amount
                            </Typography>
                          </Grid>
                          <Grid item mt={2}>
                            <Typography
                              variant="p"
                              className={classes.valuesStyle}>
                              {daoDetails.totalNftSupply !== null ? (
                                daoDetails.isTotalSupplyUnlimited ? (
                                  "Unlimited"
                                ) : (
                                  (
                                    daoDetails.distributionAmt *
                                    convertFromWeiGovernance(
                                      daoDetails.pricePerToken,
                                      6,
                                    )
                                  ).toFixed(3)
                                )
                              ) : (
                                <Skeleton
                                  variant="rectangular"
                                  width={100}
                                  height={25}
                                />
                              )}
                            </Typography>
                          </Grid>
                        </Grid>
                      </Grid>
                    )}
                  </>
                )}
              </Grid>
            </Paper>

            <Grid item mx={1} mt={4} mb={2}>
              {walletAddress &&
              tokenType === "erc721" &&
              !daoDetails.isTotalSupplyUnlimited ? (
                <>
                  <ProgressBar
                    value={calculateTreasuryTargetShare(
                      daoDetails.nftMinted,
                      daoDetails.distributionAmt,
                    )}
                  />
                </>
              ) : tokenType === "erc721" &&
                daoDetails.isTotalSupplyUnlimited ? null : walletAddress &&
                daoDetails.clubTokensMinted ? (
                <ProgressBar
                  value={
                    Number(
                      convertFromWeiGovernance(
                        +daoDetails.clubTokensMinted,
                        +daoDetails.decimals,
                      ) *
                        Number(
                          convertFromWeiGovernance(
                            +daoDetails.pricePerToken,
                            +erc20TokenDetails.tokenDecimal,
                          ),
                        ) *
                        100,
                    ) /
                    Number(
                      convertFromWeiGovernance(
                        +daoDetails.totalSupply.toFixed(0),
                        +erc20TokenDetails.tokenDecimal,
                      ),
                    )
                  }
                />
              ) : tokenType === "erc20" ? (
                <>
                  <ProgressBar
                    value={
                      (Number(clubData.totalAmountRaised) * 100) /
                      Number(clubData.raiseAmount)
                    }
                  />
                </>
              ) : (
                <Skeleton variant="rectangular" />
              )}
            </Grid>

            <Grid container spacing={2}>
              {tokenType === "erc721" ? (
                <Grid item ml={1} mt={1} mb={2}>
                  <Stack spacing={1}>
                    <Typography variant="p" className={classes.valuesDimStyle}>
                      NFTs Minted so far
                    </Typography>
                    <Typography variant="p" className={classes.valuesStyle}>
                      {daoDetails.nftMinted !== null ? (
                        daoDetails.nftMinted
                      ) : (
                        <Skeleton
                          variant="rectangular"
                          width={100}
                          height={25}
                        />
                      )}
                    </Typography>
                  </Stack>
                </Grid>
              ) : (
                <Grid item ml={1} mt={1} mb={2}>
                  <Stack spacing={1}>
                    <Typography variant="p" className={classes.valuesDimStyle}>
                      Amount raised so far
                    </Typography>
                    <Typography variant="p" className={classes.valuesStyle}>
                      {walletAddress ? (
                        convertFromWeiGovernance(
                          daoDetails.clubTokensMinted,
                          daoDetails.decimals,
                        ) *
                          convertFromWeiGovernance(
                            daoDetails.pricePerToken,
                            erc20TokenDetails.tokenDecimal,
                          ) +
                        " $USDC"
                      ) : (
                        <Skeleton
                          variant="rectangular"
                          width={100}
                          height={25}
                        />
                      )}
                    </Typography>
                  </Stack>
                </Grid>
              )}

              <Grid
                item
                ml={1}
                mt={1}
                mb={2}
                mr={1}
                xs
                sx={{ display: "flex", justifyContent: "flex-end" }}>
                <Stack spacing={1}>
                  <Typography variant="p" className={classes.valuesDimStyle}>
                    {tokenType === "erc721"
                      ? "Total NFT Supply"
                      : "Total Raise Amount"}
                  </Typography>

                  {tokenType === "erc721" ? (
                    <Typography
                      textAlign="right"
                      variant="p"
                      className={classes.valuesStyle}>
                      {daoDetails.totalNftSupply !== null ? (
                        daoDetails.isTotalSupplyUnlimited ? (
                          "Unlimited"
                        ) : (
                          daoDetails.distributionAmt
                        )
                      ) : (
                        <Skeleton
                          variant="rectangular"
                          width={100}
                          height={25}
                        />
                      )}{" "}
                    </Typography>
                  ) : (
                    <Typography
                      textAlign="right"
                      variant="p"
                      className={classes.valuesStyle}>
                      {daoDetails.totalSupply ? (
                        convertFromWeiGovernance(
                          daoDetails.totalSupply.toFixed(0),
                          erc20TokenDetails.tokenDecimal,
                        ) +
                        (" $" + erc20TokenDetails.tokenSymbol)
                      ) : (
                        <Skeleton
                          variant="rectangular"
                          width={100}
                          height={25}
                        />
                      )}
                    </Typography>
                  )}
                </Stack>
              </Grid>
            </Grid>
          </Card>
          <br />
        </Grid>
      </Grid>

      <EditDetails
        networkId={networkId}
        isClaims={false}
        open={open}
        setOpen={setOpen}
        onClose={handleClose}
        daoAddress={daoAddress}
      />
    </>
  );
};

export default SettingsInfo;
