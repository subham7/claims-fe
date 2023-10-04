import { Grid, Typography } from "@mui/material";
import { TextField } from "@components/ui";
import Button from "@components/ui/button/Button";
import { makeStyles } from "@mui/styles";
import { useFormik } from "formik";
import * as yup from "yup";

import React from "react";
import BackdropLoader from "@components/common/BackdropLoader";

const useStyles = makeStyles({
  container: {
    background: "#151515",
    width: "650px",
    borderRadius: "20px",
    padding: "80px 50px",
    display: "flex",
    flexDirection: "column",
    position: "fixed",
    top: "50%",
    left: "50%",
    transform: "translateX(-50%) translateY(-50%)",
    zIndex: "2000",
  },
});

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
      <BackdropLoader isOpen={true} forLoading={false}>
        <div className={classes.container}>
          <Typography
            sx={{ textAlign: "left", fontSize: "24px", marginBottom: "8px" }}>
            Update Owner Fees (%){" "}
          </Typography>
          <form style={{ width: "100%" }}>
            <TextField
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
      </BackdropLoader>
    </>
  );
};

export default DepositOwnerFee;
