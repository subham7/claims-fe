import Modal from "@components/common/Modal/Modal";
import React, { useEffect, useState } from "react";
import { Typography, FormControlLabel, Switch } from "@mui/material";
import classes from "./KycModal.module.scss";
import { useDispatch, useSelector } from "react-redux";
import { setAlertData } from "redux/reducers/alert";
import { generateAlertData } from "utils/globalFunctions";
import { useSignMessage } from "wagmi";
import { handleSignMessage } from "utils/helper";
import { createKYC, getClubData } from "api/club";

const KycModal = ({
  onClose,
  daoAddress,
  setLoading,
  setIsKycEnabledSettings,
}) => {
  const { signMessageAsync } = useSignMessage();
  const [apiKey, setApiKey] = useState("");
  const [appId, setAppId] = useState("");
  const [appIdOld, setAppIdOld] = useState(false);
  const [isCreated, setIsCreated] = useState(false);
  const [isEnabled, setIsEnabled] = useState(false);
  const [isEnabledOld, setIsEnabledOld] = useState(false);

  const dispatch = useDispatch();

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
      let payload = {};

      if (isCreated && isEnabled) {
        payload = {
          isActive: true,
          appId,
          daoAddress,
        };

        if (apiKey !== "abcdefghijklmnopqr") {
          payload = {
            ...payload,
            apiKey,
          };
        }
      } else if (isCreated && !isEnabled) {
        payload = {
          daoAddress,
          isActive: false,
        };
      } else if (!isCreated) {
        payload = {
          isActive: true,
          apiKey,
          appId,
          daoAddress,
        };
      }

      const { signature } = await handleSignMessage(
        JSON.stringify(payload),
        signMessageAsync,
      );

      const response = await createKYC({
        ...payload,
        signature,
      });

      if (response) {
        if (isEnabled) {
          dispatchAlert("KYC enabled successfully", "success");
          setIsKycEnabledSettings(true);
        } else {
          dispatchAlert("KYC disabled successfully", "success");
          setIsKycEnabledSettings(false);
        }
        onClose();
      } else {
        dispatchAlert("Could not update KYC settings ", "error");
      }
      await getKycSetting();
      setLoading(false);
    } catch (error) {
      setLoading(false);
      dispatchAlert("Could not update KYC settings ", "error");
    }
  };

  const getKycSetting = async () => {
    try {
      setLoading(true);
      const response = await getClubData(daoAddress);
      if (response) {
        setIsEnabled(response.kyc.isKycEnabled);
        setIsEnabledOld(response.kyc.isKycEnabled);
        if (response.kyc.isKycCreated) {
          setIsCreated(true);
          setApiKey("abcdefghijklmnopqr");
          setAppId(response.kyc.zkmeAppId);
          setAppIdOld(response.kyc.zkmeAppId);
        }
      }
      setLoading(false);
    } catch (e) {
      console.error(e);
      setLoading(false);
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

      {isEnabled ? (
        <div className={classes.inputsContainer}>
          <div>
            <Typography variant="inherit" fontSize={14} fontWeight={500}>
              Add zkMe App ID
            </Typography>
            <input
              disabled={!isAdmin || !isEnabled}
              onChange={(e) => {
                setAppId(e.target.value);
              }}
              placeholder="App ID"
              value={appId}
            />
          </div>
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
        </div>
      ) : null}

      <div className={classes.buttons}>
        <button onClick={onClose} className={classes.cancel}>
          Cancel
        </button>
        <button
          disabled={
            !isAdmin ||
            !apiKey ||
            !appId ||
            (appId === appIdOld &&
              apiKey === "abcdefghijklmnopqr" &&
              isEnabled === isEnabledOld)
          }
          onClick={submitHandler}>
          Save
        </button>
      </div>
    </Modal>
  );
};

export default KycModal;
