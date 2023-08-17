import {
  Alert,
  Backdrop,
  CircularProgress,
  FormControlLabel,
  Switch,
} from "@mui/material";
import React, { useEffect, useState } from "react";
import useSmartContractMethods from "../../hooks/useSmartContractMethods";
import { ClaimsInsightStyles } from "./claimsInsightStyles";

const ToggleClaim = ({ isActive }) => {
  const [loading, setLoading] = useState(false);
  const [isEnabled, setIsEnabled] = useState(true);
  const [showMessage, setShowMessage] = useState(null);

  const { toggleClaim } = useSmartContractMethods();

  const classes = ClaimsInsightStyles();

  const claimsToggleHandler = async (e) => {
    setLoading(true);

    try {
      await toggleClaim();
      setLoading(false);
      setIsEnabled(!isEnabled);
      showMessageHandler();
    } catch (error) {
      console.log(error);
      setLoading(false);
      showMessageHandler();
    }
  };

  const showMessageHandler = () => {
    setShowMessage(true);
    setTimeout(() => {
      setShowMessage(false);
    }, 4000);
  };

  const fetchContractDetails = async () => {
    try {
      setLoading(true);
      setIsEnabled(isActive);
      setLoading(false);
    } catch (error) {
      console.log(error);
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchContractDetails();
  }, [isActive]);

  return (
    <div className={classes.toggleClaimContainer}>
      <p>Turn off/on claims</p>
      <FormControlLabel
        control={
          <Switch
            checked={isEnabled}
            onChange={claimsToggleHandler}
            inputProps={{ "aria-label": "controlled" }}
          />
        }
      />

      {showMessage && !isEnabled && (
        <Alert
          severity="error"
          sx={{
            width: "350px",
            position: "fixed",
            bottom: "30px",
            right: "20px",
            borderRadius: "8px",
            zIndex: 1000000,
          }}>
          {"Claims turned Off"}
        </Alert>
      )}

      {showMessage && isEnabled && (
        <Alert
          severity="success"
          sx={{
            width: "350px",
            position: "fixed",
            bottom: "30px",
            right: "20px",
            borderRadius: "8px",
            zIndex: 1000000,
          }}>
          {"Claims turned On"}
        </Alert>
      )}

      <Backdrop
        sx={{ color: "#fff", zIndex: (theme) => theme.zIndex.drawer + 1 }}
        open={loading}>
        <CircularProgress color="inherit" />
      </Backdrop>
    </div>
  );
};

export default ToggleClaim;
