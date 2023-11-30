import BackdropLoader from "@components/common/BackdropLoader";
import { FormControlLabel, Switch } from "@mui/material";
import { useTheme } from "@mui/styles";
import useDropsContractMethods from "hooks/useDropsContractMethods";
import React, { useEffect, useState } from "react";
import { ClaimsInsightStyles } from "./claimsInsightStyles";
import { useDispatch } from "react-redux";
import { setAlertData } from "redux/reducers/alert";

const ToggleClaim = ({ claimAddress, isActive }) => {
  const theme = useTheme();
  const classes = ClaimsInsightStyles(theme);
  const dispatch = useDispatch();

  const { toggleClaim } = useDropsContractMethods();

  const [loading, setLoading] = useState(false);
  const [isEnabled, setIsEnabled] = useState(true);

  const claimsToggleHandler = async (e) => {
    setLoading(true);

    try {
      await toggleClaim(claimAddress);
      setLoading(false);
      setIsEnabled(!isEnabled);
      dispatch(
        setAlertData({
          open: true,
          message: "Claims turned on",
          severity: "success",
        }),
      );
    } catch (error) {
      console.log(error);
      setLoading(false);
      dispatch(
        setAlertData({
          open: true,
          message: "Claims turned off",
          severity: "error",
        }),
      );
    }
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

      <BackdropLoader isOpen={loading} />
    </div>
  );
};

export default ToggleClaim;
