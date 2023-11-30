import React from "react";
import MuiAlert from "@mui/material/Alert";
import Snackbar from "@mui/material/Snackbar";
import { forwardRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { setAlertData } from "redux/reducers/alert";

const Alert = forwardRef(function Alert(props, ref) {
  return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
});

const CustomAlert = () => {
  const dispatch = useDispatch();
  const isAlertOpen = useSelector((state) => state.alert.open);
  const severity = useSelector((state) => state.alert.severity);
  const message = useSelector((state) => state.alert.message);

  const handleClose = (event, reason) => {
    if (reason === "clickaway") {
      return;
    }

    dispatch(
      setAlertData({
        open: false,
        message: null,
        severity: null,
      }),
    );
  };

  return (
    <div>
      {isAlertOpen && (
        <Snackbar
          open={isAlertOpen}
          autoHideDuration={4000}
          anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
          onClose={handleClose}>
          <Alert
            onClose={handleClose}
            severity={severity}
            sx={{ width: "100%" }}>
            {message}
          </Alert>
        </Snackbar>
      )}
    </div>
  );
};

export default CustomAlert;
