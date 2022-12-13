import {
  Box,
  Card,
  Grid,
  TextField,
  Typography,
  IconButton,
  Button,
} from "@mui/material";
import { DesktopDatePicker, LocalizationProvider } from "@mui/x-date-pickers";
import React from "react";
import { makeStyles } from "@mui/styles";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";

const useStyles = makeStyles({
  textField: {
    width: "100%",
    margin: "16px 0 25px 0",
    fontSize: "18px",
    fontFamily: "Whyte",
  },
  image: {
    width: "22.9vw",
    height: "61.8vh",
    borderRadius: "20px",
  },
  largeText: {
    fontSize: "18px",
    color: "#C1D3FF",
    fontFamily: "Whyte",
  },
  largeText1: {
    fontSize: "2.4vw",
    color: "#FFFFFF",
    fontFamily: "Whyte",
  },
  wrapTextIcon: {
    fontSize: "18px",
    fontFamily: "Whyte",
    color: "#C1D3FF",
    verticalAlign: "middle",
    display: "inline-flex",
  },
  smallText: {
    fontSize: "14px",
    fontFamily: "Whyte",
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
    fontFamily: "Whyte",
  },
  boldText: {
    fontWeight: "bold",
    fontFamily: "Whyte",
  },
  uploadButton: {
    backgroundColor: "#111D38",
    color: "#3B7AFD",
    fontSize: "18px",
    width: "208px",
    fontFamily: "Whyte",
  },
  cardPadding: {
    margin: 0,
    padding: 0,
    borderRadius: "10px",
  },
  addCircleColour: {
    color: "#C1D3FF",
    fontFamily: "Whyte",
  },
  large_button: {
    fontSize: "18px",
    width: "208px",
    borderRadius: "30px",
    fontFamily: "Whyte",
  },
  backButton: {
    fontSize: "18px",
    width: "208px",
    borderRadius: "30px",
    backgroundColor: "#FFFFFF",
    color: "#3B7AFD",
    fontFamily: "Whyte",
  },
});

const ERC20NonTransferableStep2 = (props) => {
  const classes = useStyles();

  const {
    depositClose,
    setDepositClose,
    handleChange,
    minContribution,
    setMinContribution,
    maxContribution,
    setMaxContribution,
    raiseAmount,
    setRaiseAmount,
    activeStep,
    handleNext,
  } = props;

  return (
    <>
      <Grid container spacing={3}>
        <Grid item md={12} mt={8}>
          <Typography className={classes.largeText} mt={3} mb={2}>
            Deposits
          </Typography>
          <Card className={classes.cardPadding}>
            <Grid container pl={3} pr={1}>
              <Grid
                item
                xs
                sx={{
                  display: "flex",
                  justifyContent: "flex-start",
                  alignItems: "center",
                }}
              >
                <Typography className={classes.largeText}>
                  Accept deposits till
                </Typography>
              </Grid>
              <Grid
                item
                xs
                sx={{
                  display: "flex",
                  justifyContent: "flex-end",
                  alignItems: "center",
                }}
              >
                <LocalizationProvider dateAdapter={AdapterDateFns}>
                  <DesktopDatePicker
                    error={depositClose === null}
                    inputFormat="dd/MM/yyyy"
                    value={depositClose}
                    onChange={(e) => handleChange(e)}
                    renderInput={(params) => (
                      <TextField
                        onKeyDown={(e) => e.preventDefault()}
                        place
                        {...params}
                        sx={{ m: 1, width: 443, mt: 1, borderRadius: "10px" }}
                      />
                    )}
                    minDate={depositClose}
                  />
                </LocalizationProvider>
              </Grid>
            </Grid>
          </Card>
          <br />
          <Card className={classes.cardPadding} mb={2}>
            <Grid container pl={3} pr={1}>
              <Grid
                item
                xs
                sx={{
                  display: "flex",
                  justifyContent: "flex-start",
                  alignItems: "center",
                }}
              >
                <Typography className={classes.largeText}>
                  Minimum contribution per person
                </Typography>
              </Grid>
              <Grid
                item
                xs
                sx={{
                  display: "flex",
                  justifyContent: "flex-end",
                  alignItems: "center",
                }}
              >
                <TextField
                  error={
                    minContribution < 0 ||
                    minContribution === null ||
                    minContribution % 1 !== 0 ||
                    typeof minContribution === "undefined"
                  }
                  variant="outlined"
                  onChange={(e) => {
                    setMinContribution(e.target.value);
                  }}
                  value={minContribution}
                  sx={{ m: 1, width: 443, mt: 1, borderRadius: "10px" }}
                  placeholder={"$100"}
                />
              </Grid>
            </Grid>
          </Card>

          <br />
          <Card className={classes.cardPadding} mb={2}>
            <Grid container pl={3} pr={1}>
              <Grid
                item
                xs
                sx={{
                  display: "flex",
                  justifyContent: "flex-start",
                  alignItems: "center",
                }}
              >
                <Typography className={classes.largeText}>
                  Maximum contribution per person
                </Typography>
              </Grid>
              <Grid
                item
                xs
                sx={{
                  display: "flex",
                  justifyContent: "flex-end",
                  alignItems: "center",
                }}
              >
                <TextField
                  error={
                    maxContribution < 0 ||
                    maxContribution === null ||
                    maxContribution % 1 !== 0 ||
                    typeof maxContribution === "undefined" ||
                    parseInt(maxContribution) < parseInt(minContribution)
                  }
                  variant="outlined"
                  onChange={(e) => setMaxContribution(e.target.value)}
                  value={maxContribution}
                  sx={{ m: 1, width: 443, mt: 1, borderRadius: "10px" }}
                  placeholder={"$1,000"}
                />
              </Grid>
            </Grid>
          </Card>

          <br />
          <Card className={classes.cardPadding} mb={2}>
            <Grid container pl={3} pr={1}>
              <Grid
                item
                xs
                sx={{
                  display: "flex",
                  justifyContent: "flex-start",
                  alignItems: "center",
                }}
              >
                <Typography className={classes.largeText}>
                  Total amount you want to raise
                </Typography>
              </Grid>
              <Grid
                item
                xs
                sx={{
                  display: "flex",
                  justifyContent: "flex-end",
                  alignItems: "center",
                }}
              >
                <TextField
                  error={
                    raiseAmount < 0 ||
                    raiseAmount === null ||
                    raiseAmount % 1 !== 0 ||
                    typeof raiseAmount === "undefined" ||
                    parseInt(raiseAmount) < parseInt(maxContribution) ||
                    parseInt(raiseAmount) < parseInt(minContribution)
                  }
                  variant="outlined"
                  onChange={(e) => setRaiseAmount(e.target.value)}
                  value={raiseAmount}
                  sx={{ m: 1, width: 443, mt: 1, borderRadius: "10px" }}
                  placeholder={"$10,000"}
                />
              </Grid>
            </Grid>
          </Card>
        </Grid>
        <Grid
          container
          wrap="nowrap"
          spacing={0}
          justify="center"
          alignItems="center"
          direction="row"
        >
          <Grid item xs={0} mt={2}>
            <Button
              variant="wideButton"
              disabled={
                activeStep === 1
                  ? !depositClose ||
                    !minContribution ||
                    !maxContribution ||
                    !raiseAmount
                  : false
              }
              onClick={handleNext}
            >
              Next
            </Button>
          </Grid>
        </Grid>
      </Grid>
    </>
  );
};

export default ERC20NonTransferableStep2;
