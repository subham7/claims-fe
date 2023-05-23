import React from "react";
import { useFormik } from "formik";
import * as yup from "yup";
import { Button, InputAdornment, TextField, Typography } from "@mui/material";
import { makeStyles } from "@mui/styles";
import Layout1 from "../../../../../src/components/layouts/layout1";
import { useRouter } from "next/router";
import { useDispatch } from "react-redux";
import {
  addEncryptedLink,
  addMembersData,
} from "../../../../../src/redux/reducers/legal";

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
    fontFamily: "sans-serif",
    fontSize: "16px",
    marginTop: "20px",
  },
  text: {
    color: "#6475A3",
    fontSize: "15px",
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
  amount: yup
    .number()
    .required("Enter amount of USDC to deposit in station")
    .moreThan(0, "Amount should be greater than 0"),
});

const MembersSign = () => {
  const router = useRouter();
  const { membersSign, clubId } = router.query;

  const dispatch = useDispatch();

  const classes = useStyles();

  const formik = useFormik({
    initialValues: {
      member_email: "",
      member_name: "",
      amount: "",
    },
    validationSchema: validationSchema,
    onSubmit: (values) => {
      dispatch(addMembersData(values));
      dispatch(addEncryptedLink(membersSign));

      router.push(`/dashboard/${clubId}/documents/legalEntity/signDoc`);
    },
  });

  return (
    <>
      <Layout1>
        <form className={classes.form} onSubmit={formik.handleSubmit}>
          {/* Title */}
          <Typography className={classes.title}>Sign legal document</Typography>

          {/* Member's Name */}
          <Typography className={classes.label}>Member&apos;s Name</Typography>
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

          {/* Deposit Amount */}
          <Typography className={classes.label}>Deposit Amount</Typography>
          <TextField
            placeholder="Amount in USDC"
            variant="outlined"
            name="amount"
            id="amount"
            type="number"
            className={classes.input}
            InputProps={{
              endAdornment: (
                <InputAdornment position="end">USDC</InputAdornment>
              ),
            }}
            value={formik.values.amount}
            onChange={formik.handleChange}
            error={formik.touched.amount && Boolean(formik.errors.amount)}
            helperText={formik.touched.amount && formik.errors.amount}
          />

          <Typography className={classes.text}>
            What is the amount of USDC you&apos;re going to deposit into this
            station?
          </Typography>

          {/* Email */}
          <Typography className={classes.label}>E-mail</Typography>
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
            helperText={
              formik.touched.member_email && formik.errors.member_email
            }
            className={classes.input}
          />

          <Button type="submit" variant="contained" className={classes.btn}>
            Next
          </Button>
        </form>
      </Layout1>
    </>
  );
};

export default MembersSign;
