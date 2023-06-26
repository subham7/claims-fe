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

const ToggleClaim = ({ startTime, endTime }) => {
  const [loading, setLoading] = useState(false);
  const [isEnabled, setIsEnabled] = useState(true);
  const [showMessage, setShowMessage] = useState(null);

  const { claimSettings, changeClaimsStartTimeAndEndTime } =
    useSmartContractMethods();

  const classes = ClaimsInsightStyles();
  const currentTime = Date.now() / 1000;

  const claimsToggleHandler = async (e) => {
    setLoading(true);

    try {
      await changeClaimsStartTimeAndEndTime(
        startTime,
        Number(currentTime - 2000).toFixed(0),
      );

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
      const desc = await claimSettings();
      const endingTimeInNum = new Date(+desc?.endTime * 1000);
      setIsEnabled(endingTimeInNum > currentTime ? true : false);
      setLoading(false);
    } catch (error) {
      console.log(error);
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchContractDetails();
  }, []);

  return (
    <div className={classes.toggleClaimContainer}>
      <p>Turn on/off claims</p>
      <FormControlLabel
        control={
          <Switch
            checked={!isEnabled}
            onChange={claimsToggleHandler}
            inputProps={{ "aria-label": "controlled" }}
          />
        }
      />

      {showMessage && isEnabled && (
        <Alert
          severity="error"
          sx={{
            width: "350px",
            position: "absolute",
            bottom: "30px",
            right: "20px",
            borderRadius: "8px",
            zIndex: 1000000,
          }}>
          {"Claims turned Off"}
        </Alert>
      )}

      {showMessage && !isEnabled && (
        <Alert
          severity="success"
          sx={{
            width: "350px",
            position: "absolute",
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
