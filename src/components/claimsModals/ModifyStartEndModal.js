import { Button, Typography } from "@mui/material";
import { useFormik } from "formik";
import React from "react";
import { ClaimModalStyles } from "./ClaimModalStyles";
import ModalCard from "./ModalCard";
// import * as yup from "yup";

const ModifyStartEndModal = ({
  onClose,
  modifyStartAndEndTimeHandler,
  startTime,
  endTime,
}) => {
  const classes = ClaimModalStyles();

  const formik = useFormik({
    initialValues: {
      startTime: +startTime,
      endTime: +endTime,
    },
    onSubmit: (value) => {
      const newStartTime = new Date(value.startTime).getTime() / 1000;
      const newEndTime = new Date(value.endTime).getTime() / 1000;
      modifyStartAndEndTimeHandler(newStartTime, newEndTime);
      onClose();
    },
  });

  return (
    <ModalCard onClose={onClose}>
      <h2 className={classes.title}>Modify end/start of this claim</h2>
      <p className={classes.subtitle}>
        Change of plans? Modify when this token(s) claim will be active.
      </p>

      <form>
        <div>
          <Typography className={classes.label}>
            Start date for this claim
          </Typography>
          <input
            id="startTime"
            name="startTime"
            className={classes.dateInput}
            onChange={formik.handleChange}
            value={formik.values.startTime}
            type="datetime-local"
          />

          <Typography className={classes.label}>
            End date for this claim
          </Typography>
          <input
            id="endTime"
            name="endTime"
            className={classes.dateInput}
            onChange={formik.handleChange}
            value={formik.values.endTime}
            type="datetime-local"
          />
        </div>
      </form>

      <div className={classes.buttonContainers}>
        <Button
          onClick={onClose}
          sx={{
            fontSize: "18px",
            background: "#fff",
            color: "#3A7AFD",
          }}
          variant="primary">
          Cancel
        </Button>
        <Button
          sx={{
            fontSize: "18px",
            width: "130px",
          }}
          onClick={formik.handleSubmit}
          variant="primary">
          Save
        </Button>
      </div>
    </ModalCard>
  );
};

export default ModifyStartEndModal;
