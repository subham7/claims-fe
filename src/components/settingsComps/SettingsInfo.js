import {
  Backdrop,
  Button,
  Card,
  CircularProgress,
  Dialog,
  DialogContent,
  Divider,
  Grid,
  Paper,
  Skeleton,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import React from "react";
import Layout1 from "../layouts/layout1";
import ProgressBar from "../progressbar";

import { SettingsInfoStlyes } from "./SettingsInfoStyles";
import Web3 from "web3";
import {
  calculateTreasuryTargetShare,
  calculateUserSharePercentage,
  convertFromWeiGovernance,
} from "../../utils/globalFunctions";

const SettingsInfo = ({
  daoDetails,
  treasuryAmount,
  tokenType,
  erc20TokenDetails,
  members,
  remainingDays,
  walletAddress,
  remainingTimeInSecs,
}) => {
  const classes = SettingsInfoStlyes();

  return (
    <>
      <Layout1 page={5}>
        <Grid container spacing={3} paddingLeft={10} paddingTop={15}>
          <Grid item md={9}>
            <Card className={classes.cardRegular}>
              <Grid container spacing={2}>
                {/* <Grid item mt={3} ml={3}>
                  <img
                    src={daoDetails.daoImage ?? null}
                    width="100vw"
                    alt="profile_pic"
                  />
                </Grid> */}
                <Grid item ml={4} mt={4} mb={7}>
                  <Stack spacing={0}>
                    <Typography variant="h4">
                      {daoDetails.daoName ? daoDetails.daoName : null}
                    </Typography>
                    <Typography variant="h6" className={classes.dimColor}>
                      {daoDetails.daoSymbol ? "$" + daoDetails.daoSymbol : null}
                    </Typography>
                  </Stack>
                </Grid>
              </Grid>
              <Divider variant="middle" />
              <Paper
                style={{
                  background: "transparent",
                  boxShadow: "none",
                  paddingTop: "50px",
                  paddingLeft: "30px",
                }}
              >
                <Grid container spacing={7}>
                  <Grid item md={3}>
                    <Typography variant="settingText">
                      Deposits deadline
                    </Typography>
                    <Grid container>
                      <Grid item mt={1}>
                        <Typography variant="p" className={classes.valuesStyle}>
                          {daoDetails.depositDeadline ? (
                            new Date(
                              parseInt(daoDetails.depositDeadline) * 1000,
                            )
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
                      <Grid item ml={1} mt={1}>
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
                    </Grid>
                  </Grid>
                  <Grid item md={3}>
                    <Grid container direction="column">
                      {tokenType === "erc721" ? (
                        <>
                          <Grid container direction="column">
                            <Grid item>
                              <Typography
                                variant="p"
                                className={classes.valuesDimStyle}
                              >
                                Max Token Per User
                              </Typography>
                            </Grid>
                            <Grid item mt={1}>
                              <Typography
                                variant="p"
                                className={classes.valuesStyle}
                              >
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
                              className={classes.valuesDimStyle}
                            >
                              Minimum Deposit
                            </Typography>
                          </Grid>
                          <Grid item mt={1}>
                            <Typography
                              variant="p"
                              className={classes.valuesStyle}
                            >
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
                              className={classes.valuesDimStyle}
                            >
                              NFT Tranferable
                            </Typography>
                          </Grid>
                          <Grid item mt={1}>
                            <Typography
                              variant="p"
                              className={classes.valuesStyle}
                            >
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
                              className={classes.valuesDimStyle}
                            >
                              Maximum Deposit
                            </Typography>
                          </Grid>
                          <Grid item mt={1}>
                            <Typography
                              variant="p"
                              className={classes.valuesStyle}
                            >
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
                          className={classes.valuesDimStyle}
                        >
                          Members
                        </Typography>
                      </Grid>
                      <Grid item mt={{ lg: 5, xl: 1 }}>
                        <Typography variant="p" className={classes.valuesStyle}>
                          {members ? members.length : 0}
                        </Typography>
                      </Grid>
                    </Grid>
                  </Grid>
                  <Grid item md={3}>
                    <Grid container direction="column">
                      <Grid item>
                        <Typography variant="settingText">
                          Treasury wallet
                        </Typography>
                      </Grid>
                      <Grid item mt={2}>
                        <Typography variant="p" className={classes.valuesStyle}>
                          $
                          {treasuryAmount >= 0 ? (
                            treasuryAmount
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
                  <Grid item md={3}>
                    {tokenType === "erc721" ? (
                      <>
                        {!daoDetails.isGovernance ? (
                          // <Grid item ml={4} mt={1} mb={2}>
                          <Stack spacing={1}>
                            <Typography variant="settingText">
                              NFTs Minted so far
                            </Typography>
                            <Typography
                              variant="p"
                              className={classes.valuesStyle}
                            >
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
                        ) : (
                          // </Grid>
                          ""
                        )}
                      </>
                    ) : (
                      <>
                        <Grid container direction="column">
                          <Grid item>
                            <Typography variant="settingText">
                              Your ownership
                            </Typography>
                          </Grid>
                          <Grid item mt={2}>
                            <Typography
                              variant="p"
                              className={classes.valuesStyle}
                            >
                              {daoDetails.balanceOfClubToken !== null &&
                              daoDetails.clubTokensMinted !== null &&
                              isNaN(
                                Number(
                                  (daoDetails.balanceOfClubToken /
                                    convertFromWeiGovernance(
                                      daoDetails.clubTokensMinted,
                                      18,
                                    )) *
                                    100,
                                ).toFixed(2),
                              )
                                ? 0
                                : Number(
                                    (daoDetails.balanceOfClubToken /
                                      convertFromWeiGovernance(
                                        daoDetails.clubTokensMinted,
                                        18,
                                      )) *
                                      100,
                                  ).toFixed(2)}
                              % <br />({daoDetails.balanceOfClubToken}{" "}
                              {daoDetails.daoSymbol})
                            </Typography>
                          </Grid>
                        </Grid>
                      </>
                    )}
                  </Grid>
                  {daoDetails.isGovernance ? (
                    <>
                      {" "}
                      <Grid item md={3}>
                        <Grid container direction="column">
                          <Grid item>
                            <Typography variant="settingText">
                              Threshold
                            </Typography>
                          </Grid>
                          <Grid item mt={2}>
                            <Typography
                              variant="p"
                              className={classes.valuesStyle}
                            >
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
                            <Typography variant="settingText">
                              Quorum
                            </Typography>
                          </Grid>
                          <Grid item mt={2}>
                            <Typography
                              variant="p"
                              className={classes.valuesStyle}
                            >
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
                      {!daoDetails.isGovernance && tokenType === "erc721" && (
                        <Grid item md={3}>
                          <Grid container direction="column">
                            <Grid item>
                              <Typography variant="settingText">
                                Total Raise Amount
                              </Typography>
                            </Grid>
                            <Grid item mt={2}>
                              <Typography
                                variant="p"
                                className={classes.valuesStyle}
                              >
                                {daoDetails.totalNftSupply !== null ? (
                                  daoDetails.isTotalSupplyUnlimited ? (
                                    "Unlimited"
                                  ) : (
                                    convertFromWeiGovernance(
                                      daoDetails.distributionAmt,
                                      18,
                                    ) *
                                    convertFromWeiGovernance(
                                      daoDetails.pricePerToken,
                                      6,
                                    )
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

              <>
                <Grid item ml={3} mt={5} mb={2} mr={3}>
                  {walletAddress &&
                  tokenType === "erc721" &&
                  !daoDetails.isTotalSupplyUnlimited ? (
                    <>
                      <ProgressBar
                        value={calculateTreasuryTargetShare(
                          daoDetails.nftMinted,
                          convertFromWeiGovernance(
                            daoDetails.distributionAmt,
                            18,
                          ) *
                            convertFromWeiGovernance(
                              daoDetails.pricePerToken,
                              6,
                            ),
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
                  ) : (
                    <Skeleton variant="rectangular" />
                  )}
                </Grid>

                <Grid container spacing={2}>
                  {tokenType === "erc721" ? (
                    <>
                      {daoDetails.isGovernance && (
                        <Grid item ml={4} mt={1} mb={2}>
                          <Stack spacing={1}>
                            <Typography variant="settingText">
                              NFTs Minted so far
                            </Typography>
                            <Typography
                              variant="p"
                              className={classes.valuesStyle}
                            >
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
                      )}
                    </>
                  ) : (
                    <Grid item ml={4} mt={1} mb={2}>
                      <Stack spacing={1}>
                        <Typography variant="settingText">
                          Amount raised so far
                        </Typography>
                        <Typography variant="p" className={classes.valuesStyle}>
                          {walletAddress ? (
                            (
                              convertFromWeiGovernance(
                                daoDetails.clubTokensMinted,
                                daoDetails.decimals,
                              ) *
                              convertFromWeiGovernance(
                                daoDetails.pricePerToken,
                                erc20TokenDetails.tokenDecimal,
                              )
                            ).toFixed(2) + " $USDC"
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
                    ml={4}
                    mt={1}
                    mb={2}
                    mr={4}
                    xs
                    sx={{ display: "flex", justifyContent: "flex-end" }}
                  >
                    <Stack spacing={1}>
                      {daoDetails.isGovernance && (
                        <Typography variant="settingText">
                          Total Raise Amount
                        </Typography>
                      )}

                      {tokenType === "erc721" ? (
                        <>
                          {daoDetails.isGovernance && (
                            <Typography
                              textAlign="right"
                              variant="p"
                              className={classes.valuesStyle}
                            >
                              {daoDetails.totalNftSupply !== null ? (
                                daoDetails.isTotalSupplyUnlimited ? (
                                  "Unlimited"
                                ) : (
                                  convertFromWeiGovernance(
                                    daoDetails.distributionAmt,
                                    18,
                                  ) *
                                  convertFromWeiGovernance(
                                    daoDetails.pricePerToken,
                                    6,
                                  )
                                )
                              ) : (
                                <Skeleton
                                  variant="rectangular"
                                  width={100}
                                  height={25}
                                />
                              )}{" "}
                            </Typography>
                          )}
                        </>
                      ) : (
                        <Typography
                          textAlign="right
                        "
                          variant="p"
                          className={classes.valuesStyle}
                        >
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
                          )}{" "}
                        </Typography>
                      )}
                    </Stack>
                  </Grid>
                </Grid>
              </>
            </Card>
            <br />
          </Grid>
        </Grid>

        {/* This is the temporary coming soon dialogue */}
        {/* <Dialog
          open={tempOpen}
          onClose={handleTempClose}
          scroll="body"
          PaperProps={{ classes: { root: classes.modalStyle } }}
          fullWidth
          maxWidth="lg"
        >
          <DialogContent
            sx={{ overflow: "hidden", backgroundColor: "#19274B" }}
          >
            <Grid
              container
              justifyContent="center"
              alignItems="center"
              direction="column"
              mt={3}
            >
              <Grid item>
                <img src="/assets/images/comingsoon.svg" />
              </Grid>
              <Grid item m={3}>
                <Typography className={classes.dialogBox}>
                  Hold tight! Coming soon
                </Typography>
              </Grid>
            </Grid>
          </DialogContent>
        </Dialog> */}

        <Backdrop
          sx={{ color: "#fff", zIndex: (theme) => theme.zIndex.drawer + 1 }}
          //   open={loaderOpen}
        >
          <CircularProgress color="inherit" />
        </Backdrop>
      </Layout1>
    </>
  );
};

export default SettingsInfo;