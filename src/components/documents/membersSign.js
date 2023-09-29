import React from "react";
import { useFormik } from "formik";
import * as yup from "yup";
import { Button, TextField, Typography } from "@mui/material";
import { makeStyles } from "@mui/styles";
import { useRouter } from "next/router";
import { useDispatch } from "react-redux";
import { addEncryptedLink, addMembersData } from "redux/reducers/legal";
import { useAccount } from "wagmi";

const useStyles = makeStyles({
  form: {
    display: "flex-col",
    alignItems: "center",
    justifyContent: "center",
    margin: "130px auto",
    width: "550px",
  },

  title: {
    fontSize: "36px",
    fontWeight: "500",
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
});

const validationSchema = yup.object({
  member_email: yup
    .string("Enter your email")
    .email("Enter a valid email")
    .required("Email is required"),
  member_name: yup
    .string("Enter member's name")
    .required("Member's name is required")
    .min(3, "Member's name should be atleast 3 characters long"),
  // amount: yup
  //   .number()
  //   .required("Enter amount of USDC to deposit in station")
  //   .moreThan(0, "Amount should be greater than 0"),
});

const MembersSign = ({ daoAddress, membersSign, networkId }) => {
  const router = useRouter();
  const { address: walletAddress } = useAccount();

  const dispatch = useDispatch();

  const classes = useStyles();

  const formik = useFormik({
    initialValues: {
      member_email: "",
      member_name: "",
      address: "",
      phone: null,
      // amount: "",
      nomination_name: "",
      witness_name: "",
    },
    validationSchema: validationSchema,
    onSubmit: (values) => {
      dispatch(addMembersData(values));
      dispatch(addEncryptedLink(membersSign));
      router.push(`/documents/${daoAddress}/${networkId}/sign`);
    },
  });

  return (
    <>
      <form className={classes.form} onSubmit={formik.handleSubmit}>
        <Typography className={classes.title}>Sign legal document</Typography>
        <Typography className={classes.label}>Member&apos;s Name *</Typography>
        <TextField
          placeholder="Member's full name"
          variant="outlined"
          name="member_name"
          id="member_name"
          value={formik.values.member_name}
          onChange={formik.handleChange}
          error={
            formik.touched.member_name && Boolean(formik.errors.member_name)
          }
          helperText={formik.touched.member_name && formik.errors.member_name}
          className={classes.input}
        />
        <Typography className={classes.label}>Address</Typography>
        <TextField
          placeholder="Address"
          variant="outlined"
          name="address"
          id="address"
          value={formik.values.address}
          onChange={formik.handleChange}
          error={formik.touched.address && Boolean(formik.errors.address)}
          helperText={formik.touched.address && formik.errors.address}
          className={classes.input}
        />
        <Typography className={classes.label}>Phone Number</Typography>
        <TextField
          type="number"
          placeholder="xxxxx-xxxxx"
          variant="outlined"
          name="phone"
          id="phone"
          value={formik.values.phone}
          onChange={formik.handleChange}
          error={formik.touched.phone && Boolean(formik.errors.phone)}
          helperText={formik.touched.phone && formik.errors.phone}
          className={classes.input}
        />
        {/* <Typography className={classes.label}>Deposit Amount</Typography>
        <TextField
          placeholder="Amount in USDC"
          variant="outlined"
          name="amount"
          id="amount"
          type="number"
          className={classes.input}
          InputProps={{
            endAdornment: <InputAdornment position="end">USDC</InputAdornment>,
          }}
          value={formik.values.amount}
          onChange={formik.handleChange}
          error={formik.touched.amount && Boolean(formik.errors.amount)}
          helperText={formik.touched.amount && formik.errors.amount}
          onWheel={(event) => event.target.blur()}
        />

        <Typography className={classes.text}>
          What is the amount of USDC you&apos;re going to deposit into this
          station?
        </Typography> */}

        <Typography className={classes.label}>E-mail *</Typography>
        <TextField
          placeholder="Email address"
          variant="outlined"
          name="member_email"
          id="member_email"
          value={formik.values.member_email}
          onChange={formik.handleChange}
          error={
            formik.touched.member_email && Boolean(formik.errors.member_email)
          }
          helperText={formik.touched.member_email && formik.errors.member_email}
          className={classes.input}
        />
        <Typography className={classes.label}>Nomination Name</Typography>
        <TextField
          placeholder="Nomination full name"
          variant="outlined"
          name="nomination_name"
          id="nomination_name"
          value={formik.values.nomination_name}
          onChange={formik.handleChange}
          error={
            formik.touched.nomination_name &&
            Boolean(formik.errors.nomination_name)
          }
          helperText={
            formik.touched.nomination_name && formik.errors.nomination_name
          }
          className={classes.input}
        />
        <Typography className={classes.label}>Witness Name</Typography>
        <TextField
          placeholder="Witness full name"
          variant="outlined"
          name="witness_name"
          id="witness_name"
          value={formik.values.witness_name}
          onChange={formik.handleChange}
          error={
            formik.touched.witness_name && Boolean(formik.errors.witness_name)
          }
          helperText={formik.touched.witness_name && formik.errors.witness_name}
          className={classes.input}
        />

        <Button type="submit" variant="contained" className={classes.btn}>
          Next
        </Button>
      </form>
    </>
  );
};

export default MembersSign;
