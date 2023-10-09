import { Grid, Typography } from "@mui/material";
import { Button } from "@components/ui";
import { makeStyles } from "@mui/styles";
import { DateTimePicker, LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import dayjs from "dayjs";
import { useFormik } from "formik";
import React from "react";
import * as yup from "yup";
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
    zIndex: "1",
  },
});

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
      <BackdropLoader isOpen={true} showLoading={false}>
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
              <Button onClick={formik.handleSubmit}>Update</Button>
              <Button onClick={onClose}>Cancel</Button>
            </Grid>
          </form>
        </div>
      </BackdropLoader>
    </>
  );
};

export default DepositDeadline;
