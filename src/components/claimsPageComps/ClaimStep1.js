import {
  FormControl,
  InputAdornment,
  MenuItem,
  Typography,
  ToggleButtonGroup,
  ToggleButton,
} from "@mui/material";
import { Button, TextField } from "@components/ui";
import { BsArrowLeft } from "react-icons/bs";
import { makeStyles } from "@mui/styles";
import React, { useEffect } from "react";
import { IoWalletSharp } from "react-icons/io5";
import { BsFillSendFill } from "react-icons/bs";
import { LocalizationProvider } from "@mui/x-date-pickers";
import { DateTimePicker } from "@mui/x-date-pickers/DateTimePicker";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import dayjs from "dayjs";
import { useRouter } from "next/router";
import { convertFromWeiGovernance } from "../../utils/globalFunctions";

const useStyles = makeStyles({
  form: {
    display: "flex-col",
    alignItems: "center",
    justifyContent: "center",
    margin: "40px auto",
    width: "600px",
    color: "white",
  },

  title: {
    fontSize: "36px",
    fontWeight: "400",
    marginBottom: "40px",
  },
  label: {
    marginTop: "30px",
    fontWeight: "300",
    marginBottom: "4px",
  },
  btn: {
    width: "130px",

    fontSize: "16px",
    marginTop: "20px",
  },
  text: {
    color: "#6475A3",
    fontSize: "14px",
    marginTop: "8px",
  },

  back: {
    fontWeight: "300",
    marginBottom: "4px",
    display: "flex",
    alignItems: "center",
    gap: "5px",
    color: "#dcdcdc",
    position: "absolute",
    left: "10%",
    top: "110px",
    fontSize: "18px",
    cursor: "pointer",
  },

  selectContainer: {
    border: "0.5px solid #6475A3",
    display: "flex",
    borderRadius: "10px",
  },
  leftContainer: {
    flex: "0.5",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    padding: "40px",
    flexDirection: "column",
    borderRadius: "10px",
    cursor: "pointer",
    border: "1px solid none",
  },
  rightContainer: {
    flex: "0.5",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    padding: "40px 40px",
    flexDirection: "column",
    borderRadius: "10px",
    cursor: "pointer",
    border: "1px solid none",
  },
  selectedContainer: {
    flex: "0.5",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    flexDirection: "column",
    cursor: "pointer",
    border: "1px solid #2D55FF",
    borderRadius: "10px",
  },

  step: {
    marginTop: "30px",
    fontWeight: "300",
    marginBottom: "4px",
    display: "flex",
    alignItems: "center",
    gap: "5px",
    color: "#dcdcdc",
    position: "absolute",
    left: "33.5%",
    top: "110px",
    fontSize: "18px",
    cursor: "pointer",
  },
  loaderDiv: {
    height: "100vh",
    width: "100vw",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
  },
  smallText: {
    fontSize: "12px",
    textTransform: "none",
    fontWeight: "300",
    margin: 0,
    padding: 0,
    width: "100%",
  },
});

