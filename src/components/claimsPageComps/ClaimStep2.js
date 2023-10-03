import {
  CircularProgress,
  FormControl,
  FormControlLabel,
  MenuItem,
  Radio,
  RadioGroup,
  Select,
  Typography,
} from "@mui/material";
import { Button, TextField } from "@components/ui";
import { BsArrowLeft } from "react-icons/bs";
import { makeStyles } from "@mui/styles";
import React, { useRef, useState } from "react";
import { useRouter } from "next/router";
import Link from "next/link";

const useStyles = makeStyles({
  form: {
    display: "flex-col",
    alignItems: "center",
    justifyContent: "center",
    margin: "20px auto",
    width: "550px",
    color: "white",
  },

  title: {
    fontSize: "36px",
    fontWeight: "400",
    marginBottom: "40px",
  },
  input: {
    width: "100%",
    marginTop: "6px",
    color: "#6475A3",
    borderRadius: "8px",
    "& input[type=number]": {
      "-moz-appearance": "textfield",
    },
    "& input[type=number]::-webkit-outer-spin-button": {
      "-webkit-appearance": "none",
      margin: 0,
    },
    "& input[type=number]::-webkit-inner-spin-button": {
      "-webkit-appearance": "none",
      margin: 0,
    },
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
  error: {
    color: "red",
    fontSize: "14px",
    marginTop: "8px",
    fontWeight: "400",
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

  uploadBtn: {
    border: "1px solid lightgray",
    background: "transparent",
  },

  finish: {
    width: "200px",

    fontSize: "16px",
    marginTop: "20px",
  },
});

const ClaimStep2 = ({ handleBack, formik, finish, loading, formikStep1 }) => {
  const { values } = formik;
  const router = useRouter();

  const [csvError, setCsvError] = useState(false);
  const [loadingCsv, setLoadingCsv] = useState(false);

  const classes = useStyles();

  const hiddenFileInput = useRef(null);

  const [file, setFile] = useState("");
  const handleClick = (event) => {
    hiddenFileInput.current.click();
  };

  if (values.eligible === "everyone") {
    values.maximumClaim = "custom";
  }

  const handleChange = async (event) => {
    const fileUploaded = event.target.files[0];
    setLoadingCsv(true);
    setFile(fileUploaded);

    // new instance of fileReader class
    const reader = new FileReader();

    if (fileUploaded) {
      await reader.readAsText(fileUploaded);

      // converting .csv file into array of objects
      reader.onload = async (event) => {
        const csvData = event.target.result;

        const csvArr = csvData
          .split("\r\n")
          .map((data) => data.split(","))
          .filter((data) => data[0])
          .map((data) => ({
            address: data[0].toLowerCase(),
            amount: +data[1],
          }));

        // setCSVObject(csvArr);
        formik.values.csvObject = csvArr;

        const initialValue = 0;
        const sumOfAmt = csvArr.reduce(
          (acc, curr) => acc + curr.amount,
          initialValue,
        );

        if (sumOfAmt > formikStep1.values.numberOfTokens) {
          setCsvError(true);
        }

        setLoadingCsv(false);
      };
    }
  };

  const isButtonDisabled = () => {
    return csvError ||
      (values.eligible === "everyone" &&
        (values.customAmount <= 0 || !values.customAmount)) ||
      (values.eligible === "token" &&
        values.maximumClaim === "custom" &&
        values.customAmount <= 0) ||
      (values.eligible === "csv" && values.csvObject.length === 0)
      ? true
      : false;
  };

  return (
    <>
      <Typography onClick={handleBack} className={classes.back}>
        <BsArrowLeft /> Back
      </Typography>

      <form className={classes.form}>
        <Typography className={classes.title}>
          Add conditions for eligibility
        </Typography>
        {/* Eligble for claim */}
        <Typography className={classes.label}>
          Set who is eligible to claim
        </Typography>
        <FormControl sx={{ width: "100%" }}>
          <Select
            value={values.eligible}
            onChange={formik.handleChange}
            inputProps={{ "aria-label": "Without label" }}
            name="eligible"
            id="eligible">
            <MenuItem value={"everyone"}>Everyone can claim</MenuItem>
            <MenuItem value={"token"}>Anyone with certain token/NFT</MenuItem>
            <MenuItem value={"csv"}>Upload custom CSV file</MenuItem>
          </Select>
        </FormControl>
        <Typography className={classes.text}>
          Only wallets that hold certain token/NFT can claim the drop.
        </Typography>
        {/* if token/nft selected  */}
        {values.eligible === "everyone" || values.eligible === "token" ? (
          <>
            {/* Token/NFT address */}

            {values.eligible === "token" && (
              <>
                <Typography className={classes.label}>
                  Add token (or) NFT
                </Typography>
                <TextField
                  error={
                    formik.touched.daoTokenAddress &&
                    Boolean(formik.errors.daoTokenAddress)
                  }
                  helperText={
                    formik.touched.daoTokenAddress &&
                    formik.errors.daoTokenAddress
                  }
                  onChange={formik.handleChange}
                  value={values.daoTokenAddress}
                  name="daoTokenAddress"
                  id="daoTokenAddress"
                  variant="outlined"
                />

                {values.maximumClaim !== "proRata" && (
                  <>
                    <Typography className={classes.label}>
                      Token Gating Amount
                    </Typography>
                    <TextField
                      error={
                        formik.touched.tokenGatingAmt &&
                        Boolean(formik.errors.tokenGatingAmt)
                      }
                      helperText={
                        formik.touched.tokenGatingAmt &&
                        formik.errors.tokenGatingAmt
                      }
                      onChange={formik.handleChange}
                      value={values.tokenGatingAmt}
                      name="tokenGatingAmt"
                      id="tokenGatingAmt"
                      variant="outlined"
                    />
                  </>
                )}
              </>
            )}

            <Typography
              className={classes.label}
              sx={values.eligible === "everyone" && { display: "none" }}>
              What is the maximum claim allowed per token holder?
            </Typography>
            <RadioGroup
              aria-labelledby="demo-controlled-radio-buttons-group"
              sx={values.eligible === "everyone" && { display: "none" }}
              // name="controlled-radio-buttons-group"
              value={values.maximumClaim}
              onChange={formik.handleChange}
              name="maximumClaim"
              id="maximumClaim">
              <FormControlLabel
                disabled={values.eligible === "everyone"}
                // disabled
                value="proRata"
                control={<Radio />}
                // sx={values.eligible === "everyone" && { display: "none" }}
                label="Pro-rata as per share of tokens held"
              />
              <FormControlLabel
                value="custom"
                control={<Radio />}
                label="Set a custom amount"
              />
            </RadioGroup>

            {/* Number of Tokens */}

            {values.maximumClaim === "proRata" && (
              <>
                <Typography className={classes.label}>
                  Select network on which gated-token is present *
                </Typography>
                <FormControl sx={{ width: "100%" }}>
                  <Select
                    value={values.tokenGatedNetwork}
                    onChange={formik.handleChange}
                    inputProps={{ "aria-label": "Without label" }}
                    name="tokenGatedNetwork"
                    id="tokenGatedNetwork">
                    <MenuItem selected value={"eth-mainnet"}>
                      Ethereum
                    </MenuItem>
                    <MenuItem value={"matic-mainnet"}>Polygon</MenuItem>
                    <MenuItem value={"bsc-mainnet"}>BNB Smart Chain</MenuItem>
                  </Select>
                </FormControl>

                <Typography className={classes.label}>
                  Enter block number (optional)
                </Typography>
                <TextField
                  variant="outlined"
                  name="blockNumber"
                  id="blockNumber"
                  value={formik.values.blockNumber}
                  onChange={formik.handleChange}
                  type="number"
                  error={
                    formik.touched.blockNumber &&
                    Boolean(formik.errors.blockNumber)
                  }
                  helperText={
                    formik.touched.blockNumber && formik.errors.blockNumber
                  }
                />
              </>
            )}

            {(values.maximumClaim === "custom" ||
              values.eligible === "everyone") && (
              <>
                <Typography className={classes.label}>Enter Amount</Typography>
                <TextField
                  value={values.customAmount}
                  onChange={formik.handleChange}
                  error={
                    formik.touched.customAmount &&
                    Boolean(formik.errors.customAmount)
                  }
                  helperText={
                    formik.touched.customAmount && formik.errors.customAmount
                  }
                  type="number"
                  name="customAmount"
                  id="customAmount"
                  onWheel={(event) => event.target.blur()}
                />
              </>
            )}
          </>
        ) : (
          <>
            <Typography className={classes.label}>
              Upload your CSV file
            </Typography>

            <div style={{ display: "flex", alignItems: "center", gap: "20px" }}>
              <TextField
                className={classes.input}
                onClick={handleClick}
                onChange={handleChange}
                disabled
                value={file?.name}
              />
              <Button onClick={handleClick} variant="normal">
                Upload
              </Button>
              <input
                type="file"
                accept=".csv"
                ref={hiddenFileInput}
                onChange={handleChange}
                style={{ display: "none" }}
              />
            </div>
            <Typography className={classes.text}>
              Download sample from{" "}
              <span style={{ color: "white" }}>
                <Link href={"/assets/csv/sample.csv"}>here</Link>
              </span>
            </Typography>

            {csvError && (
              <Typography className={classes.error}>
                Your tokens for airdrops are lesser than the number of tokens in
                CSV.
              </Typography>
            )}
          </>
        )}

        {finish ? (
          <Button
            onClick={() => {
              router.push(`/claims/`);
            }}
            variant="contained"
            className={classes.finish}>
            Go back to claims
          </Button>
        ) : (
          <Button
            disabled={isButtonDisabled()}
            onClick={formik.handleSubmit}
            className={classes.btn}>
            {loading || loadingCsv ? <CircularProgress /> : "Finish"}
          </Button>
        )}
      </form>
    </>
  );
};

export default ClaimStep2;
