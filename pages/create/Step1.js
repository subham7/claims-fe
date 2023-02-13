import { Box, Button, Grid, TextField, Typography } from "@mui/material";
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
  smallText: {
    fontSize: "16px",
    fontFamily: "Whyte",
    color: "#6475A3",
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
          <Typography className={classes.wrapTextIcon}>
            Basic Station info
          </Typography>
          <Typography className={classes.smallText}>
            Name & token symbol of your station are publicly visible on-chain &
            can’t be changed after it is created. This can be your brand name or
            something your community identifies with.
          </Typography>
          <br />
          <Typography className={classes.wrapTextIcon}>Name</Typography>
          <TextField
            error={clubName === ""}
            className={classes.textField}
            label="Eg: Degen Collective / PurpleDAO / Phoenix club"
            variant="outlined"
            onChange={(e) => setClubName(e.target.value)}
            value={clubName}
          />
          <br />
          <Typography className={classes.wrapTextIcon}>
            Symbol{" "}
            <Box sx={{ color: "#6475A3" }} fontWeight="Normal" display="inline">
              (Ticker)
            </Box>
          </Typography>
          <TextField
            error={clubSymbol === ""}
            className={classes.textField}
            label="Eg: DGC / PDAO / PXC"
            variant="outlined"
            onChange={(e) => setClubSymbol(e.target.value)}
            value={clubSymbol}
          />
          <br />
          <Typography className={classes.smallText}>
            You can choose to make your token public or private along with other
            rules in the next steps.
          </Typography>
          <br />

          <Typography className={classes.largeText} mb={2}>
            Set token type
          </Typography>
          <Typography className={classes.smallText} mb={2}>
            Token type that best suits your objective. For example: ERC721 for
            membership based communities, Non-transferrable ERC20 for a
            syndicate cap-table, transferrable ERC20 for a public DAO, etc.
            Transferability allows trading of tokens in public markets.
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
