import { Box, Button, Grid, Step, StepButton, Stepper } from "@mui/material";
import Layout2 from "../../src/components/layouts/layout2";
import ProtectRoute from "../../src/utils/auth";
import { Fragment, useState } from "react";
import Step1 from "../../src/components/createClubComps/Step1";
import Step3 from "../../src/components/createClubComps/Step3";
import { useFormik } from "formik";
import { tokenType } from "../../src/data/create";
import ERC20Step2 from "../../src/components/createClubComps/ERC20Step2";
import NFTStep2 from "./NFTStep2";
import dayjs from "dayjs";
import Web3 from "web3";
import { useSelector, useDispatch } from "react-redux";
import { initiateConnection } from "../../src/utils/safe";
import ErrorModal from "../../src/components/createClubComps/ErrorModal";
import SafeDepositLoadingModal from "../../src/components/createClubComps/SafeDepositLoadingModal";
import {
  ERC20Step2ValidationSchema,
  step1ValidationSchema,
  step3ValidationSchema,
} from "../../src/components/createClubComps/ValidationSchemas";

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
        return <Step1 formik={formikStep1} />;
      case 1:
        if (
          formikStep1.values.clubTokenType === "Non Transferable ERC20 Token"
        ) {
          return <ERC20Step2 formik={formikERC20Step2} />;
        } else {
          return <NFTStep2 />;
        }
      case 2:
        return <Step3 formik={formikStep3} />;
      default:
        return "Unknown step";
    }
  };

  const formikStep1 = useFormik({
    initialValues: {
      clubName: "",
      clubSymbol: "",
      clubTokenType: tokenType[0],
    },
    validationSchema: step1ValidationSchema,
    onSubmit: (values) => {
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
        auth
          .then((result) => {
            const walletAddress = Web3.utils.toChecksumAddress(result[0]);
            values.addressList.unshift(walletAddress);
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
          // NFTformikStep2.handleSubmit();
          break;
        }

      case 2:
        formikStep3.handleSubmit();
        break;
    }
  };
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
              <SafeDepositLoadingModal
                open={open}
                title=" Deploying a new safe"
                description=" Please sign & authorise StationX to deploy a new safe for your
                station."
              />
            ) : activeStep === steps.length - 1 && setCreateDaoAuthorized ? (
              <SafeDepositLoadingModal
                open={open}
                title="Setting up your station"
                description="Please sign to authorise StationX to deploy this station
              for you."
              />
            ) : activeStep === steps.length - 1 && setCreateSafeError ? (
              <>
                {setCreateSafeErrorCode === 4001 ? (
                  <ErrorModal isSignRejected />
                ) : (
                  <ErrorModal isError />
                )}
              </>
            ) : (
              <Fragment>
                <Grid
                  container
                  direction="row"
                  justifyContent="center"
                  alignItems="center"
                  mt={2}
                >
                  {getStepContent(activeStep)}
                  {activeStep === steps.length - 1 ? (
                    <Button
                      variant="wideButton"
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
            )}
          </form>
        </Box>
      </Grid>
    </Layout2>
  );
};
export default ProtectRoute(Create);
