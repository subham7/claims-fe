import {
  Button,
  FormControl,
  FormControlLabel,
  FormLabel,
  InputAdornment,
  InputLabel,
  MenuItem,
  NativeSelect,
  Radio,
  RadioGroup,
  Select,
  TextField,
  Typography,
} from "@mui/material";
import { BsArrowLeft } from "react-icons/bs";
import { makeStyles } from "@mui/styles";
import React, { useRef, useState } from "react";
import * as yup from "yup";
import { useFormik } from "formik";
import { useRouter } from "next/router";
import { useSelector } from "react-redux";

const useStyles = makeStyles({
  form: {
    display: "flex-col",
    alignItems: "center",
    justifyContent: "center",
    margin: "170px auto",
    width: "550px",
    color: "white",
  },

  title: {
    fontSize: "36px",
    fontWeight: "400",
    marginBottom: "40px",
  },
  input: {
    "width": "100%",
    "marginTop": "6px",
    "color": "#6475A3",
    "borderRadius": "8px",
    "& input[type=number]": {
      "-moz-appearance": "textfield",
    },
    "& input[type=number]::-webkit-outer-spin-button": {
      "-webkit-appearance": "none",
      "margin": 0,
    },
    "& input[type=number]::-webkit-inner-spin-button": {
      "-webkit-appearance": "none",
      "margin": 0,
    },
  },
  label: {
    marginTop: "30px",
    fontWeight: "300",
    marginBottom: "4px",
  },
  btn: {
    width: "130px",
    fontFamily: "sans-serif",
    fontSize: "16px",
    marginTop: "20px",
  },
  text: {
    color: "#6475A3",
    fontSize: "15px",
    marginTop: "8px",
  },

  back: {
    marginTop: "30px",
    fontWeight: "300",
    marginBottom: "4px",
    display: "flex",
    alignItems: "center",
    gap: "5px",
    color: "#C1D3FF",
    position: "absolute",
    left: "10%",
    top: "110px",
    fontSize: "18px",
    cursor: "pointer",
  },

  step: {
    marginTop: "30px",
    fontWeight: "300",
    marginBottom: "4px",
    display: "flex",
    alignItems: "center",
    gap: "5px",
    color: "#C1D3FF",
    position: "absolute",
    left: "33.5%",
    top: "110px",
    fontSize: "18px",
    cursor: "pointer",
  },

  uploadBtn: {
    border: "1px solid lightgray",
    background: "transparent",
  },
});

const Step2 = () => {
  const classes = useStyles();
  const router = useRouter();

  const [file, setFile] = useState("");
  const [eligible, setEligible] = useState("token");
  const [maximumToken, setMaximumToken] = useState("custom");
  const [tokenAddress, setTokenAddress] = useState("");
  const [customAmount, setCustomAmount] = useState(0);
  const [claimAllowed, setClaimAllowed] = useState("equalTokens");

  const userData = useSelector((state) => {
    return state.createClaim.userData;
  });

  const hiddenFileInput = useRef(null);

  const backHandler = () => {
    router.push("/claims/createClaim");
  };

  const handleChange = (event) => {
    const fileUploaded = event.target.files[0];
    console.log(fileUploaded);
    setFile(fileUploaded);
    // props.handleFile(fileUploaded);
  };

  const handleClick = (event) => {
    hiddenFileInput.current.click();
    console.log(hiddenFileInput.current.value);
  };

  const eligibleChangeHandler = (event) => {
    setEligible(event.target.value);
    // console.log(event.target.value);
  };

  const maximumClaimAllowedHandler = (event) => {
    setMaximumToken(event.target.value);
    console.log(event.target.value);
  };

  const finishHandler = (event) => {
    event.preventDefault();

    if (eligible === "token") {
      const data = {
        ...userData,
        eligible: eligible,
        tokenAddress: tokenAddress,
        maximumToken: maximumToken,
        customAmount: customAmount,
      };
    } else if (eligible === "csv") {
      const data = {
        ...userData,
        eligible: eligible,
      };
    }

    console.log(data);
  };

  return (
    <>
      <Typography onClick={backHandler} className={classes.back}>
        <BsArrowLeft /> Back
      </Typography>

      <form onSubmit={finishHandler} className={classes.form}>
        <Typography className={classes.title}>
          Add conditions for eligibility
        </Typography>

        {/* Eligble for claim */}
        <Typography className={classes.label}>
          Set who is eligible to claim
        </Typography>
        <FormControl sx={{ width: "100%" }}>
          <Select
            value={eligible}
            onChange={eligibleChangeHandler}
            inputProps={{ "aria-label": "Without label" }}
          >
            <MenuItem value={"token"}>Anyone with certain token/NFT</MenuItem>
            <MenuItem value={"csv"}>Upload custom CSV file</MenuItem>
          </Select>
        </FormControl>

        <Typography className={classes.text}>
          Only wallets that hold certain token/NFT can claim the drop.
        </Typography>

        {/* if token/nft selected  */}

        {eligible === "token" ? (
          <>
            {/* Token/NFT address */}

            <Typography className={classes.label}>
              Add token (or) NFT
            </Typography>
            <TextField
              onChange={(event) => {
                setTokenAddress(event.target.value);
              }}
              variant="outlined"
              className={classes.input}
            />

            <Typography className={classes.label}>
              What is the maximum claim allowed per token holder?
            </Typography>
            <RadioGroup
              aria-labelledby="demo-controlled-radio-buttons-group"
              name="controlled-radio-buttons-group"
              value={maximumToken}
              onChange={maximumClaimAllowedHandler}
            >
              <FormControlLabel
                value="proRata"
                control={<Radio />}
                label="Pro-rata as per share of tokens held"
              />
              <FormControlLabel
                value="custom"
                control={<Radio />}
                label="Set a custom amount"
              />
            </RadioGroup>

            {/* Number of Tokens */}

            {maximumToken === "custom" && (
              <>
                <Typography className={classes.label}>Enter Amount</Typography>
                <TextField
                  className={classes.input}
                  onChange={(event) => {
                    setCustomAmount(event.target.value);
                  }}
                  type="number"
                />
              </>
            )}
          </>
        ) : (
          <>
            <Typography className={classes.label}>
              What is the claim allowed per wallet address (in CSV file)?
            </Typography>
            <RadioGroup
              aria-labelledby="demo-controlled-radio-buttons-group"
              name="controlled-radio-buttons-group"
              //   value={value}
              //   onChange={handleChange}
            >
              <FormControlLabel
                value="equalTokens"
                control={<Radio />}
                label="Drop tokens equally"
              />
              <FormControlLabel
                value="customAmount"
                control={<Radio />}
                label="Drop custom amounts for each address"
              />
            </RadioGroup>

            <Typography className={classes.label}>
              Upload your CSV file
            </Typography>
            <div style={{ display: "flex", alignItems: "center", gap: "20px" }}>
              <TextField
                className={classes.input}
                onClick={handleClick}
                onChange={handleChange}
                disabled
                //   value={hiddenFileInput.current.value}
                value={file.name}
              />
              <Button onClick={handleClick} className={classes.uploadBtn}>
                Upload
              </Button>
              <input
                type="file"
                ref={hiddenFileInput}
                onChange={handleChange}
                style={{ display: "none" }}
              />
            </div>
          </>
        )}

        {/* Next */}
        <Button type="submit" variant="contained" className={classes.btn}>
          Finish
        </Button>
      </form>
    </>
  );
};

export default Step2;
