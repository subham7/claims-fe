import {
  Button,
  FormControl,
  InputAdornment,
  InputLabel,
  MenuItem,
  Select,
  TextField,
  Typography,
  CircularProgress,
} from "@mui/material";
import { BsArrowLeft } from "react-icons/bs";
import { makeStyles } from "@mui/styles";
import React, { useEffect, useState } from "react";
import * as yup from "yup";
import { useFormik } from "formik";
import { useRouter } from "next/router";
import { useDispatch } from "react-redux";
import { IoWalletSharp } from "react-icons/io5";
import { BsFillSendFill } from "react-icons/bs";
import { addUserData } from "../../src/redux/reducers/createClaim";
import { getTokensFromWallet } from "../../src/api/token";
import Web3 from "web3";

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

  selectContainer: {
    border: "0.5px solid #6475A3",
    display: "flex",
    borderRadius: "10px",
  },
  leftContainer: {
    "flex": "0.5",
    "display": "flex",
    "alignItems": "center",
    "justifyContent": "center",
    "padding": "20px",
    "flexDirection": "column",
    "borderRadius": "10px",
    "cursor": "pointer",
    "border": "1px solid none",

    "&:hover": {
      border: "1px solid #3B7AFD",
      borderRadius: "10px",
      opacity: 1,
    },
  },
  rightContainer: {
    "flex": "0.5",
    "display": "flex",
    "alignItems": "center",
    "justifyContent": "center",
    "padding": "20px",
    "flexDirection": "column",
    "borderRadius": "10px",
    "cursor": "pointer",
    "border": "1px solid none",
    "&:hover": {
      border: "1px solid #3B7AFD",
      borderRadius: "10px",
      opacity: 1,
    },
  },
  selectedContainer: {
    flex: "0.5",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    padding: "20px",
    flexDirection: "column",
    cursor: "pointer",
    border: "1px solid #3B7AFD",
    borderRadius: "10px",
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
  loaderDiv: {
    height: "100vh",
    width: "100vw",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
  },
});

// const validationSchema = yup.object({
//   email: yup
//     .string("Enter your email")
//     .email("Enter a valid email")
//     .required("Email is required"),
//   LLC_name: yup
//     .string("Enter LLC Name")
//     .required("LLC name is required")
//     .min(3, "LLC Name should be atleast 3 characters long"),
//   admin_name: yup
//     .string("Enter Admin's name")
//     .required("Admin name is required"),
//   location: yup
//     .string("Enter arbitration location")
//     .required("Arbitration location is required"),
//   general_purpose: yup.string("Enter general purpose"),
// });

const validationSchema = yup.object({
  description: yup
    .string("Enter one-liner description")
    .required("description is required"),
  rollbackAddress: yup.string("Enter rollback address"),
  // .required("Rollback address is required"),
  numberOfTokens: yup
    .number()
    .required("Enter amount of tokens")
    .moreThan(0, "Amount should be greater than 0"),
  startDate: yup
    .date()
    .required("start date is required")
    .min(new Date().toISOString()),
  endDate: yup
    .date()
    .required("end date is required")
    .min(yup.ref("startDate")),
});

