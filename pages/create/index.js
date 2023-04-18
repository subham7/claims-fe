import {
  Backdrop,
  Box,
  Button,
  Card,
  CircularProgress,
  Grid,
  Step,
  StepButton,
  Stepper,
  Typography,
} from "@mui/material";
import Layout2 from "../../src/components/layouts/layout2";
import ProtectRoute from "../../src/utils/auth";
import { Fragment, useState } from "react";
import Step1 from "./Step1";
import Step2 from "./ERC20Step2";
import Step3 from "./Step3";
import { useFormik } from "formik";
import { tokenType } from "../../src/data/create";
import * as yup from "yup";
import ERC20Step2 from "./ERC20Step2";
import NFTStep2 from "./NFTStep2";
import dayjs from "dayjs";
import Web3 from "web3";
import { useSelector, useDispatch } from "react-redux";
import { initiateConnection } from "../../src/utils/safe";
import {
  setCreateDaoAuthorized,
  setCreateSafeLoading,
} from "../../src/redux/reducers/gnosis";
import ErrorModal from "./ErrorModal";

const Create = () => {
  const steps = ["Add basic info", "Set token rules", "Governance"];
  const dispatch = useDispatch();
  const [activeStep, setActiveStep] = useState(0);
  const [completed, setCompleted] = useState({});
  const [open, setOpen] = useState(false);

  const USDC_CONTRACT_ADDRESS = useSelector((state) => {
    return state.gnosis.usdcContractAddress;
  });
  const GNOSIS_TRANSACTION_URL = useSelector((state) => {
    return state.gnosis.transactionUrl;
  });
  const setCreateSafeLoading = useSelector((state) => {
    return state.gnosis.setCreateSafeLoading;
  });

  const setCreateDaoAuthorized = useSelector((state) => {
    return state.gnosis.createDaoAuthorized;
  });
  const setCreateSafeError = useSelector((state) => {
    return state.gnosis.setCreateSafeError;
  });
  const setCreateSafeErrorCode = useSelector((state) => {
    return state.gnosis.setCreateSafeErrorCode;
  });

  const handleStep = (step) => () => {
    setActiveStep(step);
  };

  const handleNext = () => {
    setActiveStep((prevActiveStep) => prevActiveStep + 1);
  };

  const getStepContent = (step) => {
    switch (step) {
      case 0:
        return (
          <>
            <Step1 formik={formikStep1} />
          </>
        );
      case 1:
        if (
          formikStep1.values.clubTokenType === "Non Transferable ERC20 Token"
        ) {
          return (
            <>
              <ERC20Step2 formik={formikERC20Step2} />
            </>
          );
        } else {
          return (
            <>
              <NFTStep2 />
            </>
          );
        }

      case 2:
        return (
          <>
            <Step3 formik={formikStep3} />
          </>
        );

      default:
        return "Unknown step";
    }
  };

  const step1ValidationSchema = yup.object({
    clubName: yup
      .string("Enter club name")
      .min(2, "Name should be of minimum 2 characters length")
      .required("Club Name is required"),
    clubSymbol: yup
      .string("Enter club symbol")
      .required("Club Symbol is required"),
  });

  const ERC20Step2ValidationSchema = yup.object({
    depositClose: yup.date().required("deposit close date is required"),
    minDepositPerUser: yup.number().required("min deposit amount is required"),
    maxDepositPerUser: yup
      .number()
      .moreThan(
        yup.ref("minDepositPerUser"),
        "Amount should be greater than min deposit",
      )
      .required("min deposit amount is required"),
    totalRaiseAmount: yup.number().required("raise amount is required"),
    pricePerToken: yup.number().required("price per token is required"),
  });

  const step3ValidationSchema = yup.object({
    addressList: yup.array().of(
      yup
        .string()
        .matches(/^0x[a-zA-Z0-9]+/gm, " proper wallet address is required")
        .required("wallet address is required"),
    ),
  });

  const formikStep1 = useFormik({
    initialValues: {
      clubName: "",
      clubSymbol: "",
      clubTokenType: tokenType[0],
    },
    validationSchema: step1ValidationSchema,
    onSubmit: (values) => {
      console.log(values);
      handleNext();
    },
  });
  const formikERC20Step2 = useFormik({
    initialValues: {
      depositClose: dayjs(Date.now() + 300000),
      minDepositPerUser: "",
      maxDepositPerUser: "",
      totalRaiseAmount: "",
      pricePerToken: "",
    },
    validationSchema: ERC20Step2ValidationSchema,
    onSubmit: (values) => {
      handleNext();
    },
  });
  const formikStep3 = useFormik({
    initialValues: {
      governance: true,
      quorum: 1,
      threshold: 51,
      addressList: [],
    },
    validationSchema: step3ValidationSchema,
    onSubmit: (values) => {
      setOpen(true);
      if (formikStep1.values.clubTokenType === "NFT") {
        console.log("nft club create");
      } else {
        const web3 = new Web3(Web3.givenProvider);
        const auth = web3.eth.getAccounts();

        console.log(dayjs(formikERC20Step2.values.depositClose).unix());
        auth
          .then((result) => {
            const walletAddress = Web3.utils.toChecksumAddress(result[0]);
            values.addressList.unshift(walletAddress);
            // console.log(formikStep1.values.clubName);
            initiateConnection(
              dispatch,
              formikStep1.values.clubName,
              formikStep1.values.clubSymbol,
              formikERC20Step2.values.totalRaiseAmount /
                formikERC20Step2.values.pricePerToken,
              formikERC20Step2.values.pricePerToken,
              formikERC20Step2.values.minDepositPerUser,
              formikERC20Step2.values.maxDepositPerUser,
              0,
              dayjs(formikERC20Step2.values.depositClose).unix(),
              values.quorum,
              values.threshold,
              USDC_CONTRACT_ADDRESS,
              GNOSIS_TRANSACTION_URL,
              values.governance,
              true,
              false,
              "0x0000000000000000000000000000000000000000000000000000000000000001",
              values.addressList,
              formikStep1.values.clubTokenType,
              "0xd4efbacb48ba952201b75afecacb82048588e44f",
            );
          })
          .catch((error) => {
            // dispatch(setCreateSafeLoading(false));
            console.error(error);
          });
      }
      console.log(formikStep1.values.clubName);
      //   handleFormSubmit();
    },
  });

  const handleSubmit = () => {
    switch (activeStep) {
      case 0:
        formikStep1.handleSubmit();
        break;
      case 1:
        if (
          formikStep1.values.clubTokenType === "Non Transferable ERC20 Token"
        ) {
          formikERC20Step2.handleSubmit();
          break;
        } else {
          NFTformikStep2.handleSubmit();
          break;
        }

      case 2:
        formikStep3.handleSubmit();
        break;
    }
  };
  // console.log(addressList);
  return (
    <Layout2>
      <Grid
        container
        item
        paddingLeft={{ xs: 5, sm: 5, md: 10, lg: 45 }}
        paddingTop={15}
        paddingRight={{ xs: 5, sm: 5, md: 10, lg: 45 }}
        justifyContent="center"
        alignItems="center"
      >
        <Box
          width={{ xs: "60%", sm: "70%", md: "80%", lg: "100%" }}
          paddingTop={10}
        >
          <form noValidate autoComplete="off">
            <Stepper activeStep={activeStep}>
              {steps.map((label, index) => {
                return (
                  <Step key={label} completed={completed[index]}>
                    <StepButton color="inherit" onClick={handleStep(index)}>
                      {label}
                    </StepButton>
                  </Step>
                );
              })}
            </Stepper>
            {activeStep === steps.length - 1 && setCreateSafeLoading ? (
              <Backdrop
                sx={{
                  color: "#fff",
                  zIndex: (theme) => theme.zIndex.drawer + 1,
                  backgroundImage: "url(assets/images/gradients.png)",
                  backgroundPosition: "center center",
                }}
                open={open}
              >
                <Card>
                  <Grid
                    container
                    justifyContent="center"
                    alignItems="center"
                    sx={{ padding: "10px", width: "547px" }}
                    direction="column"
                  >
                    <Grid item>
                      <img src="assets/images/deployingsafe_img.svg" />
                    </Grid>
                    <Grid
                      item
                      paddingTop="20px"
                      justifyContent="left"
                      justifyItems="left"
                    >
                      <Typography variant="h4" sx={{ color: "#fff" }}>
                        Deploying a new safe
                      </Typography>
                    </Grid>
                    <Grid
                      item
                      paddingTop="20px"
                      justifyContent="left"
                      justifyItems="left"
                    >
                      <Typography variant="regularText4" sx={{ color: "#fff" }}>
                        Please sign & authorise StationX to deploy a new safe
                        for your station.
                      </Typography>
                    </Grid>
                    <Grid item paddingTop="30px">
                      <CircularProgress color="inherit" />
                    </Grid>
                  </Grid>
                </Card>
              </Backdrop>
            ) : activeStep === steps.length - 1 && setCreateDaoAuthorized ? (
              <Backdrop
                sx={{
                  color: "#fff",
                  zIndex: (theme) => theme.zIndex.drawer + 1,
                  backgroundImage: "url(assets/images/gradients.png)",
                  backgroundPosition: "center center",
                }}
                open={open}
              >
                <Card>
                  <Grid
                    container
                    justifyContent="center"
                    alignItems="center"
                    sx={{ padding: "10px", width: "547px" }}
                    direction="column"
                  >
                    <Grid item>
                      <img src="assets/images/settingup_img.svg" />
                    </Grid>
                    <Grid
                      item
                      paddingTop="20px"
                      justifyContent="left"
                      justifyItems="left"
                    >
                      <Typography variant="h4" sx={{ color: "#fff" }}>
                        Setting up your station
                      </Typography>
                    </Grid>
                    <Grid
                      item
                      paddingTop="20px"
                      justifyContent="left"
                      justifyItems="left"
                    >
                      <Typography variant="regularText4" sx={{ color: "#fff" }}>
                        Please sign to authorise StationX to deploy this station
                        for you.
                      </Typography>
                    </Grid>
                    <Grid item paddingTop="30px">
                      <CircularProgress color="inherit" />
                    </Grid>
                  </Grid>
                </Card>
              </Backdrop>
            ) : activeStep === steps.length - 1 && setCreateSafeError ? (
              <>
                {setCreateSafeErrorCode === 4001 ? (
                  <ErrorModal isSignRejected />
                ) : (
                  <ErrorModal isError />
                )}
              </>
            ) : (
              <>
                <Fragment>
                  <Grid
                    container
                    direction="row"
                    justifyContent="center"
                    alignItems="center"
                    mt={2}
                  >
                    {getStepContent(activeStep)}
                    {/* <Button
                      disabled={activeStep === 0}
                      onClick={handleBack}
                      className={classes.button}
                    >
                      Back
                    </Button> */}
                    {activeStep === steps.length - 1 ? (
                      <Button
                        variant="wideButton"
                        // disabled={!isStepValidated(activeStep) }
                        sx={{ marginTop: "2rem" }}
                        onClick={handleSubmit}
                      >
                        Finish
                      </Button>
                    ) : (
                      <Button
                        variant="wideButton"
                        sx={{ marginTop: "2rem" }}
                        onClick={handleSubmit}
                      >
                        Next
                      </Button>
                    )}
                  </Grid>
                </Fragment>
              </>
            )}
          </form>
        </Box>
      </Grid>
    </Layout2>
  );
};
export default ProtectRoute(Create);
