import { React, useRef, onChange, useState, Component } from "react"
import { makeStyles } from "@mui/styles"

import {
  Grid,
  Typography,
  TextField,
  Card,
  Switch,
  FormControlLabel,
  Box,
  Stack,
  Divider,
} from "@mui/material"
import { DesktopDatePicker } from "@mui/x-date-pickers"
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider"
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns"
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
    borderRadius: "20px",
  },
  largeText: {
    fontSize: "18px",
  },
  smallText: {
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
    borderRadius: "100%",
  },
  boldText: {
    fontWeight: "bold",
  },
  uploadImage: {
    width: "27px",
    height: "27px",
  },
})

const classes = {
  textField: {
    width: "100%",
    margin: "16px 0 25px 0",
    fontSize: "18px",
  },
  image: {
    width: "22.9vw",
    height: "61.8vh",
    borderRadius: "20px",
  },
  largeText: {
    fontSize: "18px",
  },
  smallText: {
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
    borderRadius: "100%",
  },
  boldText: {
    fontWeight: "bold",
  },
  uploadImage: {
    width: "27px",
    height: "27px",
  },
}

class CreateTest extends Component {
  constructor(props) {
    super(props)

    this.state = {}
  }

  handleChange = (newValue) => {
    setValue(newValue)
    setDepositClose(newValue)
  }

  onSetVoteForQuorum = (event, newValue) => {
    setVoteForQuorum(newValue)
  }

  onSetVoteOnFavourChange = (event, newValue) => {
    setVoteInFavour(newValue)
  }

  handleInput = (e) => {
    console.log(e.target.name, e.target.value)
    this.setState({ [e.target.name]: e.target.value })
    console.log(this.state)
  }

  step1 = () => {
    return (
      <>
        <Grid container spacing={2}>
          <Grid item md={6}>
            <img
              className={classes.image}
              src="/assets/images/hands.png"
              alt="token-hands"
            />
          </Grid>
          <Grid item md={6}>
            <Typography className={classes.largeText} variant="p">
              What should we call your club?
            </Typography>
            <br />
            <TextField
              className={classes.textField}
              label="Club name"
              variant="outlined"
              onChange={(e) => this.handleInput(e)}
              value={this.state.clubName}
              name="clubname"
            />

            <Typography className={classes.largeText} variant="p">
              Enter club token symbol
            </Typography>
            <br />
            <TextField
              className={classes.textField}
              label="Club symbol"
              variant="outlined"
              onChange={(e) => this.handleInput(e)}
              value={this.state.clubSymbol}
              name="clubsymbol"
            />
            <br />
            <Grid
              container
              wrap="nowrap"
              spacing={0}
              justify="center"
              alignItems="center"
              direction="row"
            >
              <Grid item xs={9}>
                <Grid container spacing={2}>
                  <Grid item xs={12}>
                    <Typography className={classes.largeText} variant="p">
                      Upload a display picture (Not mandatory)
                    </Typography>
                  </Grid>
                  <Grid item xs={10}>
                    <Typography className={classes.smallText}>
                      Lorem ipsum dolor sit amet, consectetur adipiscing elit,
                      sed do eiusmod tempor.
                    </Typography>
                  </Grid>
                </Grid>
              </Grid>
            </Grid>
            <br />
            <Grid container>
              <Card className={classes.cardWarning}>
                <Typography className={classes.textWarning} variant="p">
                  This info is public on the blockchain. This can not be changed
                  later, please choose a name accordingly.
                </Typography>
              </Card>
            </Grid>
          </Grid>
        </Grid>
      </>
    )
  }

  step2 = () => {
    return <></>
  }

  step3 = () => {
    return <></>
  }

  render() {
    const steps = ["Add basic info", "Set club rules", "Final step"]

    return (
      <Layout2>
        <HorizontalLinearStepper
          steps={steps}
          components={[this.step1(), this.step2(), this.step3()]}
          data={{}}
        />
      </Layout2>
    )
  }
}

export default CreateTest
