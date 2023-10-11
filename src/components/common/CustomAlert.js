import { Alert } from "@mui/material";
import React from "react";

const CustomAlert = ({ severity, alertMessage }) => {
  return (
    <Alert
      severity={severity ? "success" : "error"}
      sx={{
        width: "300px",
        position: "fixed",
        bottom: "30px",
        right: "20px",
        borderRadius: "8px",
      }}>
      {alertMessage}
    </Alert>
  );
};

export default CustomAlert;
