import {
  Box,
  Card,
  Grid,
  TextField,
  Typography,
  IconButton,
} from "@mui/material";
import { DesktopDatePicker, LocalizationProvider } from "@mui/x-date-pickers";
import React from "react";
import SimpleSelectButton from "../../src/components/simpleSelectButton";
import CustomSlider from "../../src/components/slider";
import AddCircleOutlinedIcon from "@mui/icons-material/AddCircleOutlined";
import DeleteIcon from "@mui/icons-material/Delete";
import InfoIcon from "@mui/icons-material/Info";
import { makeStyles } from "@mui/styles";
import {
  contractList,
  tokenType,
  dateTill,
  exitDates,
} from "../../src/data/create";
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

const Step3 = (props) => {
  const classes = useStyles();

  const {
    voteForQuorum,
    setVoteForQuorum,
    onSetVoteForQuorum,
    onSetVoteOnFavourChange,
    voteInFavour,
    setVoteInFavour,
    voteOnFavourErrorMessage,
    setVoteOnFavourErrorMessage,
    depositClose,
    setDepositClose,
    handleChange,
    minContribution,
    setMinContribution,
    maxContribution,
    setMaxContribution,
    raiseAmount,
    setRaiseAmount,
    handleAddClick,
    addressList,
    setAddressList,
    handleInputChange,
    handleRemoveClick,
  } = props;

  return (
    <>
      <Grid container spacing={3}>
        <Grid item md={12} mt={8}>
          <Typography className={classes.largeText1}>
            Investment club
          </Typography>
          <br />
          <Typography className={classes.largeText}>
            Collectively manage your club’s investments through governance that
            works for you.
          </Typography>
          <br />
          <br />
          <Typography className={classes.largeText} mb={2}>
            Club tokens
          </Typography>

          {/* <Card className={classes.cardPadding}>
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
                    Membership token
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
                  <SimpleSelectButton data={tokenType} />
                </Grid>
              </Grid>
            </Card> */}

          {/* <Typography className={classes.largeText} mt={4} mb={2}>
            Governance
          </Typography>
          <Card className={classes.cardPadding} mb={2}>
            <Grid container pl={3} pr={1} mt={2} mb={2}>
              <Grid item xs sx={{ display: "flex", justifyContent: "flex-start", alignItems: "center" }}>
                <Typography className={classes.largeText}>
                  Make proposals mandatory
                </Typography>
              </Grid>
              <Grid item xs sx={{ display: "flex", justifyContent: "flex-end", alignItems: "center" }}>
                <FormControlLabel control={<Switch />} onChange={(e) => setMandatoryProposal(e.target.value)} value={mandatoryProposal} label="" />
              </Grid>
            </Grid>
          </Card> */}
          <br />
          <Card className={classes.cardPadding} mb={2}>
            <Grid
              container
              item
              xs
              sx={{
                display: "flex",
                justifyContent: "flex-start",
                alignItems: "center",
              }}
              pl={3}
              pr={1}
              mt={2}
              mb={2}
            >
              <Typography className={classes.largeText}>
                Minimum votes needed to{" "}
                <Box
                  sx={{ color: "#FFFFFF" }}
                  fontWeight="fontWeightBold"
                  display="inline"
                >
                  validate
                </Box>{" "}
                a proposal
              </Typography>
            </Grid>
            <Grid container item md={11.3} mt={4} ml={4} mb={4}>
              <CustomSlider
                onChange={onSetVoteForQuorum}
                value={voteForQuorum}
              />
            </Grid>
          </Card>
          <br />
          <Card className={classes.cardPadding} mb={2}>
            <Grid
              container
              item
              xs
              sx={{
                display: "flex",
                justifyContent: "flex-start",
                alignItems: "center",
              }}
              pl={3}
              pr={1}
              mt={2}
              mb={2}
            >
              <Typography className={classes.largeText}>
                Minimum votes in support to{" "}
                <Box
                  sx={{ color: "#FFFFFF" }}
                  fontWeight="fontWeightBold"
                  display="inline"
                >
                  pass
                </Box>{" "}
                a proposal
              </Typography>
            </Grid>
            <Grid container item md={11.3} mt={4} ml={4} mb={4}>
              <CustomSlider
                onChange={onSetVoteOnFavourChange}
                value={voteInFavour}
                defaultValue={voteInFavour}
                min={51}
                max={100}
              />
            </Grid>
            {voteOnFavourErrorMessage ? (
              <Grid container md={11.3} mt={4} ml={4} mb={4}>
                <Grid item>
                  <InfoIcon sx={{ color: "#D55438" }} />
                </Grid>
                <Grid item mt={0.2} ml={0.5}>
                  <Typography variant="p" sx={{ color: "#D55438" }}>
                    Minumum votes in support to pass a proposal should be
                    greater than 50%
                  </Typography>
                </Grid>
              </Grid>
            ) : null}
          </Card>
          <br />
          <Typography className={classes.largeText} mt={4} mb={2}>
            Wallet Signators
          </Typography>
          <Card className={classes.cardPadding} mb={2}>
            <Grid container pl={3} pr={1} mt={2} mb={2}>
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
                  Add more wallets that will sign & approve final transaction
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
                mr={3}
              >
                <IconButton aria-label="add" onClick={handleAddClick}>
                  <AddCircleOutlinedIcon className={classes.addCircleColour} />
                </IconButton>
              </Grid>
            </Grid>
            {addressList?.length > 0 ? (
              <Grid container pl={3} pr={1} mt={2} mb={2}>
                {addressList.map((data, key) => {
                  return (
                    <>
                      <Grid
                        item
                        xs
                        sx={{
                          display: "flex",
                          justifyContent: "flex-start",
                          alignItems: "center",
                        }}
                        key={key}
                      >
                        <TextField
                          label="Wallet address"
                          error={!/^0x[a-zA-Z0-9]+/gm.test(addressList[key])}
                          variant="outlined"
                          onChange={(e) => handleInputChange(e, key)}
                          placeholder={"0x"}
                          sx={{
                            m: 1,
                            width: 443,
                            mt: 1,
                            borderRadius: "10px",
                          }}
                        />
                        <IconButton
                          aria-label="add"
                          onClick={handleRemoveClick}
                        >
                          <DeleteIcon />
                        </IconButton>
                      </Grid>
                    </>
                  );
                })}
              </Grid>
            ) : null}
          </Card>
          <br />

          {/*<Card className={classes.cardPadding} mb={2}>*/}
          {/*  <Grid container item xs sx={{ display: "flex", justifyContent: "flex-start", alignItems: "center" }} pl={3} pr={1} mt={2} mb={2}>*/}
          {/*    <Typography className={classes.largeText}>*/}
          {/*      Minimum signatures needed to <Box sx={{ color: "#FFFFFF" }} fontWeight='fontWeightBold' display='inline'>pass</Box> any transaction*/}
          {/*    </Typography>*/}
          {/*  </Grid>*/}
          {/*  <Grid container item md={11.3} mt={4} ml={4} mb={4}>*/}
          {/*  <TextField*/}
          {/*    error={(threshold > addressList.length || threshold < 1) && addressList.length > 0}*/}
          {/*    variant="outlined"*/}
          {/*    onChange={(e) => setThreshold(e.target.value)}*/}
          {/*    value={threshold}*/}
          {/*    sx={{ m: 1, width: 443, mt: 1, borderRadius: "10px", }}*/}
          {/*  />*/}
          {/*    /!* <CustomSlider onChange={e => minimumSignaturePercentage(e.target.value)} value={threshold} /> *!/*/}
          {/*  </Grid>*/}
          {/*</Card>*/}

          {/* <Typography className={classes.largeText} mt={4} mb={2}>
            Other
          </Typography>
          <Card className={classes.cardPadding} mb={2}>
            <Grid container pl={3} pr={1} mt={2} mb={2}>
              <Grid item xs sx={{ display: "flex", justifyContent: "flex-start", alignItems: "center" }}>
                <Typography className={classes.largeText}>
                  Add a carry fee
                </Typography>
              </Grid>
              <Grid item xs sx={{ display: "flex", justifyContent: "flex-end", alignItems: "center" }}>
                <FormControlLabel control={<Switch />} onChange={(e) => setMandatoryProposal(e.target.value)} value={mandatoryProposal} label="" />
              </Grid>
            </Grid>
          </Card>
          <br />
          <Card className={classes.cardPadding}>
            <Grid container pl={3} pr={1}>
              <Grid item xs sx={{ display: "flex", justifyContent: "flex-start", alignItems: "center" }}>
                <Typography className={classes.largeText}>
                Allow members to exit (from date of deposit)
                </Typography>
              </Grid>
              <Grid item xs sx={{ display: "flex", justifyContent: "flex-end", alignItems: "center" }}>
              <FormControl sx={{ m: 1, width: 443, mt: 1 }}>
                <Select
                  displayEmpty
                  value={value}
                  onChange={handleDepositClose}
                  input={<OutlinedInput />}
                  MenuProps={MenuProps}
                  style={{ borderRadius: "10px", background: "#111D38 0% 0% no-repeat padding-box", }}
                >
                  {exitDates.map((value) => (
                    <MenuItem
                      key={value.text}
                      value={String(value.date)}
                      >
                      {value.text}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
              </Grid>
            </Grid>
          </Card> */}
        </Grid>
      </Grid>
    </>
  );
};

export default Step3;
