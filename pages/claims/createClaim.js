import {
  Button,
  FormControl,
  InputAdornment,
  InputLabel,
  MenuItem,
  Select,
  TextField,
  Typography,
} from "@mui/material";
import { BsArrowLeft } from "react-icons/bs";
import { makeStyles } from "@mui/styles";
import React, { useState } from "react";
import Layout1 from "../../src/components/layouts/layout1";
import * as yup from "yup";
import { useFormik } from "formik";
import { useRouter } from "next/router";
import Link from "next/link";
import { useDispatch } from "react-redux";
import { IoWalletSharp } from "react-icons/io5";
import { BsFillSendFill } from "react-icons/bs";
import { display, width } from "@mui/system";
// import { addAdminFormData } from "../../../../../src/redux/reducers/legal";

const useStyles = makeStyles({
  form: {
    display: "flex-col",
    alignItems: "center",
    justifyContent: "center",
    margin: "130px auto",
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

const CreateClaim = () => {
  const classes = useStyles();
  const router = useRouter();
  //   const dispatch = useDispatch()

  //   const { clubId } = router.query;

  //   const formik = useFormik({
  //     initialValues: {
  //       email: "",
  //       LLC_name: "",
  //       admin_name: "",
  //       location: "",
  //       general_purpose: "",
  //     },
  //     validationSchema: validationSchema,
  //     onSubmit: (values) => {
  //       console.log(values);
  //       // router.push(`/dashboard/${clubId}/documents/legalEntity/signDoc`)

  //       dispatch(addAdminFormData(values))
  //       router.push({
  //         pathname: `/dashboard/${clubId}/documents/legalEntity/signDoc`,
  //         query: {
  //           isAdmin: true
  //         }
  //       });
  //     },
  //   });

  const [selectedWallet, setSelectedWallet] = useState(false);
  const [selectedContract, setSelectedContract] = useState(false);

  const backHandler = () => {
    router.push("/claims");
  };

  return (
    <>
      <Typography onClick={backHandler} className={classes.back}>
        <BsArrowLeft /> Back to claims
      </Typography>
      <form className={classes.form}>
        <Typography className={classes.title}>
          Create a new claim page
        </Typography>

        {/* Description of claim page */}
        <Typography className={classes.label}>One line description</Typography>
        <TextField variant="outlined" className={classes.input} />

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
            <TextField variant="outlined" className={classes.input} />
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
          <Select displayEmpty inputProps={{ "aria-label": "Without label" }}>
            <MenuItem value="">
              <em>None</em>
            </MenuItem>
            <MenuItem value={"STX"}>STX</MenuItem>
            <MenuItem value={"ETH"}>ETH</MenuItem>
            <MenuItem value={"MATIC"}>MATIC</MenuItem>
          </Select>
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
                Balance: 579902
              </InputAdornment>
            ),
          }}
        />

        {/* Who can claim */}
        <Typography className={classes.label}>Who can claim?</Typography>
        <FormControl sx={{ width: "100%" }}>
          <Select displayEmpty inputProps={{ "aria-label": "Without label" }}>
            <MenuItem value="">
              <em>None</em>
            </MenuItem>
            <MenuItem value={0}>Holder of certain token/NFT </MenuItem>
            <MenuItem value={1}>Allowlist</MenuItem>
            <MenuItem value={2}>Pro rata</MenuItem>
            <MenuItem value={3}>Anyone can claim</MenuItem>
          </Select>
        </FormControl>

        {/* Max limit per wallet */}
        <Typography className={classes.label}>
          Max claim limit per wallet
        </Typography>
        <TextField
          className={classes.input}
          type="number"
          InputProps={{
            endAdornment: (
              <InputAdornment style={{ color: "#6475A3" }} position="end">
                STX
              </InputAdornment>
            ),
          }}
        />

        {/* Claim Start */}
        <Typography className={classes.label}>
          When does the claim start?
        </Typography>
        <TextField className={classes.input} type="date" />

        {/* Claim End */}
        <Typography className={classes.label}>
          When does the claim end?
        </Typography>
        <TextField className={classes.input} type="date" />

        {/* when to receive */}
        <Typography className={classes.label}>
          When do they receive tokens after claiming?
        </Typography>
        <FormControl sx={{ width: "100%" }}>
          <Select displayEmpty inputProps={{ "aria-label": "Without label" }}>
            <MenuItem value="">
              <em>None</em>
            </MenuItem>
            <MenuItem value={0}>After 1 week </MenuItem>
            <MenuItem value={1}>Immediately</MenuItem>
          </Select>
        </FormControl>

        {/* Next */}
        <Button type="submit" variant="contained" className={classes.btn}>
          Next
        </Button>
      </form>
    </>
  );
};

export default CreateClaim;
