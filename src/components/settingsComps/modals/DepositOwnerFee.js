import { Grid, TextField, Typography } from "@mui/material";
import Button from "@components/ui/button/Button";
import { makeStyles } from "@mui/styles";
import { useFormik } from "formik";
import * as yup from "yup";

import React from "react";

const useStyles = makeStyles({
  container: {
    background: "#19274A",
    width: "650px",
    borderRadius: "20px",
    padding: "80px 50px",
    border: "0.5px solid #6475A3",
    display: "flex",
    flexDirection: "column",
    position: "fixed",
    top: "50%",
    left: "50%",
    transform: "translateX(-50%) translateY(-50%)",
    zIndex: "2000",
  },
  backdrop: {
    position: "fixed",
    top: "0",
    left: "0",
    height: "100vh",
    width: "100vw",
    background: "#000",
    opacity: "70%",
    zIndex: "2000",
  },
});

const CustomBackdrop = ({ onClick }) => {
  const classes = useStyles();

  return <div onClick={onClick} className={classes.backdrop}></div>;
};

const DepositOwnerFee = ({ updateOwnerFeesHandler, onClose, loading }) => {
  const classes = useStyles();

  const formik = useFormik({
    initialValues: {
      ownerFee: "",
    },
    validationSchema: yup.object({
      ownerFee: yup
        .number()
        .required("Owner fee is required")
        .moreThan(0, "Owner fee should be greater than 0")
        .lessThan(100),
    }),
    onSubmit: (value) => {
      updateOwnerFeesHandler(value.ownerFee);
      onClose();
    },
  });

  return (
    <>
      <CustomBackdrop onClick={onClose} />
      <div className={classes.container}>
        <Typography
          sx={{ textAlign: "left", fontSize: "24px", marginBottom: "8px" }}>
          Update Owner Fees (%){" "}
        </Typography>
        <form style={{ width: "100%" }}>
          <TextField
            sx={{ width: "100%" }}
            type="number"
            placeholder="Enter owner fees in percentage"
            name="ownerFee"
            id="ownerFee"
            value={formik.values.ownerFee}
            onChange={formik.handleChange}
            error={formik.touched.ownerFee && Boolean(formik.errors.ownerFee)}
            helperText={formik.touched.ownerFee && formik.errors.ownerFee}
            onWheel={(event) => event.target.blur()}
          />

          <Grid
            sx={{
              justifyContent: "center",
              display: "flex",
              gap: "30px",
              marginTop: "20px",
            }}>
            <Button onClick={formik.handleSubmit}>Update</Button>
            <Button onClick={onClose}>Cancel</Button>
          </Grid>
        </form>
      </div>
    </>
  );
};

export default DepositOwnerFee;
