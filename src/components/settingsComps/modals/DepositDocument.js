import { Grid, TextField, Typography } from "@mui/material";
import { Button } from "@components/ui";
import { makeStyles } from "@mui/styles";

import dayjs from "dayjs";
import { useFormik } from "formik";
import React from "react";
import * as yup from "yup";

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
    zIndex: "1",
  },
  backdrop: {
    position: "fixed",
    top: "0",
    left: "0",
    height: "100vh",
    width: "100vw",
    background: "#000",
    opacity: "70%",
    zIndex: "1",
  },
});

const CustomBackdrop = ({ onClick }) => {
  const classes = useStyles();

  return <div onClick={onClick} className={classes.backdrop}></div>;
};

const DepositDocument = ({ updateDocumentLink, onClose, loading }) => {
  // const [depositTime, setDepositTime] = useState(dayjs(Date.now() + 300000));

  const formik = useFormik({
    initialValues: {
      depositTime: dayjs(Date.now() + 300000),
    },
    validationSchema: yup.object({
      depositTime: yup.date().required("Deposit time is required"),
    }),
    onSubmit: (value) => {
      updateDocumentLink(value.documentLink);
      onClose();
    },
  });

  const classes = useStyles();

  return (
    <>
      <CustomBackdrop onClick={onClose} />
      <div className={classes.container}>
        <Typography
          sx={{ textAlign: "left", fontSize: "24px", marginBottom: "8px" }}>
          Update Document Link
        </Typography>

        <form style={{ width: "100%" }}>
          <TextField
            name="documentLink"
            label="https://"
            variant="outlined"
            fullWidth
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            value={formik.values.documentLink}
            error={
              formik.touched.documentLink && Boolean(formik.errors.documentLink)
            }
            helperText={
              formik.touched.documentLink && formik.errors.documentLink
            }
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

export default DepositDocument;
