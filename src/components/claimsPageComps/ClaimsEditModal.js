import {
  Alert,
  Button,
  CircularProgress,
  Switch,
  Typography,
} from "@mui/material";
import { makeStyles } from "@mui/styles";
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useRouter } from "next/router";
import useSmartContractMethods from "../../hooks/useSmartContractMethods";

const useStyles = makeStyles({
  backdrop: {
    position: "fixed",
    height: "100vh",
    width: "100%",
    top: 0,
    left: 0,
    background: "#000000",
    opacity: 0.55,
    zIndex: 2000,
  },
  modal: {
    width: "570px",
    background: "#111D38",
    position: "fixed",
    top: "50%",
    left: "50%",
    transform: "translateX(-50%) translateY(-50%)",
    zIndex: 2002,
    padding: "28px 25px",
    borderRadius: "20px",
    boxShadow: "rgba(0, 0, 0, 0.35) 0px 5px 15px;",
  },
  switch: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: "20px",
    color: "#C1D3FF",
  },
  claim: {
    padding: "4px 12px",
    background: "#3B7AFD",
    borderRadius: "4px",
    color: "white",
    border: "none",
    cursor: "pointer",
  },
});

const Backdrop = ({ onClose }) => {
  const classes = useStyles();
  return <div onClick={onClose} className={classes.backdrop}></div>;
};

const ClaimsEditModal = ({ onClose, claimAddress, walletAddress }) => {
  const [loading, setLoading] = useState(false);
  const [claimed, setClaimed] = useState(false);
  const [isEnabled, setIsEnabled] = useState(true);
  const [showMessage, setShowMessage] = useState(null);

  const classes = useStyles();
  const dispatch = useDispatch();
  const router = useRouter();

  const CLAIMS_ON = useSelector((state) => {
    return state.createClaim.claimsOn;
  });

  const [claimsOn, setClaimsOn] = useState(
    CLAIMS_ON !== null ? CLAIMS_ON : false,
  );

  const { claimSettings, rollbackTokens, claimBalance, toggleClaim } =
    useSmartContractMethods();

  const claimsToggleHandler = async (e) => {
    setLoading(true);

    try {
      const res = await toggleClaim();

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

  const rollbackHandler = async (e) => {
    e.stopPropagation();

    try {
      setLoading(true);
      const balance = await claimBalance(claimAddress);
      const res = await rollbackTokens(balance);
      setClaimed(true);
      setLoading(false);
    } catch (error) {
      console.log(error);
      setLoading(false);
    }
  };

  const fetchContractDetails = async () => {
    try {
      setLoading(true);

      const desc = await claimSettings();
      setIsEnabled(!desc.isEnabled);

      const balance = await claimBalance(claimAddress);
      if (balance == 0) {
        setClaimed(true);
      }

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
    <>
      <Backdrop onClose={onClose} />
      {loading ? (
        <CircularProgress />
      ) : (
        <>
          <div className={classes.modal}>
            <h1 style={{ marginBottom: "40px" }}>Claim Settings</h1>
            <div className={classes.switch}>
              <Typography className={classes.text}>
                Do you want to turn On/Off the claims?
              </Typography>

              <Switch
                checked={!isEnabled}
                onChange={claimsToggleHandler}
                onClick={(e) => {
                  e.stopPropagation();
                }}
                inputProps={{ "aria-label": "controlled" }}
              />
            </div>

            <div className={classes.switch}>
              <Typography className={classes.text}>
                Claim the unclaimed tokens
              </Typography>
              <Button
                disabled={claimed}
                className={classes.claim}
                onClick={rollbackHandler}>
                {claimed ? "Claimed" : "Claim"}
              </Button>
            </div>
          </div>

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
        </>
      )}
    </>
  );
};

export default ClaimsEditModal;
