import { Box, Grid, Step, StepButton, Stepper } from "@mui/material";
import Layout2 from "../../src/components/layouts/layout2";
import ProtectRoute from "../../src/utils/auth";
import { useState } from "react";

const Create = () => {
  const steps = ["Add basic info", "Set token rules", "Governance"];

  const [activeStep, setActiveStep] = useState(0);
  const [completed, setCompleted] = useState({});

  const handleStep = (step) => () => {
    setActiveStep(step);
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
          </form>
        </Box>
      </Grid>
    </Layout2>
  );
};
export default ProtectRoute(Create);
