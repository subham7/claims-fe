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
import React, { useEffect, useRef, useState } from "react";
import { SmartContract } from "../../../src/api/contract";
import claimContractABI from "../../../src/abis/singleClaimContract.json";
import usdcTokenContract from "../../../src/abis/usdcTokenContract.json";
import { convertToWeiGovernance } from "../../../src/utils/globalFunctions";
import keccak256 from "keccak256";
import { useConnectWallet } from "@web3-onboard/react";
import { useDispatch } from "react-redux";
import { addMerkleLeaves } from "../../redux/reducers/createClaim";

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

const ClaimStep2 = ({ handleBack, formik }) => {
  const { values } = formik;

  // console.log(data);

  const classes = useStyles();
  const [{ wallet }] = useConnectWallet();
  const walletAddress = wallet?.accounts[0].address;
  const dispatch = useDispatch();

  const hiddenFileInput = useRef(null);
  // const claimsContractAddress = CLAIM_FACTORY_ADDRESS;

  const [file, setFile] = useState("");
  const [merkleLeaves, setMerkleLeaves] = useState([]);
  const [CSVObject, setCSVObject] = useState([]);

  const handleClick = (event) => {
    hiddenFileInput.current.click();
    console.log(hiddenFileInput.current.value);
  };

  const handleChange = (event) => {
    const fileUploaded = event.target.files[0];
    console.log(fileUploaded);
    setFile(fileUploaded);

    // new instance of fileReader class
    const reader = new FileReader();

    if (fileUploaded) {
      reader.readAsText(fileUploaded);

      // converting .csv file into array of objects
      reader.onload = async (event) => {
        const csvData = event.target.result;
        // const csvArray = csvData.split("\r\n").map((data) => console.log(data));

        const csvArr = csvData
          .split("\r\n")
          .map((data) => data.split(","))
          .map((data) => ({
            address: data[0].toLowerCase(),
            amount: +data[1],
          }));

        setCSVObject(csvArr);
        console.log("csv arrr", csvArr);

        try {
          // claim contract for encoding
          const claimContract = new SmartContract(
            claimContractABI,
            "0x9517a0de2c29C926684F88FDA6E5c5cCa4c47633",
            walletAddress,
            undefined,
            undefined,
          );

          console.log(claimContract);
          console.log(values.airdropTokenAddress);

          const erc20contract = new SmartContract(
            usdcTokenContract,
            values.airdropTokenAddress,
            walletAddress,
            undefined,
            undefined,
          );

          const decimals = await erc20contract.decimals();

          console.log("decimals", decimals);

          // csvArr.map(async (data) => (
          //   const res = await claimContract.encode(
          //     data.address,
          //     convertToWeiGovernance(data.amount, decimals),
          //   );
          //   encodedListOfLeaves.push(2);
          //   console.log(typeof res);
          //   return null
          // ));
          let encodedListOfLeaves = [];
          csvArr.map(async (data) => {
            console.log("claimContract", data.address);
            const res = await claimContract.encode(
              data.address,
              convertToWeiGovernance(data.amount, decimals).toString(),
            );
            console.log(res);
            encodedListOfLeaves.push(keccak256(res));
          });
          console.log("encodedListOfLeaves", encodedListOfLeaves);
          // encoding leaves
          // csvArr.map(async (data) => {
          //   console.log("address", data.address);
          //   console.log(
          //     "amount",
          //     convertToWeiGovernance(data.amount, decimals),
          //   );

          //   const res = await claimContract.encode(
          //     data.address,
          //     convertToWeiGovernance(data.amount, decimals),
          //   );
          //   // console.log(keccak256(res));

          //   // console.log(encodedListOfLeaves.length);
          //   if (encodedListOfLeaves.length <= 0) {
          //     encodedListOfLeaves = [keccak256(res)];
          //   } else {
          //     encodedListOfLeaves.push(keccak256(res));
          //   }
          // });

          // console.log(encodedListOfLeaves);
          // setMerkleLeaves(newArr);
          // dispatch(addMerkleLeaves(newArr));

          // console.log(encodedListOfLeaves);
        } catch (err) {
          console.log(err);
        }
      };
    }
  };

  useEffect(() => {
    console.log(file);
  }, [file]);

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
            id="eligible"
          >
            <MenuItem value={"everyone"}>Everyone</MenuItem>
            <MenuItem value={"token"}>Anyone with certain token/NFT</MenuItem>
            <MenuItem value={"csv"}>Upload custom CSV file</MenuItem>
          </Select>
        </FormControl>
        <Typography className={classes.text}>
          Only wallets that hold certain token/NFT can claim the drop.
        </Typography>
        {/* if token/nft selected  */}
        {values.eligible === "token" ? (
          <>
            {/* Token/NFT address */}

            <Typography className={classes.label}>
              Add token (or) NFT
            </Typography>
            <TextField
              // required={maximumTokenType === "proRata" ? true : false}
              // error={maximumTokenType === "proRata" && !daoToken.length}
              onChange={formik.handleChange}
              value={values.daoTokenAddress}
              name="daoTokenAddress"
              id="daoTokenAddress"
              variant="outlined"
              className={classes.input}
            />

            <Typography className={classes.label}>
              What is the maximum claim allowed per token holder?
            </Typography>
            <RadioGroup
              aria-labelledby="demo-controlled-radio-buttons-group"
              // name="controlled-radio-buttons-group"
              value={values.maximumClaim}
              onChange={formik.handleChange}
              name="maximumClaim"
              id="maximumClaim"
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

            {values.maximumClaim === "custom" && (
              <>
                <Typography className={classes.label}>Enter Amount</Typography>
                <TextField
                  required
                  // error={userData?.numberOfTokens < customAmount}
                  className={classes.input}
                  value={values.customAmount}
                  onChange={formik.handleChange}
                  type="number"
                  name="customAmount"
                  id="customAmount"
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
              <Button onClick={handleClick} className={classes.uploadBtn}>
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
          </>
        )}

        {/* Next */}
        {/* {finish ? (
          <Button
            type="button"
            onClick={() => {
              router.push("/claims");
            }}
            variant="contained"
            className={classes.finish}
          >
            Go back to claims
          </Button>
        ) : (
          <Button
            // disabled={eligible === "csv" ? true : false}
            type="submit"
            variant="contained"
            className={classes.btn}
          >
            {loading ? <CircularProgress /> : "Finish"}
          </Button>
        )} */}

        <Button
          variant="contained"
          onClick={formik.handleSubmit}
          className={classes.finish}
        >
          Finish
        </Button>
      </form>
    </>
  );
};

export default ClaimStep2;
