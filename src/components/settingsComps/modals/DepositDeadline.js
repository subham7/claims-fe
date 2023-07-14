import { Button, Grid, Typography } from "@mui/material";
import { makeStyles } from "@mui/styles";
import { DateTimePicker, LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import dayjs from "dayjs";
import { useFormik } from "formik";
import React from "react";
import * as yup from "yup";

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
    zIndex: "000",
  },
  backdrop: {
    position: "fixed",
    top: "0",
    left: "0",
    height: "100vh",
    width: "100vw",
    background: "#000",
    opacity: "70%",
    zIndex: "0000",
  },
});

const CustomBackdrop = ({ onClick }) => {
  const classes = useStyles();

  return <div onClick={onClick} className={classes.backdrop}></div>;
};

const DepositDeadline = ({ updateDepositTimeHandler, onClose, loading }) => {
  // const [depositTime, setDepositTime] = useState(dayjs(Date.now() + 300000));

  const formik = useFormik({
    initialValues: {
      depositTime: dayjs(Date.now() + 300000),
    },
    validationSchema: yup.object({
      depositTime: yup.date().required("Deposit time is required"),
    }),
    onSubmit: (value) => {
      updateDepositTimeHandler(new Date(value.depositTime).getTime() / 1000);
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
          Update Deposit Time
        </Typography>

        <form style={{ width: "100%" }}>
          <LocalizationProvider dateAdapter={AdapterDayjs}>
            <DateTimePicker
              sx={{
                zIndex: (theme) => theme.zIndex.drawer + 9000,
                width: "100%",
              }}
              value={formik.values.depositTime}
              minDateTime={dayjs(Date.now())}
              onChange={(value) => {
                formik.setFieldValue("depositTime", value);
              }}
            />
          </LocalizationProvider>

          <Grid
            sx={{
              justifyContent: "center",
              display: "flex",
              gap: "30px",
              marginTop: "20px",
            }}>
            <Button onClick={formik.handleSubmit} variant="primary">
              Update
            </Button>
            <Button onClick={onClose} variant="primary">
              Cancel
            </Button>
          </Grid>
        </form>
      </div>
    </>
  );
};

export default DepositDeadline;
