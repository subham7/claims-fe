import { React, useRef, onChange, useState } from "react"
import { makeStyles } from "@mui/styles"

import { Grid, Typography, TextField, Card, Switch, FormControlLabel, Box, Stack, Divider } from "@mui/material"
import { DesktopDatePicker } from '@mui/x-date-pickers'
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider'
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns'
import styled from "@emotion/styled"


import Layout2 from "../../src/components/layouts/layout2"
import HorizontalLinearStepper from "../../src/components/stepper"
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
    borderRadius: "100%"
  },
  boldText: {
    fontWeight: "bold",
  },
  uploadImage: {
    width: "27px",
    height: "27px"
  }
})

export default function Create(props) {
  const classes = useStyles()
  const uploadInputRef = useRef(null);
  const [value, setValue] = useState(null);
  const [clubName, setClubName] = useState(null);
  const [clubSymbol, setClubSymbol] = useState(null);
  const [displayImage, setDisplayImage] = useState(null);
  const [raiseAmount, setRaiseAmount] = useState(0);
  const [maxContribution, setMaxContribution] = useState(0);
  const [mandatoryProposal, setMandatoryProposal] = useState(false);
  const [voteForQuorum, setVoteForQuorum] = useState(0);
  const [depositClose, setDepositClose] = useState(new Date());
  const [minContribution, setMinContribution] = useState(0);
  const [voteInFavour, setVoteInFavour] = useState(0);

  const handleChange = (newValue) => {
    setValue(newValue);
    setDepositClose(newValue);
  };

  const onSetVoteForQuorum = (event, newValue) => {
    setVoteForQuorum(newValue);
  };

  const onSetVoteOnFavourChange = (event, newValue) => {
    setVoteInFavour(newValue);
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
              error={clubName === ""}
              className={classes.textField}
              label="Club name"
              variant="outlined"
              onChange={(e) => setClubName(e.target.value)}
              value={clubName}
            />
            <Typography className={classes.largeText} variant="p">Enter club token symbol</Typography>
            <br />
            <TextField
              error={clubSymbol === ""}
              className={classes.textField}
              label="Club symbol"
              variant="outlined"
              onChange={(e) => setClubSymbol(e.target.value)}
              value={clubSymbol}
            />
            <br />
            <Grid container wrap="nowrap" spacing={0} justify="center" alignItems="center" direction="row">
              <Grid item xs={0}>
                <input ref={uploadInputRef} type="file" accept="image/*" id="file" name="file" hidden onChange={(e) => setDisplayImage(URL.createObjectURL(e.target.files[0]))} />
              </Grid>
              <Grid item xs={3}>
                <div onClick={() => uploadInputRef.current && uploadInputRef.current.click()}>
                  <CustomRoundedCard>
                    <img className={classes.uploadImage} src="/assets/icons/upload.png" alt="upload-image" />
                  </CustomRoundedCard>
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
                error={!(raiseAmount >= 0 || raiseAmount % 1 === 0)}
                className={classes.textField}
                label="Amount (USDC)"
                variant="outlined"
                onChange={(e) => setRaiseAmount(e.target.value)}
                value={raiseAmount}
              />
              <Typography className={classes.largeText} variant="p">
                Maximum contribution per person
              </Typography>
              <TextField
                error={!(maxContribution >= 0 || maxContribution % 1 === 0)}
                className={classes.textField}
                label="Max. amount (USDC)"
                variant="outlined"
                onChange={(e) => setMaxContribution(e.target.value)}
                value={maxContribution}
              />
              <FormControlLabel control={<Switch />} onChange={(e) => setMandatoryProposal(e.target.value)} value={mandatoryProposal} label="Make proposals mandatory" />
              <Typography className={classes.largeText} variant="h">
                Quorum
              </Typography>
              <Typography className={classes.largeText} variant="p">
                Percentage of total members who must vote for a proposal to meet quorum:*
              </Typography>
              <Box pt={2}>
                <CustomSlider onChange={onSetVoteForQuorum} value={voteForQuorum} />
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
              error={value === null}
              className={classes.textField}
              inputFormat="dd/MM/yyyy"
              value={value}
              onChange={(e) => handleChange(e)}
              renderInput={(params) => <TextField {...params} />}
            />
            </LocalizationProvider>
            <Typography className={classes.largeText} variant="p">
              Minimum contribution per person
            </Typography>
            <TextField
              error={!(minContribution >= 0 || minContribution % 1 === 0)}
              className={classes.textField}
              label="Min. amount (USDC)"
              variant="outlined"
              onChange={(e) => setMinContribution(e.target.value)}
              value={minContribution}
            />
          </Stack>
          <Box pt={15}>
            <Stack spacing={6}>
              <Typography className={classes.largeText} variant="p">
                Percentage of total members who must vote in favour for a proposal to pass:*
              </Typography>
              <CustomSlider onChange={onSetVoteOnFavourChange} value={voteInFavour} />
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
          <img className={classes.finserveImage} src={displayImage} alt={clubSymbol} />
        </Grid>
        <Grid item ml={4} mt={4} mb={4}>
          <Stack spacing={1}>
          <Typography variant="h5">
            {clubName}
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
              {raiseAmount} USDC
            </Typography>
            <Typography variant="p">
              Minimum contribution per person
            </Typography>
            <Typography className={classes.boldText} variant="h5">
              {minContribution} USDC
            </Typography>
            <Typography variant="p">
              Maximum contribution per person
            </Typography>
            <Typography className={classes.boldText} variant="h5">
              {maxContribution} USDC
            </Typography>
          </Stack>
        </Grid>
        <Grid item md={6}>
          <Stack spacing={2} alignItems="stretch">
            <Typography variant="p">
              When will the deposits close?
            </Typography>
            <Typography className={classes.boldText} variant="h5">
              {depositClose.toLocaleDateString('en-IN')}
            </Typography>
            <Typography variant="p">
              Minimum votes needed to validate proposal
            </Typography>
            <Typography className={classes.boldText} variant="h5">
              {voteForQuorum}%
            </Typography>
            <Typography variant="p">
              Minimum ‘yes’ votes needed to pass a proposal
            </Typography>
            <Typography className={classes.boldText} variant="h5">
              {voteInFavour}%
            </Typography>
          </Stack>        
        </Grid>
      </Grid>

      </>
    )
  }

  return (
    <Layout2>
      <div style={{ padding: "100px 400px" }}>
        <HorizontalLinearStepper
          steps={steps}
          components={[step1(), step2(), step3()]}
          data={
            {
              clubname: clubName,
              clubsymbol: clubSymbol,
              displayimage: displayImage,
              raiseamount: raiseAmount,
              maxcontribution: maxContribution,
              mandatoryproposal: mandatoryProposal,
              voteforquorum: voteForQuorum,
              depositclose: depositClose,
              mincontribution: minContribution,
              voteinfavour: voteInFavour
            }
          } />
      </div>
          
    </Layout2>
  )
}
