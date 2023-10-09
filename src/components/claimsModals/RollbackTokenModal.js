import { Typography } from "@mui/material";
import { Button, TextField } from "@components/ui";
import { useFormik } from "formik";
import React from "react";
import { ClaimModalStyles } from "./ClaimModalStyles";
import ModalCard from "./ModalCard";
import * as yup from "yup";

const RollbackTokenModal = ({ onClose, rollbackTokensHandler }) => {
  const classes = ClaimModalStyles();

  const formik = useFormik({
    initialValues: {
      rollbackAddress: "",
      rollbackAmount: 0,
    },
    validationSchema: yup.object({
      rollbackAmount: yup.number().required("No. of Tokens is required"),
      rollbackAddress: yup.string().required("Rollback address is required"),
    }),
    onSubmit: (value) => {
      rollbackTokensHandler(value.rollbackAmount, value.rollbackAddress);
      onClose();
    },
  });
  return (
    <ModalCard onClose={onClose}>
      <h2 className={classes.title}>Rollback unclaimed tokens</h2>
      <p className={classes.subtitle}>
        Rollback the unclaimed tokens will be sent to this address.
      </p>
      <form>
        <Typography className={classes.label}>
          Enter an address to claim the tokens*
        </Typography>
        <TextField
          variant="outlined"
          name="rollbackAddress"
          id="rollbackAddress"
          placeholder="Paste address here"
          type="text"
          value={formik.values.rollbackAddress}
          onChange={formik.handleChange}
          error={
            formik.touched.rollbackAddress &&
            Boolean(formik.errors.rollbackAddress)
          }
          helperText={
            formik.touched.rollbackAddress && formik.errors.rollbackAddress
          }
        />

        <Typography className={classes.label}>
          Enter the amount to rollback*
        </Typography>
        <TextField
          variant="outlined"
          className={classes.input}
          name="rollbackAmount"
          id="rollbackAmount"
          placeholder="eg. 1000"
          type="number"
          value={formik.values.rollbackAmount}
          onChange={formik.handleChange}
          error={
            formik.touched.rollbackAmount &&
            Boolean(formik.errors.rollbackAmount)
          }
          helperText={
            formik.touched.rollbackAmount && formik.errors.rollbackAmount
          }
        />

        <div className={classes.buttonContainers}>
          <Button onClick={onClose}>Cancel</Button>
          <Button
            onClick={formik.handleSubmit}
            disabled={
              !formik.values.rollbackAddress ||
              formik.values.rollbackAmount <= 0
            }>
            Claim
          </Button>
        </div>
      </form>
    </ModalCard>
  );
};

export default RollbackTokenModal;