const ClaimStep1 = ({ formik, tokensInWallet, isLoading, networkId }) => {
  const classes = useStyles();
  const router = useRouter();

  useEffect(() => {
    formik.values.airdropTokenAddress = formik.values.selectedToken.address;
  }, [formik.values]);

  return (
    <>
      <Typography
        onClick={() => {
          router.push(`/claims/`);
        }}
        className={classes.back}>
        <BsArrowLeft /> Back to claims
      </Typography>

      <form className={classes.form}>
        <Typography className={classes.title}>
          Create a new claim page
        </Typography>

        {/* Description of claim page */}
        <Typography className={classes.label}>
          Add a one-liner description *
        </Typography>
        <TextField
          variant="outlined"
          name="description"
          id="description"
          value={formik.values.description}
          onChange={formik.handleChange}
          error={
            formik.touched.description && Boolean(formik.errors.description)
          }
          helperText={formik.touched.description && formik.errors.description}
        />

        <Typography className={classes.label}>
          Where do you want to airdrop tokens from? *
        </Typography>

        <ToggleButtonGroup
          color="primary"
          value={formik.values.airdropFrom}
          exclusive
          onChange={formik.handleChange}
          aria-label="airdropFrom"
          name="airdropFrom"
          id="airdropFrom"
          className={classes.selectContainer}>
          <ToggleButton
            className={classes.rightContainer}
            name="airdropFrom"
            value="contract"
            id="airdropFrom">
            <div
              onClick={() => {
                formik.setFieldValue("airdropFrom", "contract");
              }}>
              <BsFillSendFill size={20} />
              <p className={classes.label}>Claim Contract</p>
              <p className={classes.smallText}>
                Users will claim tokens from custom claim contract{" "}
                <span> (recommended)</span>
              </p>
            </div>
          </ToggleButton>

          <ToggleButton
            className={classes.leftContainer}
            name="airdropFrom"
            id="airdropFrom"
            value="wallet">
            <div
              onClick={() => {
                formik.setFieldValue("airdropFrom", "wallet");
              }}>
              <IoWalletSharp size={20} />
              <p
                className={classes.label}
                onClick={(event) => {
                  event.stopPropagation(); // Prevent event propagation
                }}>
                My Wallet
              </p>
              <p className={classes.smallText}>
                Users will claim tokens from your wallet
              </p>
            </div>
          </ToggleButton>
        </ToggleButtonGroup>

        {/* Roll back address
        {formik.values.airdropFrom === "contract" && (
          <>
            <Typography className={classes.label}>
              Add a roll back Adress *
            </Typography>
            <TextField
              variant="outlined"
              className={classes.input}
              name="rollbackAddress"
              id="rollbackAddress"
              value={formik.values.rollbackAddress}
              onChange={formik.handleChange}
              error={
                formik.touched.rollbackAddress &&
                Boolean(formik.errors.rollbackAddress)
              }
              helperText={
                formik.touched.rollbackAddress && formik.errors.rollbackAddress
              }
            />
            <Typography className={classes.text}>
              Unclaimed tokens after end of claim period will be sent/rolled
              back to this address.
            </Typography>
          </>
        )} */}

        {/* Choose Token */}
        <Typography className={classes.label}>
          Choose token to airdrop *
        </Typography>
        <FormControl sx={{ width: "100%" }}>
          {isLoading ? (
            <TextField disabled placeholder="Loading tokens..." />
          ) : (
            <TextField
              variant="outlined"
              name="selectedToken"
              id="selectedToken"
              value={formik.values.selectedToken}
              onChange={formik.handleChange}
              placeholder="Loading Tokens..."
              select
              error={
                formik.touched.selectedToken &&
                Boolean(formik.errors.selectedToken)
              }
              helperText={
                formik.touched.selectedToken && formik.errors.selectedToken
              }>
              {tokensInWallet?.map((token, i) => (
                <MenuItem key={i} value={token}>
                  {token?.symbol}
                </MenuItem>
              ))}
            </TextField>
          )}
        </FormControl>
        <Typography className={classes.text}>
          You can choose any token held in your wallet connected to StationX
        </Typography>

        {/* Number of Tokens */}
        <Typography className={classes.label}>Number of Tokens *</Typography>
        <TextField
          type="number"
          InputProps={{
            endAdornment: (
              <InputAdornment style={{ color: "#6475A3" }} position="end">
                Balance:{" "}
                {formik.values.selectedToken
                  ? convertFromWeiGovernance(
                      formik.values.selectedToken.balance,
                      formik.values.selectedToken.decimals,
                    )
                  : "0"}
              </InputAdornment>
            ),
          }}
          name="numberOfTokens"
          id="numberOfTokens"
          value={formik.values.numberOfTokens}
          onChange={formik.handleChange}
          error={
            (formik.touched.numberOfTokens &&
              Boolean(formik.errors.numberOfTokens)) ||
            formik.values.numberOfTokens >
              convertFromWeiGovernance(
                formik.values.selectedToken.balance,
                formik.values.selectedToken.decimals,
              )
          }
          helperText={
            (formik.touched.numberOfTokens && formik.errors.numberOfTokens) ||
            formik.values.numberOfTokens >
              convertFromWeiGovernance(
                formik.values.selectedToken.balance,
                formik.values.selectedToken.decimals,
              )
          }
          onWheel={(event) => event.target.blur()}
        />

        <div
          style={{
            width: "100%",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            width: "100%",
            marginBottom: "40px",
          }}>
          {/* Claim Start */}

          <div>
            <Typography className={classes.label}>Claims start on</Typography>
            <LocalizationProvider dateAdapter={AdapterDayjs}>
              <DateTimePicker
                value={formik.values.startDate}
                minDateTime={dayjs(Date.now())}
                onChange={(value) => {
                  formik.setFieldValue("startDate", value);
                }}
              />
            </LocalizationProvider>
          </div>

          {/* Claim End */}

          <div>
            <Typography className={classes.label}>Claims end on</Typography>
            <LocalizationProvider dateAdapter={AdapterDayjs}>
              <DateTimePicker
                value={formik.values.endDate}
                minDateTime={formik.values.startDate}
                onChange={(value) => {
                  formik.setFieldValue("endDate", value);
                }}
              />
            </LocalizationProvider>
          </div>
        </div>

        {/* when to receive  */}
        {/* <Typography className={classes.label}>
          When do they receive tokens after claiming?
        </Typography>
        <FormControl sx={{ width: "100%" }}>
          <Select
            onChange={formik.handleChange}
            id="recieveTokens"
            name="recieveTokens"
            value={formik.values.recieveTokens}
            inputProps={{ "aria-label": "Without label" }}
          >
            <MenuItem value={"week"}>After 1 week </MenuItem>
            <MenuItem value={"immediately"}>Immediately</MenuItem>
          </Select>
        </FormControl> */}

        {/* {/* Next */}

        <Button onClick={formik.handleSubmit}>Next</Button>
      </form>
    </>
  );
};

export default ClaimStep1;
