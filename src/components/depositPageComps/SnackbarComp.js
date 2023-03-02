import { Alert, Snackbar } from "@mui/material";

const SnackbarComp = ({ openSnackBar, handleClose, alertStatus, message }) => {
  return (
    <Snackbar
      open={openSnackBar}
      autoHideDuration={6000}
      onClose={handleClose}
      anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
    >
      {alertStatus === "success" ? (
        <Alert onClose={handleClose} severity="success" sx={{ width: "100%" }}>
          {message}
        </Alert>
      ) : (
        <Alert onClose={handleClose} severity="error" sx={{ width: "100%" }}>
          {message}
        </Alert>
      )}
    </Snackbar>
  );
};

export default SnackbarComp;
