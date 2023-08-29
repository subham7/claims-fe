import * as React from "react";
import Box from "@mui/material/Box";
import Stepper from "@mui/material/Stepper";
import Step from "@mui/material/Step";
import StepLabel from "@mui/material/StepLabel";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";

const steps = [
  {
    label: "Choose token & duration",
  },
  {
    label: "Add conditions",
  },
  {
    label: "Review & Confirm",
  },
];

const StepperComp = ({ handleNext, handleBack, activeStep }) => {
  return (
    <Box sx={{ maxWidth: 400, marginTop: "20px" }}>
      <Stepper activeStep={activeStep} orientation="vertical">
        {steps.map((step, index) => (
          <Step key={step.label}>
            <StepLabel>
              <Typography>{step.label}</Typography>
            </StepLabel>
          </Step>
        ))}
      </Stepper>

      <Button onClick={handleNext}>Next</Button>
    </Box>
  );
};

export default StepperComp;
