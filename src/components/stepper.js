import * as React from "react"
import Box from "@mui/material/Box"
import Stepper from "@mui/material/Stepper"
import Step from "@mui/material/Step"
import StepLabel from "@mui/material/StepLabel"
import Button from "@mui/material/Button"
import Typography from "@mui/material/Typography"
import { makeStyles } from "@mui/styles"

import Card from "../components/card"

const useStyles = makeStyles({
  large_button: {
    width: "31.25vw",
  },
  large_button_back: {
    fontWeight: "bold",
    width: "31.25vw",
    color: "#242424",
    backgroundColor:  "#F5F5F5",
  }
})

export default function HorizontalLinearStepper(props) {
  const classes = useStyles()
  const [activeStep, setActiveStep] = React.useState(0)
  const [skipped, setSkipped] = React.useState(new Set())
  const { steps, components, data } = props

  const isStepOptional = (step) => {
    return step === 1
  }

  const isStepSkipped = (step) => {
    return skipped.has(step)
  }

  const handleNext = () => {
    let newSkipped = skipped
    if (isStepSkipped(activeStep)) {
      newSkipped = new Set(newSkipped.values())
      newSkipped.delete(activeStep)
    }

    setActiveStep((prevActiveStep) => prevActiveStep + 1)
    setSkipped(newSkipped)
  }

  const handleBack = () => {
    setActiveStep((prevActiveStep) => prevActiveStep - 1)
  }

  const handleSkip = () => {
    if (!isStepOptional(activeStep)) {
      // You probably want to guard against something like this,
      // it should never occur unless someone's actively trying to break something.
      throw new Error("You can't skip a step that isn't optional.")
    }

    setActiveStep((prevActiveStep) => prevActiveStep + 1)
    setSkipped((prevSkipped) => {
      const newSkipped = new Set(prevSkipped.values())
      newSkipped.add(activeStep)
      return newSkipped
    })
  }

  const handleReset = () => {
    setActiveStep(0)
  }

  return (
    <Box sx={{ width: "60.260vw" }}>
      <Stepper activeStep={activeStep}>
        {steps.map((label, index) => {
          const stepProps = {}
          const labelProps = {}
          // if (isStepOptional(index)) {
          //   labelProps.optional = (
          //     <Typography variant="caption">Optional</Typography>
          //   )
          // }
          if (isStepSkipped(index)) {
            stepProps.completed = false
          }
          return (
            <Step key={label} {...stepProps}>
              <StepLabel {...labelProps}>{label}</StepLabel>
            </Step>
          )
        })}
      </Stepper>

      <Card>
        {activeStep === steps.length ? (
          <>
            <Typography sx={{ mt: 2, mb: 1 }}>
              All steps completed - you&apos;re finished
            </Typography>
            <Box sx={{ display: "flex", flexDirection: "row", pt: 2 }}>
              <Box sx={{ flex: "1 1 auto" }} />
              <Button className={classes.large_button} onClick={handleReset}>Reset</Button>
            </Box>
          </>
        ) : (
          <>
            {components[activeStep]}
              <Box sx={{ display: "flex", flexDirection: "row", pt: 2 }}>
                {activeStep === 0 ? null : (
                  <Button
                    className={classes.large_button_back}
                    disabled={activeStep === 0}
                    onClick={handleBack}
                    sx={{ mr: 1}}
                  >
                    Go Back
                  </Button>
                )}
                <Box sx={{ flex: "1 1 auto" }} />
                {/* {isStepOptional(activeStep) && (
                  <Button className={classes.large_button} color="inherit" onClick={handleSkip} sx={{ mr: 1 }}>
                    Skip
                  </Button>
                )} */}
                {(activeStep === 0 && data['clubname'] || data['clubsymbol'] !== null) || (activeStep === 1 && data['raiseamount'] && data['maxcontribution'] && data['mandatoryproposal'] && data['voteforquorum'] && data['depositclose'], data['mincontribution'] && data['voteinfavour'] !== null ) ? (
                  <Button
                    className={classes.large_button}
                    variant="contained"
                    onClick={handleNext}
                  >
                    Next
                  </Button>
                ) : (
                  <Button
                    className={classes.large_button}
                    variant="contained"
                    // disabled
                    disabled={!data['clubname'] || !data['clubsymbol']}
                    onClick={handleNext}
                  >
                    Next
                  </Button>
                )}

                {/* <Button className={classes.large_button} onClick={handleNext} >
                  {activeStep === steps.length - 1 ? "Perfect, let's get started!" : "Next"}
                </Button> */}
              </Box>
          </>
        )}
      </Card>
    </Box>
  )
}
