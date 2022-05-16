import { React, useRef, onChange, useState } from "react"
import { makeStyles } from "@mui/styles"

import { Grid, Typography, TextField, Card, Switch, FormControlLabel, Box, Stack, Divider } from "@mui/material"
import { DesktopDatePicker } from '@mui/x-date-pickers'
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider'
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns'
import styled from "@emotion/styled"


import Layout2 from "../../src/components/layouts/layout2"
import Stepper from "../../src/components/stepper"
import CustomRoundedCard from "../../src/components/roundcard"
import CustomCard from "../../src/components/card"
import CustomSlider from "../../src/components/slider"

const useStyles = makeStyles({
  textField: {
    width: "100%",
    margin: "16px 0 25px 0",
    fontSize: "18px",
  },
  image: {
    width: "22.9vw",
    height: "61.8vh",
    borderRadius: "20px"
  },
  largeText: {
    fontSize: "18px",
  },
  smallText : {
    fontSize: "14px",
  },
  cardWarning: {
    backgroundColor: "#FFB74D0D",
    borderRadius: "10px",
    opacity: 1,
  },
  textWarning: {
    textAlign: "left",
    color: "#FFB74D",
    fontSize: "14px",
  },
  cardRegular: {
    backgroundColor: "#EFEFEF0D",
    borderRadius: "10px",
    opacity: 1,
  },
  finserveImage: {
    width: "4.01vw",
    height: "8.13vh",
  },
  boldText: {
    fontWeight: "bold",
  }
})

