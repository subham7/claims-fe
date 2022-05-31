import * as React from "react"
import Box from "@mui/material/Box"
import Stepper from "@mui/material/Stepper"
import Step from "@mui/material/Step"
import StepLabel from "@mui/material/StepLabel"
import Button from "@mui/material/Button"
import Typography from "@mui/material/Typography"
import Backdrop from '@mui/material/Backdrop';
import CircularProgress from '@mui/material/CircularProgress'; 
import Grid from '@mui/material/Grid';
import { makeStyles } from "@mui/styles"
import Card from "../components/card"
import { useDispatch } from "react-redux"
import { initiateConnection } from "../utils/safe"
import {
  addClubName,
  addClubsymbol,
  addDisplayImage,
  addRaiseAmount,
  addMaxContribution,
  addMandatoryProposal,
  addVoteForQuorum,
  addDepositClose,
  addMinContribution,
  addVoteInFavour
} from "../redux/reducers/create"

const useStyles = makeStyles({
  large_button: {
    width: "31.25vw",
  },
  large_button_back: {
    fontWeight: "bold",
    width: "31.25vw",
    color: "#242424",
    backgroundColor: "#F5F5F5",
  }
})

export default function HorizontalLinearStepper(props) {
  const classes = useStyles()
  const [activeStep, setActiveStep] = React.useState(0)
  const [skipped, setSkipped] = React.useState(new Set())
  const { steps, components, data, handleLoading } = props
  const dispatch = useDispatch()
  const [loading, setLoading] = React.useState(false)
  const [open, setOpen] = React.useState(false)


  const isStepOptional = (step) => {
    return step === 1
  }

  const isStepSkipped = (step) => {
    return skipped.has(step)
  }

  const handleNext = () => {
    setOpen(true)
    let newSkipped = skipped
    if (isStepSkipped(activeStep)) {
      newSkipped = new Set(newSkipped.values())
      newSkipped.delete(activeStep)
    }
    if (activeStep === steps.length - 1) {
      
      const owners = ["0x557093F38f874b07ac5993768FA640Ea22A49D0D", "0x2f05FadE3F3030b387eCA20f7f7d5f5b12B8Dc06"]
      const threshold = 2
      initiateConnection(
        owners,
        threshold,
        dispatch,
        data.clubname,
        data.clubsymbol,
        data.raiseamount,
        data.mincontribution,
        data.maxcontribution,
        0,
        data.depositclose,
        0,
        data.voteforquorum,
        data.voteinfavour
      )
      .then((result) => {
        setLoading(false)
      })
      .catch((error) => {
        setLoading(true)
      })
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

  const handlePageLoading = () => {
    handleLoading
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
          <Grid container md={12}>
            <Grid item>
            <Typography variant="h3" >Please wait while we are processing your request</Typography>
            </Grid>
          </Grid>
            <Backdrop
              sx={{ color: '#fff', zIndex: (theme) => theme.zIndex.drawer + 1 }}
              open={open}
            >
            <CircularProgress color="inherit" />
          </Backdrop>
          </>
        ) : (
          <>
            {components[activeStep]}
            <Box sx={{ display: "flex", flexDirection: "row", pt: 2 }}>
              {activeStep === 0 ? <></> : (
                <Button
                  className={classes.large_button_back}
                  disabled={activeStep === 0}
                  onClick={handleBack}
                  sx={{ mr: 1 }}
                >
                  Go Back
                </Button>
              )}
              <Box sx={{ flex: "1 1 auto" }} />
              <Button
                className={classes.large_button}
                variant="contained"
                disabled={activeStep === 0 ? !data['clubname'] || !data['clubsymbol'] : activeStep === 1 ? !data['raiseamount'] || !data['maxcontribution'] || !data['mandatoryproposal'] || !data['voteforquorum'] || !data['depositclose'] || !data['mincontribution'] || !data['voteinfavour'] : activeStep === 2 ? false : true}
                onClick={handleNext}
              >
                {activeStep === steps.length - 1 ? "Perfect, let's get started!" : "Next"}
              </Button>
            </Box>
          </>
        )}
      </Card>
    </Box>
  )
}
