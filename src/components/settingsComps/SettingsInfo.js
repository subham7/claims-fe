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
import { DesktopDatePicker, LocalizationProvider } from "@mui/x-date-pickers";
import React from "react";
import Layout1 from "../layouts/layout1";
import ProgressBar from "../progressbar";
import { SettingsInfoStlyes } from "./SettingsInfoStyles";

const SettingsInfo = () => {
  const classes = SettingsInfoStlyes();
  return (
    <>
      <Layout1 page={5}>
        <Grid container spacing={3} paddingLeft={10} paddingTop={15}>
          <Grid item md={9}>
            <Card className={classes.cardRegular}>
              <Grid container spacing={2}>
                <Grid item mt={3} ml={3}>
                  {/* <img src={imageUrl ?? null} width="100vw" alt="profile_pic" /> */}
                </Grid>
                <Grid item ml={1} mt={4} mb={7}>
                  <Stack spacing={0}>
                    <Typography variant="h4">
                      {/* {apiTokenDetailSet ? tokenAPIDetails[0].name : null} */}
                    </Typography>
                    <Typography variant="h6" className={classes.dimColor}>
                      {/* {dataFetched ? "$" + tokenSymbol : null} */}
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
                          {/* {tokenType === "erc721" && depositCloseDate ? (
                            new Date(parseInt(depositCloseDate) * 1000)
                              ?.toJSON()
                              ?.slice(0, 10)
                              .split("-")
                              .reverse()
                              .join("/")
                          ) : governorDataFetched ? (
                            new Date(parseInt(depositCloseDate) * 1000)
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
                          )} */}
                        </Typography>
                      </Grid>
                      <Grid item ml={1} mt={1}>
                        {/* {governorDataFetched || tokenType === "erc721" ? (
                          closingDays > 0 ? (
                            <Card className={classes.openTag}>
                              <Typography className={classes.openTagFont}>
                                Open
                              </Typography>
                            </Card>
                          ) : (
                            <Card className={classes.closeTag}>
                              <Typography className={classes.closeTagFont}>
                                {console.log(depositCloseDate)}
                                Closed
                              </Typography>
                            </Card>
                          )
                        ) : null} */}
                      </Grid>
                    </Grid>
                  </Grid>
                  <Grid item md={3}>
                    <Grid container direction="column">
                      {/* {tokenType === "erc721" ? (
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
                                {maxTokensPerUser !== null ? (
                                  maxTokensPerUser
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
                              Minimum Deposits
                            </Typography>
                          </Grid>
                          <Grid item mt={1}>
                            <Typography
                              variant="p"
                              className={classes.valuesStyle}
                            >
                              {governorDataFetched ? (
                                convertAmountToWei(
                                  currentMinDeposit.toString(),
                                ) + " USDC"
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
                      )} */}
                    </Grid>
                  </Grid>
                  <Grid item md={3}>
                    <Grid container direction="column">
                      {/* {tokenType === "erc721" ? (
                        <>
                          <Grid item>
                            <Typography
                              variant="p"
                              className={classes.valuesDimStyle}
                            >
                              Is NFT Tranferable
                            </Typography>
                          </Grid>
                          <Grid item mt={1}>
                            <Typography
                              variant="p"
                              className={classes.valuesStyle}
                            >
                              {isNftTransferable !== null ? (
                                isNftTransferable ? (
                                  "true"
                                ) : (
                                  "false"
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
                              {governorDataFetched ? (
                                convertAmountToWei(
                                  currentMaxDeposit.toString(),
                                ) + " USDC"
                              ) : (
                                <Skeleton
                                  variant="rectangular"
                                  width={100}
                                  height={25}
                                />
                              )}{" "}
                            </Typography>
                          </Grid>
                        </>
                      )} */}
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
                        {/* <Typography variant="p" className={classes.valuesStyle}>
                          {membersFetched ? members : 0}
                        </Typography> */}
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
                          {/* {clubAssetTokenFetched ? (
                            clubAssetTokenData.treasuryAmount
                          ) : ( */}
                          <Skeleton
                            variant="rectangular"
                            width={100}
                            height={25}
                          />
                          {/* )} */}
                        </Typography>
                      </Grid>
                    </Grid>
                  </Grid>
                  <Grid item md={3}>
                    {/* {tokenType === "erc721" ? null : (
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
                            {balanceOfToken !== null && clubTokenMinted !== null
                              ? isNaN(
                                  parseInt(
                                    calculateUserSharePercentage(
                                      balanceOfToken,
                                      clubTokenMinted,
                                    ),
                                  ),
                                )
                                ? 0
                                : parseInt(
                                    calculateUserSharePercentage(
                                      balanceOfToken,
                                      clubTokenMinted,
                                    ),
                                  )
                              : 0}
                            % ({balanceOfToken} {tokenSymbol})
                          </Typography>
                        </Grid>
                      </Grid>
                    )} */}
                  </Grid>
                  {/* {isGovernanceActive ? (
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
                              {thresholdFetched ? (
                                thresholdValue
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
                              {quoramFetched ? (
                                quoramValue
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
                    </>
                  ) : null} */}
                </Grid>
              </Paper>

              {/* {tokenType === "erc721" ? (
                <>
                  <br />
                  <Grid container spacing={7}>
                    {tokenType === "erc721" ? (
                      <>
                        <Grid item md={3} ml={4}>
                          <Stack spacing={1}>
                            <Typography variant="settingText">
                              NFTs Minted so far
                            </Typography>
                            <Typography
                              variant="p"
                              className={classes.valuesStyle}
                            >
                              {totalNftMinted !== null ? (
                                totalNftMinted
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
                        <Grid item>
                          <Stack spacing={1}>
                            <Typography variant="settingText">
                              Total Supply
                            </Typography>
                            {tokenType === "erc721" ? (
                              <Typography
                                variant="p"
                                className={classes.valuesStyle}
                              >
                                {totalNftSupply !== null ? (
                                  isNftTotalSupplyUnlimited ? (
                                    "Unlimited"
                                  ) : (
                                    totalNftSupply
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
                                variant="p"
                                className={classes.valuesStyle}
                              >
                                {governorDataFetched ? (
                                  // convertAmountToWei(totalERC20Supply?.toString()) +
                                  // (" $" + tokenDetails[1])
                                  // convertAmountToWei(String(totalERC20Supply))
                                  ` ${
                                    totalERC20Supply / Math.pow(10, 6)
                                  } ${tokenSymbol}`
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
                      </>
                    ) : (
                      <>
                        <Grid item md={3} ml={4}>
                          <Stack spacing={1}>
                            <Typography variant="settingText">
                              Club Tokens Minted so far
                            </Typography>
                            <Typography
                              variant="p"
                              className={classes.valuesStyle}
                            >
                              {governorDataFetched ? (
                                parseInt(clubTokenMinted) + " $" + tokenSymbol
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
                        <Grid item>
                          <Stack spacing={1}>
                            <Typography variant="settingText">
                              Total Supply
                            </Typography>
                            {tokenType === "erc721" ? (
                              <Typography
                                variant="p"
                                className={classes.valuesStyle}
                              >
                                {totalNftSupply !== null ? (
                                  isNftTotalSupplyUnlimited ? (
                                    "Unlimited"
                                  ) : (
                                    totalNftSupply
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
                                variant="p"
                                className={classes.valuesStyle}
                              >
                                {governorDataFetched ? (
                                  // convertAmountToWei(totalERC20Supply?.toString()) +
                                  // (" $" + tokenDetails[1])
                                  // convertAmountToWei(String(totalERC20Supply))
                                  ` ${
                                    totalERC20Supply / Math.pow(10, 6)
                                  } ${tokenSymbol}`
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
                      </>
                    )}
                  </Grid>
                </>
              ) : (
                <>
                  <Grid item ml={3} mt={5} mb={2} mr={3}>
                    <ProgressBar
                      value={
                        clubTokenMinted && totalERC20Supply
                          ? calculateTreasuryTargetShare(
                              clubTokenMinted,
                              totalERC20Supply / 1000000,
                            )
                          : 0
                      }
                    />
                  </Grid>

                  <Grid container spacing={2}>
                    {tokenType === "erc721" ? (
                      <>
                        <Grid item ml={4} mt={1} mb={2}>
                          <Stack spacing={1}>
                            <Typography variant="settingText">
                              NFTs Minted so far
                            </Typography>
                            <Typography
                              variant="p"
                              className={classes.valuesStyle}
                            >
                              {totalNftMinted !== null ? (
                                totalNftMinted
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
                      </>
                    ) : (
                      <Grid item ml={4} mt={1} mb={2}>
                        <Stack spacing={1}>
                          <Typography variant="settingText">
                            Club Tokens Minted so far
                          </Typography>
                          <Typography
                            variant="p"
                            className={classes.valuesStyle}
                          >
                            {governorDataFetched ? (
                              parseInt(clubTokenMinted) + " $" + tokenSymbol
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
                        <Typography variant="settingText">
                          Total Supply
                        </Typography>
                        {tokenType === "erc721" ? (
                          <Typography
                            variant="p"
                            className={classes.valuesStyle}
                          >
                            {totalNftSupply !== null ? (
                              isNftTotalSupplyUnlimited ? (
                                "Unlimited"
                              ) : (
                                totalNftSupply
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
                            variant="p"
                            className={classes.valuesStyle}
                          >
                            {governorDataFetched ? (
                              // convertAmountToWei(totalERC20Supply?.toString()) +
                              // (" $" + tokenDetails[1])
                              // convertAmountToWei(String(totalERC20Supply))
                              ` ${
                                totalERC20Supply / Math.pow(10, 6)
                              } ${tokenSymbol}`
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
              )} */}
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