export default function Create(props) {
  const classes = useStyles()
  const uploadInputRef = useRef(null);
  const [value, setValue] = useState(null);
  const [clubName, setClubName] = useState(null);
  const [clubSymbol, setClubSymbol] = useState(null);
  const [displayImage, setDisplayImage] = useState(null);
  const [raiseAmount, setRaiseAmount] = useState(null);
  const [maxContribution, setMaxContribution] = useState(null);
  const [mandatoryProposal, setMandatoryProposal] = useState(false);
  const [voteForQuorum, setVoteForQuorum] = useState(null);
  const [depositClose, setDepositClose] = useState(null);
  const [minContribution, setMinContribution] = useState(null);
  const [voteInFavour, setVoteInFavour] = useState(null);

  const handleChange = (newValue) => {
    setValue(newValue);
  };

  const handleStepOneChange = (event) => {
    setClubName(event.target.value);
    setClubSymbol(event.target.value);
    setDisplayImage(event.target.value);
  };

  const handleStepTwoChange = (event) => {
    setRaiseAmount(event.target.value);
    setMaxContribution(event.target.value);
    setMandatoryProposal(event.target.value);
    setVoteForQuorum(event.target.value);
    setDepositClose(event.target.value);
    setMinContribution(event.target.value);
    setVoteInFavour(event.target.value);
  };
  

  const steps = ["Add basic info", "Set club rules", "Final step"]

  const step1 = () => {
    return (
      <>
        <Grid container spacing={2}>
          <Grid item md={6}>
            <img className={classes.image} src="/assets/images/hands.png" alt="token-hands" />
          </Grid>
          <Grid item md={6}>
            <Typography className={classes.largeText} variant="p">What should we call your club?</Typography>
            <br />
            <TextField
              className={classes.textField}
              label="Club name"
              variant="outlined"
            />
            <Typography className={classes.largeText} variant="p">Enter club token symbol</Typography>
            <br />
            <TextField
              className={classes.textField}
              label="Club symbol"
              variant="outlined"
            />
            <br />
            <Grid container wrap="nowrap" spacing={4}>
              <Grid item xs={3}>
                <input ref={uploadInputRef} type="file" accept="image/*" id="file" name="file" hidden onChange={onChange} />
                <div onClick={() => uploadInputRef.current && uploadInputRef.current.click()}>
                  <CustomRoundedCard  />
                </div>
              </Grid>
              <Grid item xs={9}>
                <Grid container spacing={2}>
                  <Grid item xs={12}>
                    <Typography className={classes.largeText} variant="p">
                      Upload a display picture (Not mandatory)
                    </Typography>
                  </Grid>
                  <Grid item xs={10}>
                    <Typography className={classes.smallText}>
                      Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor.
                    </Typography>
                  </Grid>
                </Grid>
              </Grid>
            </Grid>
            <br />
            <Grid container>
              <Card className={classes.cardWarning}>
                <Typography className={classes.textWarning} variant="p">
                  This info is public on the blockchain. This can not be changed later, please choose a name accordingly.
                </Typography>
              </Card>
            </Grid>           
          </Grid>
        </Grid>
      </>
    )
  }

  const step2 = () => {
    return (
    <>
      <Grid container spacing={6}>
        <Grid item md={6}>
          <Stack spacing={3}>
            <Typography className={classes.largeText} variant="p">
              Club raise amount (in USDC)
            </Typography>
            <TextField
                className={classes.textField}
                label="Amount (USDC)"
                variant="outlined"
              />
              <Typography className={classes.largeText} variant="p">
                Maximum contribution per person
              </Typography>
              <TextField
                  className={classes.textField}
                  label="Max. amount (USDC)"
                  variant="outlined"
                />
              <FormControlLabel control={<Switch />} label="Make proposals mandatory" />
              <Typography className={classes.largeText} variant="h">
                Quorum
              </Typography>
              <Typography className={classes.largeText} variant="p">
                Percentage of total members who must vote for a proposal to meet quorum:*
              </Typography>
              <Box pt={2}>
                <CustomSlider />
              </Box>
          </Stack>
        </Grid>
        <Grid item md={6}>
          <Stack spacing={3}>
            <LocalizationProvider dateAdapter={AdapterDateFns}>
            <Typography className={classes.largeText} variant="p">
              When will the deposits close?
            </Typography>
            <DesktopDatePicker
              className={classes.textField}
              inputFormat="dd/MM/yyyy"
              value={value}
              onChange={handleChange}
              renderInput={(params) => <TextField {...params} />}
            />
            </LocalizationProvider>
            <br />
            <Typography className={classes.largeText} variant="p">
              Minimum contribution per person
            </Typography>
            <TextField
              className={classes.textField}
              label="Min. amount (USDC)"
              variant="outlined"
            />
          </Stack>
          <Box pt={14}>
            <Stack spacing={5}>
              <Typography className={classes.largeText} variant="p">
                Percentage of total members who must vote in favour for a proposal to pass:*
              </Typography>
              <CustomSlider />
            </Stack>
          </Box>
        </Grid>
        <Grid item md={12}>
          <Card className={classes.cardRegular}>
            <Typography variant="p">
              Proposals once made mandatory can not be changed once club is created. However, it is possible to make changes in the quorum (or) voting structure even after the club is created.
            </Typography>
          </Card>
          </Grid>
      </Grid>
    </>)
  }

  const step3 = () => {
    return (
      <>
      <Grid container spacing={4}>
        <Grid item md={12}>
          <Typography variant="h5" m={3}>
            Review details & confirm
          </Typography>
          <Divider variant="middle"/>
        </Grid>
      </Grid>
      <Grid container spacing={2}>
        <Grid item mt={3} ml={3}>
          <img className={classes.finserveImage} src="/assets/images/finserv_icon@2x.png" alt="finserve" />
        </Grid>
        <Grid item ml={4} mt={4}>
          <Stack spacing={1}>
          <Typography variant="h5">
            DEMO Club
          </Typography>
          <Typography variant="p"> 1 USDC = 1 DEMO</Typography>
          </Stack>
        </Grid>
      </Grid>
      <Grid container spacing={2}>
        <Grid item md={6}>
          <Stack spacing={2} alignItems="stretch">
            <Typography variant="p">
              Club raise amount (in USDC)
            </Typography>
            <Typography className={classes.boldText} variant="h5">
              100,000 USDC
            </Typography>
            <Typography variant="p">
              Minimum contribution per person
            </Typography>
            <Typography className={classes.boldText} variant="h5">
              500 USDC
            </Typography>
            <Typography variant="p">
              Maximum contribution per person
            </Typography>
            <Typography className={classes.boldText} variant="h5">
              1000 USDC
            </Typography>
          </Stack>
        </Grid>
        <Grid item md={6}>
          <Stack spacing={2} alignItems="stretch">
            <Typography variant="p">
              When will the deposits close?
            </Typography>
            <Typography className={classes.boldText} variant="h5">
              12/04/2022
            </Typography>
            <Typography variant="p">
              Minimum votes needed to validate proposal
            </Typography>
            <Typography className={classes.boldText} variant="h5">
              35%
            </Typography>
            <Typography variant="p">
              Minimum ‘yes’ votes needed to pass a proposal
            </Typography>
            <Typography className={classes.boldText} variant="h5">
              51%
            </Typography>
          </Stack>        
        </Grid>
      </Grid>

      </>
    )
  }

  return (
    <Layout2>
      <Stepper steps={steps} components={[step1(), step2(), step3()]} />
    </Layout2>
  )
}
