import { Button, Grid, TextField, Typography } from "@mui/material";
import React from "react";
import InfoOutlinedIcon from "@mui/icons-material/InfoOutlined";
import { makeStyles } from "@mui/styles";
import SimpleSelectButton from "../../src/components/simpleSelectButton";
import { tokenType } from "../../src/data/create";

const useStyles = makeStyles({
  textField: {
    width: "100%",
    margin: "16px 0 25px 0",
    fontSize: "18px",
    fontFamily: "Whyte",
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
});

const Step1 = (props) => {
  console.log(props);
  const {
    clubName,
    setClubName,
    clubSymbol,
    setClubSymbol,
    clubTokenType,
    setClubTokenType,
    activeStep,
    handleNext,
  } = props;
  const classes = useStyles();
  return (
    <>
      <Grid
        container
        direction="row"
        justifyContent="center"
        alignItems="center"
      >
        <Grid item md={8} mt={8}>
          <Typography className={classes.largeText1}>
            What&apos;s your club info?
          </Typography>
          <br />
          <Typography className={classes.wrapTextIcon}>
            You&apos;ll be the admin of the club since you&apos;re creating the
            club. &nbsp;
            <InfoOutlinedIcon />
          </Typography>
          <TextField
            error={clubName === ""}
            className={classes.textField}
            label="Club name"
            variant="outlined"
            onChange={(e) => setClubName(e.target.value)}
            value={clubName}
          />
          <TextField
            error={clubSymbol === ""}
            className={classes.textField}
            label="Club token symbol (eg: $DEMO)"
            variant="outlined"
            onChange={(e) => setClubSymbol(e.target.value)}
            value={clubSymbol}
          />

          <Typography className={classes.largeText}>
            Membership token
          </Typography>
          <SimpleSelectButton
            data={tokenType}
            setClubTokenType={setClubTokenType}
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
            <Grid item xs={0} mt={2}>
              <Button
                variant="wideButton"
                disabled={activeStep === 0 ? !clubName || !clubSymbol : false}
                onClick={handleNext}
              >
                Next
              </Button>
            </Grid>
          </Grid>
        </Grid>
      </Grid>
    </>
  );
};

export default Step1;
