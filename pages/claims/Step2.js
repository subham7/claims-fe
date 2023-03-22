import {
  Button,
  CircularProgress,
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
import { SmartContract } from "../../src/api/contract";
import claimContractFactory from "../../src/abis/claimContractFactory.json";
import usdcTokenContract from "../../src/abis/usdcTokenContract.json";
import { convertToWeiGovernance } from "../../src/utils/globalFunctions";
import { createClaim } from "../../src/api/claims";
import { CLAIM_FACTORY_ADDRESS } from "../../src/api";

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

  finish: {
    width: "200px",
    fontFamily: "sans-serif",
    fontSize: "16px",
    marginTop: "20px",
  },
});

const Step2 = () => {
  const classes = useStyles();
  const router = useRouter();

  const [file, setFile] = useState("");
  const [eligible, setEligible] = useState("token");
  const [maximumTokenType, setMaximumTokenType] = useState("custom");
  const [daoToken, setDaoToken] = useState("");
  const [customAmount, setCustomAmount] = useState(0);
  const [finish, setFinish] = useState(false);
  // const [message, setMessage] = useState(false);
  // const [claimAllowed, setClaimAllowed] = useState("equalTokens");
  // const [generatedClaimContract, setGeneratedClaimContract] = useState("");
  const [loading, setLoading] = useState("");

  const userData = useSelector((state) => {
    return state.createClaim.userData;
  });

  const hiddenFileInput = useRef(null);

  const backHandler = () => {
    router.push("/claims/createClaim");
  };

  const claimsContractAddress = CLAIM_FACTORY_ADDRESS;
  console.log(claimsContractAddress);

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
    setMaximumTokenType(event.target.value);
    console.log(event.target.value);
  };

  const finishHandler = (event) => {
    event.preventDefault();

    if (eligible === "token") {
      const data = {
        ...userData,
        eligible: eligible,
        daoToken: daoToken
          ? daoToken
          : "0x0000000000000000000000000000000000000000",
        maximumTokenType: maximumTokenType,
        customAmount: maximumTokenType === "custom" ? customAmount : 0,
      };

      console.log(data);

      // checking maximum claim is prorata or custom
      let maximumClaim;

      if (data.maximumTokenType === "custom") {
        maximumClaim = true;
        // daoToken = "0x0000000000000000000000000000000000000000";
      } else {
        maximumClaim = false;
      }

      // console.log(data);

      const loadClaimsContractData = async () => {
        try {
          const claimsContract = new SmartContract(
            claimContractFactory,
            claimsContractAddress,
            data.walletAddress,
            undefined,
            undefined,
          );

          // console.log(data.walletAddress, claimsContractAddress)

          const erc20contract = new SmartContract(
            usdcTokenContract,
            data.airdropTokenAddress,
            data.walletAddress,
            undefined,
            undefined,
          );

          console.log(data);
          const decimals = await erc20contract.decimals();
          setLoading(true);

          // approve erc20
          await erc20contract.approveDeposit(
            claimsContractAddress,
            data.numberOfTokens,
            decimals, // decimal
          );

          const claimsSettings = [
            data.walletAddress.toLowerCase(),
            data.airdropTokenAddress,
            data.daoToken,
            false, // false if token approved function called
            false,
            0,
            true,
            new Date(data.startDate).getTime() / 1000,
            new Date(data.endDate).getTime() / 1000,
            data.walletAddress.toLowerCase(),
            "0x0000000000000000000000000000000000000000000000000000000000000001",
            3,
            [
              maximumClaim,
              convertToWeiGovernance(data.customAmount, decimals),
              convertToWeiGovernance(data.numberOfTokens, decimals),
              [],
            ],
            [false, 0],
          ];

          const response = await claimsContract.claimContract(claimsSettings);

          setLoading(false);

          // post data in api

          const postData = JSON.stringify({
            description: data.description,
            airdropTokenContract: data.airdropTokenAddress,
            airdropTokenSymbol: data.airdropTokens,
            claimContract:
              response.events.ClaimContractDeployed.returnValues._claimContract,
            totalAmount: data.numberOfTokens,
            endDate: new Date(data.endDate).getTime() / 1000,
            startDate: new Date(data.startDate).getTime() / 1000,
            createdBy: data.walletAddress.toLowerCase(),
          });

          // console.log(typeof(postData))

          const res = createClaim(postData);
          console.log(res);
          setFinish(true);
          // router.push("/claims");
        } catch (err) {
          setLoading(true);
          console.log(err);
          setLoading(false);
        }
      };

      loadClaimsContractData();
    } else if (eligible === "csv") {
      const data = {
        ...userData,
        eligible: eligible,
      };
    }
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
              required={maximumTokenType === "proRata" ? true : false}
              error={maximumTokenType === "proRata" && !daoToken.length}
              onChange={(event) => {
                setDaoToken(event.target.value);
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
              value={maximumTokenType}
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

            {maximumTokenType === "custom" && (
              <>
                <Typography className={classes.label}>Enter Amount</Typography>
                <TextField
                  required
                  error={userData?.numberOfTokens < customAmount}
                  className={classes.input}
                  onChange={(event) => {
                    setCustomAmount(Number(event.target.value));
                    // console.log(Number(event.target.value))
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

        {finish ? (
          <Button type="button" onClick={() => {
            router.push('/claims')
          }} variant="contained" className={classes.finish}>
            Go back to claims
          </Button>
        ) : (
          <Button type="submit" variant="contained" className={classes.btn}>
            {loading ? <CircularProgress /> : "Finish"}
          </Button>
        )}
        
      </form>
    </>
  );
};

export default Step2;
