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
import Step2 from "./Step2";
import Step3 from "./Step3";
import { useFormik } from "formik";

const Create = () => {
  const steps = ["Add basic info", "Set token rules", "Governance"];

  const [activeStep, setActiveStep] = useState(0);
  const [completed, setCompleted] = useState({});

  const handleStep = (step) => () => {
    setActiveStep(step);
  };

  const getStepContent = (step) => {
    switch (step) {
      case 0:
        return (
          <>
            <Step1 />
          </>
        );
      case 1:
        return (
          <>
            <Step2 />
          </>
        );
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

  const handleNext = () => {
    setActiveStep((prevActiveStep) => prevActiveStep + 1);
  };

  const formikStep1 = useFormik({
    initialValues: {},
    // validationSchema: personalInfoValidationSchema,
    onSubmit: (values) => {
      handleNext();
    },
  });
  const formikStep2 = useFormik({
    initialValues: {},
    // validationSchema: personalInfoValidationSchema,
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
        formikStep2.handleSubmit();
        break;
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
                {getStepContent(activeStep)}
                <Fragment>
                  <Grid
                    container
                    wrap="nowrap"
                    spacing={0}
                    justify="center"
                    alignItems="center"
                    direction="row"
                  >
                    <Grid item xs={0} mt={2}></Grid>
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

                        onClick={handleSubmit}
                      >
                        Finish
                      </Button>
                    ) : (
                      <Button variant="wideButton" onClick={handleSubmit}>
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