const CreateClaim = () => {
  const classes = useStyles();
  const router = useRouter();

  // const todayDate = console.log(todayDate);

  const [selectedWallet, setSelectedWallet] = useState(false);
  const [selectedContract, setSelectedContract] = useState(false);
  const [recieveTokens, setRecieveTokens] = useState("immediately");
  const [tokensInWallet, setTokensInWallet] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedToken, setSelectedToken] = useState("");
  const [currentAccount, setCurrentAccount] = useState("");

  const dispatch = useDispatch();

  const formik = useFormik({
    initialValues: {
      description: "",
      rollbackAddress: "",
      numberOfTokens: "",
      startDate: "",
      endDate: "",
      airdropTokens: "",
    },
    validationSchema: validationSchema,
    onSubmit: (values) => {
      const data = {
        ...values,
        recieveTokens: recieveTokens,
        airdropTokens: selectedToken.tokenName,
        walletAddress: currentAccount,
        airdropTokenAddress: selectedToken.tokenAddress,
      };

      console.log(data);

      dispatch(addUserData(data));
      router.push("/claims/Step2");
    },
  });

  const backHandler = () => {
    router.push("/claims");
  };

  const getCurrentAccount = async () => {
    setIsLoading(true);
    const web3 = new Web3(window.ethereum);

    // current account
    const accounts = await web3.eth.getAccounts();
    setCurrentAccount(accounts[0].toLowerCase());
    const data = await getTokensFromWallet(accounts[0]);
    setTokensInWallet(data);
    setIsLoading(false);
  };

  // when to recieve tokens
  const recieveTokenHandler = (event) => {
    setRecieveTokens(event.target.value);
  };

  const changeSelectedTokenHandler = (event) => {
    setSelectedToken(event.target.value);
    // console.log(event.target.value);
  };

  useEffect(() => {
    getCurrentAccount();
  }, []);

  return (
    <>
      <Typography onClick={backHandler} className={classes.back}>
        <BsArrowLeft /> Back to claims
      </Typography>

      {/* <Typography className={classes.step}>Step 1/2</Typography> */}

      <form onSubmit={formik.handleSubmit} className={classes.form}>
        <Typography className={classes.title}>
          Create a new claim page
        </Typography>

        {/* Description of claim page */}
        <Typography className={classes.label}>
          Add a one-liner description
        </Typography>
        <TextField
          variant="outlined"
          className={classes.input}
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
          Where do you want to airdrop tokens from?{" "}
        </Typography>

        <div className={classes.selectContainer}>
          <div
            onClick={() => {
              setSelectedContract(false);
              setSelectedWallet(true);
            }}
            className={`${
              selectedWallet ? classes.selectedContainer : classes.leftContainer
            }`}
          >
            <IoWalletSharp size={20} />
            <p>My Wallet</p>
          </div>

          <div
            onClick={() => {
              setSelectedWallet(false);
              setSelectedContract(true);
            }}
            className={`${
              selectedContract
                ? classes.selectedContainer
                : classes.rightContainer
            }`}
          >
            <BsFillSendFill size={20} />
            <p>StationX Contract</p>
          </div>
        </div>

        {/* Roll back address */}
        {selectedContract && (
          <>
            <Typography className={classes.label}>
              Add a roll back Adress
            </Typography>
            <TextField
              variant="outlined"
              className={classes.input}
              name="rollbackAddress"
              id="rollbackAddress"
              value={formik.values.rollbackAddress}
              onChange={formik.handleChange}
              // error={
              //   formik.touched.rollbackAddress &&
              //   Boolean(formik.errors.rollbackAddress)
              // }
              helperText={
                formik.touched.rollbackAddress && formik.errors.rollbackAddress
              }
            />
            <Typography className={classes.text}>
              Tokens that remain in the contract are sent to this address
              automatically after the drop. You can roll back tokens anytime via
              the dashboard too.
            </Typography>
          </>
        )}

        {/* Choose Token */}
        <Typography className={classes.label}>
          Choose token to airdrop
        </Typography>
        <FormControl sx={{ width: "100%" }}>
          {isLoading ? (
            <TextField
              className={classes.text}
              disabled
              placeholder="Loading tokens..."
            />
          ) : (
            <Select
              onChange={changeSelectedTokenHandler}
              displayEmpty
              inputProps={{ "aria-label": "Without label" }}
            >
              {tokensInWallet?.map((token, i) => (
                <MenuItem key={i} value={token}>
                  {/* {console.log(token)} */}
                  {token?.tokenSymbol}
                </MenuItem>
              ))}
            </Select>
          )}
        </FormControl>
        <Typography className={classes.text}>
          You can choose any token held in your wallet connected to StationX
        </Typography>

        {/* Number of Tokens */}
        <Typography className={classes.label}>Number of Tokens</Typography>
        <TextField
          className={classes.input}
          type="number"
          InputProps={{
            endAdornment: (
              <InputAdornment style={{ color: "#6475A3" }} position="end">
                Balance: {selectedToken ? selectedToken.tokenBalance : "0"}
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
            formik.values.numberOfTokens > selectedToken.tokenBalance
          }
          helperText={
            (formik.touched.numberOfTokens && formik.errors.numberOfTokens) ||
            formik.values.numberOfTokens > selectedToken.tokenBalance
          }
        />

        <div style={{ display: "flex", gap: "30px", alignItems: "center" }}>
          {/* Claim Start */}

          <div style={{ width: "100%" }}>
            <Typography className={classes.label}>Claims start on</Typography>
            <TextField
              className={classes.input}
              type="datetime-local"
              name="startDate"
              id="startDate"
              value={formik.values.startDate}
              onChange={formik.handleChange}
              error={
                formik.touched.startDate && Boolean(formik.errors.startDate)
              }
              helperText={formik.touched.startDate && formik.errors.startDate}
            />
          </div>

          {/* Claim End */}

          <div style={{ width: "100%" }}>
            <Typography className={classes.label}>Claims end on</Typography>
            <TextField
              className={classes.input}
              type="datetime-local"
              name="endDate"
              id="endDate"
              value={formik.values.endDate}
              onChange={formik.handleChange}
              error={formik.touched.endDate && Boolean(formik.errors.endDate)}
              helperText={formik.touched.endDate && formik.errors.endDate}
            />
          </div>
        </div>

        {/* when to receive */}
        <Typography className={classes.label}>
          When do they receive tokens after claiming?
        </Typography>
        <FormControl sx={{ width: "100%" }}>
          <Select
            onChange={recieveTokenHandler}
            value={recieveTokens}
            inputProps={{ "aria-label": "Without label" }}
          >
            <MenuItem value={"week"}>After 1 week </MenuItem>
            <MenuItem value={"immediately"}>Immediately</MenuItem>
          </Select>
        </FormControl>

        {/* Next */}
        <Button
          // onClick={nextHandler}
          type="submit"
          variant="contained"
          className={classes.btn}
        >
          Next
        </Button>
      </form>
    </>
  );
};

export default CreateClaim;
