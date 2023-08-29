import { Divider, Typography } from "@mui/material";
import React from "react";
import StepperComp from "./StepperComp";
import classes from "./createDropsStyling/CreateDrop.module.scss";
import DropStep1 from "./DropStep1";

const CreateDrop = () => {
  const [activeStep, setActiveStep] = React.useState(0);

  const handleNext = () => {
    setActiveStep((prevActiveStep) => prevActiveStep + 1);
  };

  const handleBack = () => {
    setActiveStep((prevActiveStep) => prevActiveStep - 1);
  };

  return (
    <div className={classes.container}>
      {/* Left Stepper */}
      <div className={classes.stepperContainer}>
        <Typography mb={3} color="textPrimary" variant="h6">
          Create a drop
        </Typography>
        <Divider color="#2E2E2E" />
        <StepperComp
          activeStep={activeStep}
          handleBack={handleBack}
          handleNext={handleNext}
        />
      </div>
      {/* Form */}
      <div className={classes.formContainer}>
        <DropStep1 handleNext={handleNext} />
      </div>
    </div>
  );
};

export default CreateDrop;
