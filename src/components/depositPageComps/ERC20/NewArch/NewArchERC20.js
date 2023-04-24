import React, { useCallback, useEffect, useState } from "react";
import {
  Backdrop,
  Button,
  Card,
  CardMedia,
  CircularProgress,
  Dialog,
  DialogContent,
  Divider,
  Grid,
  Input,
  Skeleton,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import { TwitterShareButton } from "react-twitter-embed";
import { NewArchERC20Styles } from "./NewArchERC20Styles";
import { useConnectWallet } from "@web3-onboard/react";
import { SmartContract } from "../../../../api/contract";
import Image from "next/image";
import erc20DaoContractABI from "../../../../abis/newArch/erc20Dao.json";
import factoryContractABI from "../../../../abis/newArch/factoryContract.json";

import erc20ABI from "../../../../abis/usdcTokenContract.json";
import Web3 from "web3";
import {
  convertFromWeiGovernance,
  convertToWeiGovernance,
} from "../../../../utils/globalFunctions";
import { Form, useFormik } from "formik";
import * as yup from "yup";
import { NEW_FACTORY_ADDRESS } from "../../../../api";

const NewArchERC20 = ({ daoDetails, erc20DaoAddress }) => {
  const [erc20TokenDetails, setErc20TokenDetails] = useState({
    tokenSymbol: "",
    tokenBalance: 0,
    tokenName: "",
    tokenDecimal: 0,
  });
  const classes = NewArchERC20Styles();
  const [{ wallet }] = useConnectWallet();

  let walletAddress;
  if (typeof window !== "undefined") {
    const web3 = new Web3(window.web3);
    walletAddress = web3.utils.toChecksumAddress(wallet?.accounts[0].address);
  }

  const day = Math.floor(new Date().getTime() / 1000.0);
  const remainingDays = daoDetails.depositDeadline - day;

  const fetchTokenDetails = useCallback(async () => {
    try {
      const erc20Contract = new SmartContract(
        erc20ABI,
        daoDetails.depositTokenAddress,
        walletAddress,
        undefined,
        undefined,
      );

      const balanceOfToken = await erc20Contract.balanceOf();
      const decimals = await erc20Contract.decimals();
      const symbol = await erc20Contract.obtainSymbol();
      const name = await erc20Contract.name();

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
    } catch (error) {
      console.log(error);
    }
  }, [daoDetails.depositTokenAddress, walletAddress]);

  const formik = useFormik({
    initialValues: {
      tokenInput: 0,
    },
    validationSchema: yup.object().shape({
      tokenInput: yup
        .number()
        .required("Input is required")
        .min(
          +daoDetails.minDeposit,
          "Amount should be greater than min deposit",
        )
        .max(+daoDetails.maxDeposit, "Amount should be less than max deposit"),
    }),
    onSubmit: async (values) => {
      try {
        const factoryContract = new SmartContract(
          factoryContractABI,
          NEW_FACTORY_ADDRESS,
          walletAddress,
          undefined,
          undefined,
        );

        const erc20Contract = new SmartContract(
          erc20ABI,
          daoDetails.depositTokenAddress,
          walletAddress,
          undefined,
          undefined,
        );

        await erc20Contract.approveDeposit(
          NEW_FACTORY_ADDRESS,
          values.tokenInput,
          erc20TokenDetails.tokenDecimal,
        );

        const deposit = await factoryContract.buyGovernanceTokenERC20DAO(
          walletAddress,
          erc20DaoAddress,
          daoDetails.depositTokenAddress,
          convertToWeiGovernance(
            values.tokenInput,
            erc20TokenDetails.tokenDecimal,
          ),
          [],
        );

        console.log(deposit);
      } catch (error) {
        console.log(error);
      }
    },
  });

  useEffect(() => {
    fetchTokenDetails();
  }, [fetchTokenDetails]);

  return (
    <>
      {wallet !== null ? (
        <>
          <Grid
            container
            spacing={2}
            paddingLeft={10}
            paddingTop={15}
            paddingRight={10}
          >
            <Grid item md={7}>
              <Card className={classes.cardRegular}>
                <Grid container>
                  <Grid item xs={12} md={9}>
                    <Grid container spacing={2}>
                      <Grid item mt={3} ml={3}>
                        {/* <img
                          src={imageFetched ? imageUrl : null}
                          alt="club-image"
                          width="100vw"
                        /> */}
                      </Grid>
                      <Grid item ml={1} mt={4} mb={7}>
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
                    sx={{ display: "flex", alignItems: "center" }}
                  >
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
                          //   url={`https://test.stationx.network/join/${daoAddress}`}
                        />
                      </div>
                    </div>
                  </Grid>
                </Grid>
                {/* <Grid>
                  {tokenGatingAddress !==
                    "0x0000000000000000000000000000000000000000" && (
                    <>
                      {userTokenBalance < tokenGatingAmount ||
                      isNaN(userTokenBalance) ? (
                        <Typography sx={{ color: "red" }}>
                          This club is Token Gated. You don&apos;t qualify
                        </Typography>
                      ) : (
                        <Typography sx={{ color: "#3B7AFD" }}>
                          This club is Token Gated. You qualify
                        </Typography>
                      )}
                    </>
                  )}
                </Grid> */}

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
                      <Grid item ml={1}>
                        {walletAddress ? (
                          daoDetails ? (
                            remainingDays > 0 ? (
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
                    <Grid container>
                      <Grid item>
                        <Typography
                          variant="p"
                          className={classes.valuesDimStyle}
                        >
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
                            `${daoDetails.minDeposit} ${erc20TokenDetails.tokenSymbol}`
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
                          className={classes.valuesDimStyle}
                        >
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
                            `${daoDetails.maxDeposit} ${erc20TokenDetails.tokenSymbol}`
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
                        className={classes.valuesDimStyle}
                      >
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
                        {daoDetails.isGovernance ? (
                          "By Voting"
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
                  <Grid item ml={5} md={3}>
                    <Grid container direction="column">
                      <Grid item>
                        <Typography
                          variant="p"
                          className={classes.valuesDimStyle}
                        >
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
                          {/* {walletConnected ? (
                            members
                          ) : (
                            <Skeleton
                              variant="rectangular"
                              width={100}
                              height={25}
                            />
                          )} */}
                        </Typography>
                      </Grid>
                    </Grid>
                  </Grid>
                </Grid>
                {/* <Grid item ml={3} mt={5} mb={2} mr={3}>
          {walletConnected ? (
            <ProgressBar
              value={
                governorDataFetched
                  ? calculateTreasuryTargetShare(
                      clubTokenMinted,
                      convertAmountToWei(governorDetails[4]),
                    )
                  : 0
              }
            />
          ) : (
            <Skeleton variant="rectangular" />
          )}
        </Grid> */}
                <br />
                <Grid
                  container
                  spacing={2}
                  direction="row"
                  justifyContent="space-between"
                  alignItems="center"
                >
                  <Grid item ml={4} mt={1} mb={2} md={8}>
                    <Grid container direction="column" spacing={2}>
                      <Grid item>
                        <Typography
                          variant="p"
                          className={classes.valuesDimStyle}
                        >
                          {walletAddress ? (
                            "Club Tokens Minted so far"
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
                          {/* {walletConnected ? (
                            parseInt(clubTokenMinted) + " $" + tokenSymbol
                          ) : (
                            <Skeleton
                              variant="rectangular"
                              width={100}
                              height={25}
                            />
                          )} */}
                        </Typography>
                      </Grid>
                    </Grid>
                  </Grid>
                  <Grid item mt={1} mb={2} mr={3} direction="row">
                    <Grid container direction="column" spacing={2}>
                      <Grid item>
                        <Typography
                          variant="p"
                          className={classes.valuesDimStyle}
                        >
                          {walletAddress ? (
                            "Total Supply"
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
                            daoDetails.totalSupply +
                            (" $" + daoDetails.daoSymbol)
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
                  <Grid container spacing={2}>
                    <Grid
                      item
                      ml={2}
                      mt={4}
                      mb={4}
                      className={classes.JoinText}
                    >
                      <Typography variant="h4">Join this Club</Typography>
                    </Grid>
                    <Divider />
                    <Grid
                      item
                      ml={1}
                      mt={4}
                      mb={4}
                      mr={2}
                      xs
                      sx={{ display: "flex", justifyContent: "flex-end" }}
                    >
                      <Typography variant="h6" className={classes.JoinText}>
                        {daoDetails.depositDeadline
                          ? remainingDays > 0
                            ? "Closes in " + remainingDays + " days"
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
                            }}
                          >
                            <Typography className={classes.cardSmallFont}>
                              Balance:{" "}
                              {erc20TokenDetails.tokenBalance.toFixed(2)} $
                              {erc20TokenDetails.tokenSymbol}
                            </Typography>
                          </Grid>
                        </Grid>
                        <Grid container spacing={2}>
                          <Grid item ml={2} mt={1} mb={2} p={1}>
                            <form onSubmit={formik.handleSubmit}>
                              <TextField
                                className={classes.cardLargeFont}
                                type="number"
                                name="tokenInput"
                                id="tokenInput"
                                disabled={remainingDays > 0 ? false : true}
                                inputProps={{ style: { fontSize: "1em" } }}
                                InputLabelProps={{ style: { fontSize: "1em" } }}
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
                            </form>

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
                            }}
                          >
                            <Button
                              className={classes.maxTag}
                              //   onClick={handleMaxButtonClick}
                            >
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
                          Clubs can have same names or symbols, please make sure
                          to trust the sender for the link before depositing.
                        </Typography>
                      </Card>
                    </Grid>
                    <Grid item container ml={1} mt={1} mb={1}>
                      <Button
                        variant="primary"
                        size="large"
                        onClick={formik.handleSubmit}
                        // disabled={
                        //   (closingDays > 0 ? false : true) ||
                        //   (depositAmount <= 0 ||
                        //   depositAmount < minDeposit ||
                        //   depositAmount > maxDeposit
                        //     ? true
                        //     : false) ||
                        //   (tokenGatingAddress !==
                        //     "0x0000000000000000000000000000000000000000" &&
                        //     (userTokenBalance < tokenGatingAmount ||
                        //       isNaN(userTokenBalance)))
                        // }
                      >
                        Deposit
                      </Button>
                    </Grid>
                  </Grid>
                </Card>
              ) : (
                <Card className={classes.cardJoin} height={"full"}>
                  <>
                    <Grid
                      flex
                      flexDirection="column"
                      container
                      justifyContent={"space-between"}
                      height={"100%"}
                    >
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
            }}
          >
            <Grid
              sx={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              <Typography variant="h5" color={"white"} fontWeight="bold">
                Please connect your wallet
              </Typography>
            </Grid>
          </Grid>
        </>
      )}
      {/* 
  <Snackbar
    open={openSnackBar}
    autoHideDuration={6000}
    onClose={handleClose}
    anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
  >
    {alertStatus === "success" ? (
      <Alert
        onClose={handleClose}
        severity="success"
        sx={{ width: "100%" }}
      >
        Transaction Successfull!
      </Alert>
    ) : (
      <Alert
        onClose={handleClose}
        severity="error"
        sx={{ width: "100%" }}
      >
        Transaction Failed!
      </Alert>
    )}
  </Snackbar> */}
      <Dialog
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
      </Dialog>
      <Backdrop
        sx={{ color: "#fff", zIndex: (theme) => theme.zIndex.drawer + 1 }}
        // open={depositInitiated}
      >
        <CircularProgress color="inherit" />
      </Backdrop>
    </>
  );
};

export default NewArchERC20;
