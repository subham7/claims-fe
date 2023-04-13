import {
  Box,
  Button,
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

const Create = () => {
  const steps = ["Add basic info", "Set token rules", "Governance"];

  const [activeStep, setActiveStep] = useState(0);
  const [completed, setCompleted] = useState({});

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
            <Step3 />
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

  const formikStep1 = useFormik({
    initialValues: {
      clubName: "fgf",
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
    initialValues: {},
    // validationSchema: personalInfoValidationSchema,
    onSubmit: (values) => {
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
            {activeStep === steps.length ? (
              <Typography className={classes.instructions}>
                All steps completed - you&apos;re finished
              </Typography>
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
                        mt={2}
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
