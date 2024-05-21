import React, { useEffect, useState } from "react";
import classes from "@components/(settings)/Settings.module.scss";
import { FormControlLabel, Switch, Typography } from "@mui/material";
import { useSignMessage } from "wagmi";
import { handleSignMessage } from "utils/helper";
import { useSelector } from "react-redux";
import { createKYC, getClubData, updateKYC } from "api/club";
import { useDispatch } from "react-redux";
import { setAlertData } from "redux/reducers/alert";
import { generateAlertData } from "utils/globalFunctions";

const EnableKYC = ({ daoAddress, setLoading }) => {
  const { signMessageAsync } = useSignMessage();
  const [apiKey, setApiKey] = useState("");
  const [appId, setAppId] = useState("");
  const [isEnabledOld, setIsEnabledOld] = useState(false);
  const [isEnabled, setIsEnabled] = useState(false);
  const dispatch = useDispatch();

  const isAdmin = useSelector((state) => {
    return state.gnosis.adminUser;
  });

  const dispatchAlert = (message, severity) => {
    dispatch(setAlertData(generateAlertData(message, severity)));
  };

  const submitHandler = async () => {
    try {
      setLoading(true);

      const payload = isEnabled
        ? {
            apiKey,
            appId,
            daoAddress,
          }
        : { daoAddress, isActive: false };

      const { signature } = await handleSignMessage(
        JSON.stringify(payload),
        signMessageAsync,
      );

      if (isEnabledOld !== isEnabled && isEnabled) {
        await createKYC({
          ...payload,
          signature,
        });
        dispatchAlert("KYC enabled successfully", "success");
      } else if (!isEnabled) {
        await updateKYC({
          ...payload,
          signature,
        });
        dispatchAlert("KYC disabled successfully", "success");
      }

      setLoading(false);
    } catch (error) {
      setLoading(false);
      dispatchAlert("Could not update KYC settings ", "error");
    }
  };

  const onToggleChange = () => {
    setIsEnabled(!isEnabled);
  };

  const getKycSetting = async () => {
    const response = await getClubData(daoAddress);
    if (response) {
      setIsEnabledOld(response.kycEnabled);
    }
  };

  useEffect(() => {
    getKycSetting();
  }, []);

  return (
    <div className={classes.treasurySignerContainer}>
      <FormControlLabel
        control={
          <Switch
            disabled={!isAdmin}
            checked={isEnabled}
            onChange={onToggleChange}
            inputProps={{ "aria-label": "controlled" }}
          />
        }
      />

      {isEnabled ? (
        <>
          <div className={classes.copyTextContainer}>
            <input
              disabled={!isAdmin}
              type="password"
              onChange={(e) => {
                setApiKey(e.target.value);
              }}
              placeholder="API Key"
              className={classes.input}
              value={apiKey}
              style={{
                margin: "4px 0",
              }}
            />
          </div>
          <div className={classes.copyTextContainer}>
            <input
              disabled={!isAdmin}
              type="password"
              onChange={(e) => {
                setAppId(e.target.value);
              }}
              placeholder="App Id"
              className={classes.input}
              value={appId}
              style={{
                margin: "4px 0",
              }}
            />
          </div>
        </>
      ) : null}

      <button
        disabled={!isAdmin || !apiKey || !appId || isEnabledOld === isEnabled}
        onClick={submitHandler}>
        <Typography variant="inherit">Save</Typography>
      </button>
    </div>
  );
};

export default EnableKYC;
