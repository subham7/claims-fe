import React, { useCallback, useEffect, useState } from "react";
import {
  Alert,
  Backdrop,
  Button,
  Card,
  CardMedia,
  CircularProgress,
  Divider,
  FormControl,
  Grid,
  Skeleton,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import { TwitterShareButton } from "react-twitter-embed";
import { NewArchERC20Styles } from "./NewArchERC20Styles";
import { useConnectWallet } from "@web3-onboard/react";
import ProgressBar from "../../../progressbar";
import {
  convertFromWeiGovernance,
  convertToWeiGovernance,
} from "../../../../utils/globalFunctions";
import { useFormik } from "formik";
import * as yup from "yup";
import dayjs from "dayjs";
import { useSelector } from "react-redux";
import { useRouter } from "next/router";
import WrongNetworkModal from "../../../modals/WrongNetworkModal";
// import useSmartContract from "../../../../hooks/useSmartContract";
import useSmartContractMethods from "../../../../hooks/useSmartContractMethods";

const NewArchERC20 = ({
  daoDetails,
  erc20DaoAddress,
  isTokenGated,
  isEligibleForTokenGating,
  members,
  remainingClaimAmount,
  displayTokenDetails,
  fetchedTokenGatedDetails,
}) => {
  const [erc20TokenDetails, setErc20TokenDetails] = useState({
    tokenSymbol: "",
    tokenBalance: 0,
    tokenName: "",
    tokenDecimal: 0,
  });
  const [loading, setLoading] = useState(false);
  const [showMessage, setShowMessage] = useState(false);
  const [depositSuccessfull, setDepositSuccessfull] = useState(false);
  const classes = NewArchERC20Styles();
  const [{ wallet }] = useConnectWallet();
  const router = useRouter();
  const walletAddress = wallet?.accounts[0].address;

  const FACTORY_CONTRACT_ADDRESS = useSelector((state) => {
    return state.gnosis.factoryContractAddress;
  });

  const WRONG_NETWORK = useSelector((state) => {
    return state.gnosis.wrongNetwork;
  });

  const day = Math.floor(new Date().getTime() / 1000.0);
  const day1 = dayjs.unix(day);
  const day2 = dayjs.unix(daoDetails.depositDeadline);

  const remainingDays = day2.diff(day1, "day");
  const remainingTimeInSecs = day2.diff(day1, "seconds");
  const remainingTimeInHours = day2.diff(day1, "hours");

  const showMessageHandler = () => {
    setShowMessage(true);
    setTimeout(() => {
      setShowMessage(false);
    }, 4000);
  };

  const {
    getBalance,
    getDecimals,
    getTokenSymbol,
    getTokenName,
    approveDeposit,
    buyGovernanceTokenERC20DAO,
  } = useSmartContractMethods();

  const fetchTokenDetails = useCallback(async () => {
    setLoading(true);
    try {
      const balanceOfToken = await getBalance(daoDetails.depositTokenAddress);
      const decimals = await getDecimals(daoDetails.depositTokenAddress);
      const symbol = await getTokenSymbol(daoDetails.depositTokenAddress);
      const name = await getTokenName(daoDetails.depositTokenAddress);

      const balanceConverted = convertFromWeiGovernance(
        balanceOfToken,
        decimals,
      );
      setErc20TokenDetails({
        tokenBalance: +balanceConverted,
        tokenSymbol: symbol,
        tokenName: name,
        tokenDecimal: decimals,
      });
      setLoading(false);
    } catch (error) {
      console.log(error);
      setLoading(false);
    }
  }, [daoDetails.depositTokenAddress]);

  const minValidation = yup.object().shape({
    tokenInput: yup
      .number()
      .required("Input is required")
      .min(
        Number(
          convertFromWeiGovernance(
            daoDetails.minDeposit,
            erc20TokenDetails.tokenDecimal,
          ),
        ),
        "Amount should be greater than min deposit",
      )
      .lessThan(
        erc20TokenDetails.tokenBalance,
        "Amount can't be greater than wallet balance",
      )
      .max(
        Number(
          convertFromWeiGovernance(
            daoDetails.maxDeposit,
            erc20TokenDetails.tokenDecimal,
          ),
        ),
        "Amount should be less than max deposit",
      ),
  });

  const remainingValidation = yup.object().shape({
    tokenInput: yup
      .number()
      .required("Input is required")
      .min(0.0000001, "Amount should be greater than min deposit")
      .lessThan(
        erc20TokenDetails.tokenBalance,
        "Amount can't be greater than wallet balance",
      )
      .max(
        remainingClaimAmount,
        "Amount should be less than remaining deposit amount",
      ),
  });

  const formik = useFormik({
    initialValues: {
      tokenInput: 0,
    },
    validationSchema:
      remainingClaimAmount === undefined ? minValidation : remainingValidation,
    onSubmit: async (values) => {
      try {
        setLoading(true);
        const inputValue = convertToWeiGovernance(
          values.tokenInput,
          erc20TokenDetails.tokenDecimal,
        );

        await approveDeposit(
          daoDetails.depositTokenAddress,
          FACTORY_CONTRACT_ADDRESS,
          inputValue,
          erc20TokenDetails.tokenDecimal,
        );

        await buyGovernanceTokenERC20DAO(
          walletAddress,
          erc20DaoAddress,
          convertToWeiGovernance(
            (inputValue / +daoDetails.pricePerToken).toString(),
            18,
          ),
          [],
        );

        setLoading(false);
        setDepositSuccessfull(true);
        router.push(`/dashboard/${erc20DaoAddress}`, undefined, {
          shallow: true,
        });
        showMessageHandler();
        formik.values.tokenInput = 0;
      } catch (error) {
        console.log(error);
        setLoading(false);
        showMessageHandler();
      }
    },
  });

  useEffect(() => {
    if (daoDetails.depositTokenAddress && daoDetails.clubTokensMinted && wallet)
      fetchTokenDetails();
  }, [fetchTokenDetails, daoDetails, wallet]);

  return (
    <>
      {wallet ? (
        <>
          <Grid
            container
            spacing={2}
            paddingLeft={10}
            paddingTop={12}
            paddingRight={10}>
            <Grid item md={7}>
              <Card className={classes.cardRegular}>
                <Grid container>
                  <Grid item xs={12} md={9}>
                    <Grid container spacing={2}>
                      <Grid item ml={4} mt={4} mb={4}>
                        <Stack spacing={0}>
                          <Typography variant="h4">
                            {daoDetails.daoName ? (
                              daoDetails.daoName
                            ) : (
                              <Skeleton
                                variant="rectangular"
                                width={100}
                                height={25}
                              />
                            )}
                          </Typography>
                          <Typography variant="h6" className={classes.dimColor}>
                            {daoDetails.daoSymbol ? (
                              "$" + daoDetails.daoSymbol
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
                    </Grid>
                  </Grid>
                  <Grid
                    item
                    xs={12}
                    md={3}
                    sx={{
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                    }}>
                    {/* enter your code here */}

                    <div className="centerContent">
                      <div className="selfCenter spaceBetween">
                        <TwitterShareButton
                          onLoad={function noRefCheck() {}}
                          options={{
                            size: "large",
                            text: `Just joined ${daoDetails.daoName} Station on `,
                            via: "stationxnetwork",
                          }}
                          url={`${window.location.origin}/join/${erc20DaoAddress}`}
                        />
                      </div>
                    </div>
                  </Grid>
                </Grid>

                <Divider variant="middle" />
                <Grid container spacing={7}>
                  <Grid item ml={4} mt={5} md={3}>
                    <Typography variant="p" className={classes.valuesDimStyle}>
                      {walletAddress ? (
                        "Deposits deadline"
                      ) : (
                        <Skeleton
                          variant="rectangular"
                          width={100}
                          height={25}
                        />
                      )}
                    </Typography>
                    <Grid container mt={2} direction="row">
                      <Grid item>
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
                      <Grid item ml={3} mt={1}>
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
                  <Grid item ml={4} mt={5} md={3}>
                    <Grid container direction={"column"}>
                      <Grid item>
                        <Typography
                          variant="p"
                          className={classes.valuesDimStyle}>
                          {walletAddress ? (
                            "Minimum Deposits"
                          ) : (
                            <Skeleton
                              variant="rectangular"
                              width={100}
                              height={25}
                            />
                          )}
                        </Typography>
                      </Grid>
                      <Grid item mt={2}>
                        <Typography variant="p" className={classes.valuesStyle}>
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
                    </Grid>
                  </Grid>
                  <Grid item ml={4} mt={5} md={3}>
                    <Grid container>
                      <Grid item>
                        <Typography
                          variant="p"
                          className={classes.valuesDimStyle}>
                          {walletAddress ? (
                            "Maximum Deposit"
                          ) : (
                            <Skeleton
                              variant="rectangular"
                              width={100}
                              height={25}
                            />
                          )}
                        </Typography>
                      </Grid>
                      <Grid item mt={2}>
                        <Typography variant="p" className={classes.valuesStyle}>
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
                    </Grid>
                  </Grid>
                </Grid>
                <Grid container mt={5}>
                  <Grid item ml={4} md={3}>
                    <Grid item>
                      <Typography
                        variant="p"
                        className={classes.valuesDimStyle}>
                        {walletAddress ? (
                          "Governance"
                        ) : (
                          <Skeleton
                            variant="rectangular"
                            width={100}
                            height={25}
                          />
                        )}
                      </Typography>
                    </Grid>
                    <Grid item mt={2}>
                      <Typography variant="p" className={classes.valuesStyle}>
                        {daoDetails.isGovernance ? "By Voting" : "Inactive"}
                      </Typography>
                    </Grid>
                  </Grid>
                  <Grid item ml={5} md={3}>
                    <Grid container direction="column">
                      <Grid item>
                        <Typography
                          variant="p"
                          className={classes.valuesDimStyle}>
                          {walletAddress ? (
                            "Members"
                          ) : (
                            <Skeleton
                              variant="rectangular"
                              width={100}
                              height={25}
                            />
                          )}
                        </Typography>
                      </Grid>
                      <Grid item mt={2}>
                        <Typography variant="p" className={classes.valuesStyle}>
                          {walletAddress ? (
                            members?.length
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
                </Grid>
                <Grid item ml={3} mt={5} mb={2} mr={3}>
                  {walletAddress && daoDetails.clubTokensMinted ? (
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
                <br />
                <Grid
                  container
                  spacing={2}
                  direction="row"
                  justifyContent="space-between"
                  alignItems="center">
                  <Grid item ml={4} mt={1} mb={2} md={8}>
                    <Grid container direction="column" spacing={2}>
                      <Grid item>
                        <Typography
                          variant="p"
                          className={classes.valuesDimStyle}>
                          {walletAddress ? (
                            "Amount raised so far"
                          ) : (
                            <Skeleton
                              variant="rectangular"
                              width={100}
                              height={25}
                            />
                          )}
                        </Typography>
                      </Grid>
                      <Grid item>
                        <Typography variant="p" className={classes.valuesStyle}>
                          {walletAddress ? (
                            Number(
                              convertFromWeiGovernance(
                                daoDetails.clubTokensMinted,
                                daoDetails.decimals,
                              ) *
                                convertFromWeiGovernance(
                                  daoDetails.pricePerToken,
                                  erc20TokenDetails.tokenDecimal,
                                ),
                            ).toFixed(2) + " USDC"
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
                  <Grid item mt={1} mb={2} mr={3} direction="row">
                    <Grid container direction="column" spacing={2}>
                      <Grid item>
                        <Typography
                          variant="p"
                          className={classes.valuesDimStyle}>
                          {walletAddress ? (
                            "Total Raise Amt"
                          ) : (
                            <Skeleton
                              variant="rectangular"
                              width={100}
                              height={25}
                            />
                          )}
                        </Typography>
                      </Grid>
                      <Grid item>
                        <Typography variant="p" className={classes.valuesStyle}>
                          {daoDetails.totalSupply ? (
                            convertFromWeiGovernance(
                              daoDetails.totalSupply.toFixed(0),
                              erc20TokenDetails.tokenDecimal,
                            )?.toString() + " USDC"
                          ) : (
                            <Skeleton
                              variant="rectangular"
                              width={100}
                              height={25}
                            />
                          )}{" "}
                        </Typography>
                      </Grid>
                    </Grid>
                  </Grid>
                </Grid>
              </Card>
            </Grid>
            <Grid item md={5}>
              {walletAddress ? (
                <Card className={classes.cardJoin}>
                  <form onSubmit={formik.handleSubmit}>
                    <Grid container spacing={2}>
                      <Grid
                        item
                        ml={2}
                        mt={4}
                        mb={4}
                        className={classes.JoinText}>
                        <Typography variant="h4">Join Station</Typography>
                      </Grid>
                      <Divider />
                      <Grid
                        item
                        ml={1}
                        mt={4}
                        mb={4}
                        mr={2}
                        xs
                        sx={{ display: "flex", justifyContent: "flex-end" }}>
                        <Typography variant="h6" className={classes.JoinText}>
                          {daoDetails.depositDeadline
                            ? remainingDays >= 0 && remainingTimeInSecs > 0
                              ? `Closes in ${
                                  remainingDays === 0
                                    ? remainingTimeInHours
                                    : remainingDays
                                } ${remainingDays === 0 ? "hours" : "days"}`
                              : "Joining Closed"
                            : 0}
                        </Typography>
                      </Grid>
                    </Grid>

                    <Divider variant="middle" sx={{ bgcolor: "#3B7AFD" }} />
                    <Grid container spacing={2}>
                      <Grid item md={12} mt={2}>
                        <Card className={classes.cardSmall}>
                          <Grid container spacing={2}>
                            <Grid item ml={2} mt={2} mb={0}>
                              <Typography className={classes.cardSmallFont}>
                                {erc20TokenDetails.tokenSymbol}
                              </Typography>
                            </Grid>
                            <Grid
                              item
                              ml={2}
                              mt={2}
                              mb={0}
                              xs
                              sx={{
                                display: "flex",
                                justifyContent: "flex-end",
                              }}>
                              <Typography className={classes.cardSmallFont}>
                                Balance:{" "}
                                {erc20TokenDetails.tokenBalance.toFixed(2)} $
                                {erc20TokenDetails.tokenSymbol}
                              </Typography>
                            </Grid>
                          </Grid>
                          <Grid container spacing={2}>
                            <Grid item ml={2} mt={1} mb={2} p={1}>
                              <FormControl
                                style={{ background: "#fff" }}
                                onSubmit={formik.handleSubmit}>
                                <TextField
                                  variant="filled"
                                  className={classes.cardLargeFont}
                                  type="number"
                                  name="tokenInput"
                                  id="tokenInput"
                                  disabled={
                                    remainingDays >= 0 &&
                                    remainingTimeInSecs > 0 &&
                                    isTokenGated
                                      ? !isEligibleForTokenGating
                                      : remainingDays >= 0 &&
                                        remainingTimeInSecs > 0
                                      ? false
                                      : true
                                  }
                                  inputProps={{
                                    style: {
                                      fontSize: "2em",
                                      background: "#fff",
                                      color: "#000",
                                    },
                                  }}
                                  InputLabelProps={{
                                    style: { fontSize: "1em" },
                                  }}
                                  onChange={formik.handleChange}
                                  value={formik.values.tokenInput}
                                  error={
                                    formik.touched.tokenInput &&
                                    Boolean(formik.errors.tokenInput)
                                  }
                                  helperText={
                                    formik.touched.tokenInput &&
                                    formik.errors.tokenInput
                                  }
                                />
                              </FormControl>

                              {/* <Typography sx={{ color: "red" }}>
                              {depositAmount < minDeposit
                                ? "Deposit amount should be greater than min deposit"
                                : ""}
                              {depositAmount > maxDeposit
                                ? "Deposit amount should be less than max deposit"
                                : ""}
                            </Typography> */}
                            </Grid>

                            <Grid
                              item
                              ml={2}
                              mt={1}
                              mb={1}
                              xs
                              sx={{
                                display: "flex",
                                justifyContent: "flex-end",
                              }}>
                              <Button
                                className={classes.maxTag}
                                onClick={() => {
                                  formik.setFieldValue(
                                    "tokenInput",
                                    remainingClaimAmount
                                      ? remainingClaimAmount <
                                        erc20TokenDetails.tokenBalance.toFixed(
                                          2,
                                        )
                                        ? remainingClaimAmount
                                        : erc20TokenDetails.tokenBalance.toFixed(
                                            2,
                                          )
                                      : Number(
                                          convertFromWeiGovernance(
                                            daoDetails.maxDeposit,
                                            erc20TokenDetails.tokenDecimal,
                                          ),
                                        ) <
                                        erc20TokenDetails.tokenBalance.toFixed(
                                          2,
                                        )
                                      ? Number(
                                          convertFromWeiGovernance(
                                            daoDetails.maxDeposit,
                                            erc20TokenDetails.tokenDecimal,
                                          ),
                                        )
                                      : erc20TokenDetails.tokenBalance.toFixed(
                                          2,
                                        ),
                                  );
                                }}>
                                Max
                              </Button>
                            </Grid>
                          </Grid>
                        </Card>
                      </Grid>
                    </Grid>
                    <Grid container spacing={2}>
                      <Grid item md={12} mt={2}>
                        <Card className={classes.cardWarning}>
                          <Typography className={classes.JoinText}>
                            Stations can have same names or symbols, please make
                            sure to trust the sender for the link before
                            depositing.
                          </Typography>

                          <Typography
                            sx={{
                              color: "#3A7AFD",
                              fontFamily: "Whyte",
                              fontSize: "22px",
                              fontWeight: "bold",
                              mt: "5px",
                            }}>
                            Conditions :
                          </Typography>

                          <ul>
                            <li
                              style={{
                                fontSize: "18px",
                                fontWeight: "500",
                                mt: "5px",
                              }}>
                              ${displayTokenDetails.tokenASymbol} -{" "}
                              {convertFromWeiGovernance(
                                fetchedTokenGatedDetails.tokenAAmt,
                                displayTokenDetails.tokenADecimal,
                              )}{" "}
                              token
                            </li>

                            {displayTokenDetails.tokenASymbol !==
                              displayTokenDetails.tokenBSymbol && (
                              <li
                                style={{
                                  fontSize: "18px",
                                  fontWeight: "500",
                                  mt: "5px",
                                }}>
                                ${displayTokenDetails.tokenBSymbol} -{" "}
                                {displayTokenDetails.tokenBDecimal
                                  ? convertFromWeiGovernance(
                                      fetchedTokenGatedDetails.tokenBAmt,
                                      displayTokenDetails.tokenBDecimal,
                                    )
                                  : convertFromWeiGovernance(
                                      fetchedTokenGatedDetails.tokenBAmt,
                                      displayTokenDetails.tokenADecimal,
                                    )}{" "}
                                token
                              </li>
                            )}
                          </ul>
                        </Card>
                      </Grid>
                      <Grid
                        item
                        container
                        ml={1}
                        mt={1}
                        mb={1}
                        sx={{ display: "flex", flexDirection: "column" }}>
                        <Button
                          variant="primary"
                          size="large"
                          // onClick={formik.handleSubmit}
                          type="submit"
                          disabled={
                            (remainingDays >= 0 &&
                            remainingTimeInSecs > 0 &&
                            isTokenGated
                              ? !isEligibleForTokenGating
                              : remainingDays >= 0 && remainingTimeInSecs > 0
                              ? false
                              : true) ||
                            Number(
                              convertFromWeiGovernance(
                                daoDetails.totalSupply,
                                6,
                              ),
                            ) <=
                              Number(
                                convertFromWeiGovernance(
                                  daoDetails.clubTokensMinted,
                                  daoDetails.decimals,
                                ) *
                                  convertFromWeiGovernance(
                                    daoDetails.pricePerToken,
                                    erc20TokenDetails.tokenDecimal,
                                  ),
                              ) ||
                            remainingClaimAmount <= 0
                          }>
                          Deposit
                        </Button>
                        <div>
                          {remainingClaimAmount <= 0 && (
                            <p style={{ color: "#D87070" }}>
                              You have reached maximum deposit limit!
                            </p>
                          )}
                        </div>
                      </Grid>
                    </Grid>
                  </form>
                </Card>
              ) : (
                <Card className={classes.cardJoin} height={"full"}>
                  <>
                    <Grid
                      flex
                      flexDirection="column"
                      container
                      justifyContent={"space-between"}
                      height={"100%"}>
                      <Grid margin={"25px"}>
                        <Typography className={classes.JoinText}>
                          {" "}
                          Join this station by depositing your funds{" "}
                        </Typography>
                      </Grid>
                      <Grid sx={{ display: "flex", flexDirection: "row" }}>
                        <Grid mt={"300px"} ml={4}>
                          <Button
                            variant="primary"
                            // onClick={handleConnectWallet}
                          >
                            Connect
                          </Button>
                        </Grid>
                        <Grid mt={"50px"}>
                          <CardMedia
                            image="/assets/images/joinstation.png"
                            component="img"
                            alt="ownership_share"
                            className={classes.media}
                          />
                        </Grid>
                      </Grid>
                    </Grid>
                  </>
                </Card>
              )}
            </Grid>
          </Grid>
        </>
      ) : (
        <>
          <Grid
            container
            spacing={6}
            paddingLeft={10}
            paddingTop={15}
            paddingRight={10}
            sx={{
              display: "flex",
              flexDirection: "column",
              height: "100vh",
              width: "100%",
              justifyContent: "center",
            }}>
            <Grid
              sx={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
              }}>
              <Typography variant="h5" color={"white"} fontWeight="bold">
                Please connect your wallet
              </Typography>
            </Grid>
          </Grid>
        </>
      )}
      {depositSuccessfull && showMessage ? (
        <Alert
          severity="success"
          sx={{
            width: "250px",
            position: "fixed",
            bottom: "30px",
            right: "20px",
            borderRadius: "8px",
          }}>
          Transaction Successfull
        </Alert>
      ) : (
        !depositSuccessfull &&
        showMessage && (
          <Alert
            severity="error"
            sx={{
              width: "250px",
              position: "fixed",
              bottom: "30px",
              right: "20px",
              borderRadius: "8px",
            }}>
            Transaction Failed
          </Alert>
        )
      )}

      {/* <Dialog
        // open={open}
        // onClose={handleDialogClose}
        scroll="body"
        PaperProps={{ classes: { root: classes.modalStyle } }}
        fullWidth
        maxWidth="lg"
      >
        <DialogContent sx={{ overflow: "hidden", backgroundColor: "#19274B" }}>
          <Grid
            container
            justifyContent="center"
            alignItems="center"
            direction="column"
            mt={3}
          >
            <Grid item pl={15}>
              <Image
                src="/assets/images/connected_world_wuay.svg"
                width="80%"
                alt="connected"
              />
            </Grid>
            <Grid item m={3}>
              <Typography className={classes.dialogBox}>
                You are in the wrong network, please switch to the correct
                network by clicking the button provided below
              </Typography>
            </Grid>
            <Grid item m={3}>
              <Button
                variant="primary"
                onClick={() => {
                  //   handleSwitchNetwork();
                }}
              >
                Switch Network
              </Button>
            </Grid>
          </Grid>
        </DialogContent>
      </Dialog> */}

      {WRONG_NETWORK && wallet && <WrongNetworkModal />}

      <Backdrop
        sx={{ color: "#fff", zIndex: (theme) => theme.zIndex.drawer + 1 }}
        open={loading}>
        <CircularProgress color="inherit" />
      </Backdrop>
    </>
  );
};

export default NewArchERC20;
