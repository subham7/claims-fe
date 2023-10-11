import { Backdrop, CircularProgress } from "@mui/material";
import React from "react";

const BackdropLoader = ({ isOpen, children, showLoading = true }) => {
  return (
    <Backdrop
      sx={{ color: "#fff", zIndex: (theme) => theme.zIndex.drawer + 1 }}
      open={isOpen}>
      {children}
      {showLoading ? <CircularProgress /> : null}
    </Backdrop>
  );
};

export default BackdropLoader;
