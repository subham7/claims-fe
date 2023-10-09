import { Typography } from "@mui/material";
import { Button } from "@components/ui";
import { useFormik } from "formik";
import React from "react";
import { ClaimModalStyles } from "./ClaimModalStyles";
import ModalCard from "./ModalCard";
import { DateTimePicker, LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";

const ModifyStartEndModal = ({
  onClose,
  modifyStartAndEndTimeHandler,
  startTime,
  endTime,
}) => {
  const classes = ClaimModalStyles();

  const formik = useFormik({
    initialValues: {
      startTime: startTime,
      endTime: endTime,
    },
    onSubmit: (value) => {
      const newStartTime = new Date(value.startTime).getTime() / 1000;
      const newEndTime = new Date(value.endTime).getTime() / 1000;

      modifyStartAndEndTimeHandler(
        newStartTime ? newStartTime : +startTime,
        newEndTime ? newEndTime : +endTime,
      );
      onClose();
    },
  });

  return (
    <ModalCard onClose={onClose}>
      <h2 className={classes.title}>Modify end/start time of this claim</h2>
      <p className={classes.subtitle}>
        Change of plans? Modify when this token(s) claim will be active.
      </p>

      <form>
        <div>
          <Typography className={classes.label}>
            Start date for this claim
          </Typography>
          <LocalizationProvider dateAdapter={AdapterDayjs}>
            <DateTimePicker
              sx={{
                zIndex: (theme) => theme.zIndex.drawer + 9000,
                width: "100%",
              }}
              value={formik.values.startTime}
              onChange={(value) => {
                formik.setFieldValue("startTime", value);
              }}
            />
          </LocalizationProvider>

          <Typography className={classes.label}>
            End date for this claim
          </Typography>
          <LocalizationProvider dateAdapter={AdapterDayjs}>
            <DateTimePicker
              sx={{
                zIndex: (theme) => theme.zIndex.drawer + 9000,
                width: "100%",
              }}
              value={formik.values.endTime}
              onChange={(value) => {
                formik.setFieldValue("endTime", value);
              }}
            />
          </LocalizationProvider>
        </div>
      </form>

      <div className={classes.buttonContainers}>
        <Button onClick={onClose}>Cancel</Button>
        <Button onClick={formik.handleSubmit}>Save</Button>
      </div>
    </ModalCard>
  );
};

export default ModifyStartEndModal;
