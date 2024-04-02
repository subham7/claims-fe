import Modal from "@components/common/Modal/Modal";
import React, { useEffect, useState } from "react";
import { Typography, FormControlLabel, Switch } from "@mui/material";
import classes from "./KycModal.module.scss";
import { useDispatch, useSelector } from "react-redux";
import { setAlertData } from "redux/reducers/alert";
import { generateAlertData } from "utils/globalFunctions";
import { useAccount } from "wagmi";
import { handleSignMessage } from "utils/helper";
import { createKYC, getClubData, updateKYC } from "api/club";

const KycModal = ({ onClose, daoAddress, setLoading }) => {
  const [apiKey, setApiKey] = useState("");
  const [appId, setAppId] = useState("");
  const [isEnabledOld, setIsEnabledOld] = useState(false);
  const [isEnabled, setIsEnabled] = useState(false);

  const dispatch = useDispatch();
  const { address: walletAddress } = useAccount();

  const isAdmin = useSelector((state) => {
    return state.gnosis.adminUser;
  });

  const dispatchAlert = (message, severity) => {
    dispatch(setAlertData(generateAlertData(message, severity)));
  };

  const onToggleChange = () => {
    setIsEnabled(!isEnabled);
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
        walletAddress,
        JSON.stringify(payload),
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
    <Modal className={classes.kycModal}>
      <div className={classes.header}>
        <Typography variant="inherit" fontSize={18} fontWeight={600} mb={1}>
          KYC Settings
        </Typography>
        <Typography variant="inherit" fontSize={14} color={"#707070"}>
          You can turn on KYC for this station by creating an account on{" "}
          <span
            onClick={() => {
              window.open("https://app.zk.me/", "_blank");
            }}>
            zk.me
          </span>{" "}
          and linking the account here.
        </Typography>
      </div>

      <div className={classes.switchContainer}>
        <Typography variant="inherit">Enable KYC for this station</Typography>
        <FormControlLabel
          control={
            <Switch
              disabled={!isAdmin}
              checked={isEnabled}
              onChange={onToggleChange}
              color="default"
              inputProps={{ "aria-label": "controlled" }}
            />
          }
        />
      </div>

      <div className={classes.inputsContainer}>
        <div>
          <Typography variant="inherit" fontSize={14} fontWeight={500}>
            Add ZkMe API Key
          </Typography>
          <input
            disabled={!isAdmin || !isEnabled}
            onChange={(e) => {
              setApiKey(e.target.value);
            }}
            placeholder="API Key"
            value={apiKey}
            type="password"
          />
        </div>

        <div>
          <Typography variant="inherit" fontSize={14} fontWeight={500}>
            Add zkMe App ID
          </Typography>
          <input
            disabled={!isAdmin || !isEnabled}
            type="password"
            onChange={(e) => {
              setAppId(e.target.value);
            }}
            placeholder="App ID"
            value={appId}
          />
        </div>
      </div>

      <div className={classes.buttons}>
        <button onClick={onClose} className={classes.cancel}>
          Cancel
        </button>
        <button
          disabled={!isAdmin || !apiKey || !appId || isEnabledOld === isEnabled}
          onClick={submitHandler}>
          Save
        </button>
      </div>
    </Modal>
  );
};

export default KycModal;
