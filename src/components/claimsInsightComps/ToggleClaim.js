import BackdropLoader from "@components/common/BackdropLoader";
import CustomAlert from "@components/common/CustomAlert";
import { FormControlLabel, Switch } from "@mui/material";
import useDropsContractMethods from "hooks/useDropsContracMethods";
import React, { useEffect, useState } from "react";
import { ClaimsInsightStyles } from "./claimsInsightStyles";

const ToggleClaim = ({ claimAddress, isActive }) => {
  const [loading, setLoading] = useState(false);
  const [isEnabled, setIsEnabled] = useState(true);
  const [showMessage, setShowMessage] = useState(null);
  const [message, setMessage] = useState("");

  const { toggleClaim } = useDropsContractMethods();

  const classes = ClaimsInsightStyles();

  const claimsToggleHandler = async (e) => {
    setLoading(true);

    try {
      await toggleClaim(claimAddress);
      setLoading(false);
      setIsEnabled(!isEnabled);
      setMessage("Claims turned on");
      showMessageHandler();
    } catch (error) {
      console.log(error);
      setLoading(false);
      setMessage("Claims turned off");
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

      {showMessage ? (
        <CustomAlert severity={isEnabled} alertMessage={message} />
      ) : null}

      <BackdropLoader isOpen={loading} />
    </div>
  );
};

export default ToggleClaim;
