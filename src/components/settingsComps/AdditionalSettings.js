import {
  Alert,
  Backdrop,
  CircularProgress,
  Divider,
  Grid,
  IconButton,
  Link,
  Skeleton,
  Stack,
  Tooltip,
  Typography,
} from "@mui/material";
import React, { useState } from "react";
import ContentCopyIcon from "@mui/icons-material/ContentCopy";
import OpenInNewIcon from "@mui/icons-material/OpenInNew";
import { AdditionalSettingsStyles } from "./AdditionalSettingsStyles";
import DepositOwnerFee from "./modals/DepositOwnerFee";
import DepositDeadline from "./modals/DepositDeadline";
import useAppContractMethods from "../../hooks/useAppContractMethods";
import { shortAddress } from "utils/helper";
import { useNetwork } from "wagmi";

const AdditionalSettings = ({
  tokenType,
  daoDetails,
  fetchErc20ContractDetails,
  fetchErc721ContractDetails,
  isAdminUser,
  gnosisAddress,
  daoAddress,
}) => {
  const classes = AdditionalSettingsStyles();
  const { chain } = useNetwork();
  const networkId = "0x" + chain?.id.toString(16);

  const [showDepositTimeModal, setShowDepositTimeModal] = useState(false);
  const [showOwnerFeesModal, setShowOwnerFeesModal] = useState(false);
  const [loading, setLoading] = useState(false);
  const [showMessage, setShowMessage] = useState(false);
  const [message, setMessage] = useState("");
  const [isSuccessFull, setIsSuccessFull] = useState(false);

  const startingTimeInNum = new Date(+daoDetails?.depositDeadline * 1000);

  const { updateDepositTime, updateOwnerFee } = useAppContractMethods();

  const updateAdminFees = async (ownerFee) => {
    setLoading(true);
    try {
      await updateOwnerFee(+ownerFee * 100, daoAddress);
      setLoading(false);
      showMessageHandler();
      setIsSuccessFull(true);
      setMessage("Owner Fee updated Successfully");
      if (tokenType === "erc20") {
        fetchErc20ContractDetails();
      } else {
        fetchErc721ContractDetails();
      }
    } catch (error) {
      console.log(error.code);
      showMessageHandler();
      setLoading(false);
      setIsSuccessFull(false);
      if (error.code === 4001) {
        setMessage("Metamask Signature denied");
      } else setMessage("Owner Fee updating failed");
    }
  };

  const updateDepositDeadline = async (depositTime) => {
    setLoading(true);
    try {
      await updateDepositTime(+depositTime.toFixed(0).toString(), daoAddress);
      setLoading(false);
      showMessageHandler();
      setIsSuccessFull(true);
      setMessage("Deposit Time updated Successfully");
      if (tokenType === "erc20") {
        fetchErc20ContractDetails();
      } else {
        fetchErc721ContractDetails();
      }
    } catch (error) {
      showMessageHandler();
      setLoading(false);
      setIsSuccessFull(false);
      if (error.code === 4001) {
        setMessage("Metamask Signature denied");
      } else setMessage("Deposit Time updating failed");
    }
  };

  const showUpdateDepositTimeModalHandler = () => {
    setShowDepositTimeModal(true);
  };

  const showUpdateOwnerFeesModalHandler = () => {
    setShowOwnerFeesModal(true);
  };

  const showMessageHandler = () => {
    setShowMessage(true);
    setTimeout(() => {
      setShowMessage(false);
    }, 4000);
  };

  return (
    <div className={classes.container}>
      <Typography className={classes.heading}>Additional Details</Typography>
      <Stack spacing={3}>
        <Divider />
        <Grid
          container
          sx={{ display: "flex", justifyContent: "space-between" }}>
          <Grid item>
            <Typography variant="settingText">
              Token contract address
            </Typography>
          </Grid>
          <Grid sx={{ display: "flex", alignItems: "center" }}>
            <Grid item>
              <IconButton
                color="primary"
                onClick={() => {
                  navigator.clipboard.writeText(daoAddress);
                }}>
                <ContentCopyIcon className={classes.iconColor} />
              </IconButton>
            </Grid>
            <Grid item>
              <IconButton
                color="primary"
                onClick={() => {
                  window.open(
                    `https://${
                      networkId === "0x5"
                        ? "goerli.etherscan.io"
                        : networkId === "0x89"
                        ? "polygonscan.com"
                        : ""
                    }/address/${daoAddress}`,
                  );
                }}>
                <OpenInNewIcon className={classes.iconColor} />
              </IconButton>
            </Grid>
            <Grid item mr={4} mt={1}>
              <Typography variant="p" className={classes.valuesStyle}>
                {daoDetails ? (
                  shortAddress(daoAddress)
                ) : (
                  <Skeleton variant="rectangular" width={100} height={25} />
                )}
              </Typography>
            </Grid>
          </Grid>
        </Grid>

        <Divider />
        <Grid
          container
          sx={{ display: "flex", justifyContent: "space-between" }}>
          <Grid item>
            <Typography variant="settingText">Treasury address</Typography>
          </Grid>

          <Grid sx={{ display: "flex", alignItems: "center" }}>
            <Grid item>
              <IconButton
                color="primary"
                onClick={() => {
                  navigator.clipboard.writeText(gnosisAddress);
                }}>
                <ContentCopyIcon className={classes.iconColor} />
              </IconButton>
            </Grid>
            <Grid item>
              <IconButton
                color="primary"
                onClick={() => {
                  window.open(
                    `https://${
                      networkId === "0x5"
                        ? "goerli.etherscan.io"
                        : networkId === "0x89"
                        ? "polygonscan.com"
                        : ""
                    }/address/${gnosisAddress}`,
                  );
                }}>
                <OpenInNewIcon className={classes.iconColor} />
              </IconButton>
            </Grid>

            <Grid item mr={4} mt={1}>
              <Typography variant="p" className={classes.valuesStyle}>
                {daoDetails ? (
                  shortAddress(gnosisAddress)
                ) : (
                  <Skeleton variant="rectangular" width={100} height={25} />
                )}
              </Typography>
            </Grid>
          </Grid>
        </Grid>
        <Divider />
      </Stack>

      <Stack spacing={1}>
        <Grid
          container
          py={2}
          sx={{ display: "flex", justifyContent: "space-between" }}>
          <Grid item mt={3}>
            <Typography variant="settingText">Admin fees</Typography>
          </Grid>
          <Grid
            sx={{
              display: "flex",
              justifyContent: "flex-end",
              alignItems: "center",
            }}
            spacing={1}>
            <Grid mr={4}>
              <Grid sx={{ display: "flex", alignItems: "center" }}>
                <Typography className={classes.text} mr={1}>
                  {daoDetails.ownerFee}%
                </Typography>

                {isAdminUser ? (
                  <Link
                    className={classes.link}
                    onClick={showUpdateOwnerFeesModalHandler}>
                    (Change)
                  </Link>
                ) : (
                  ""
                )}
              </Grid>
            </Grid>
          </Grid>
        </Grid>
        <Divider />
      </Stack>

      <Stack spacing={1}>
        <Grid
          container
          py={2}
          sx={{ display: "flex", justifyContent: "space-between" }}>
          <Grid item mt={3}>
            <Typography variant="settingText">Deposit deadline</Typography>
          </Grid>
          <Grid
            // container
            sx={{ display: "flex", alignItems: "center" }}
            spacing={1}>
            <Grid mr={4}>
              <Grid sx={{ display: "flex", alignItems: "center" }}>
                <Tooltip title={startingTimeInNum.toString()}>
                  <Typography className={classes.text} mr={1}>
                    {daoDetails.depositDeadline ? (
                      new Date(parseInt(daoDetails.depositDeadline) * 1000)
                        ?.toJSON()
                        ?.slice(0, 10)
                        .split("-")
                        .reverse()
                        .join("/")
                    ) : (
                      <Skeleton variant="rectangular" width={100} height={25} />
                    )}
                  </Typography>
                </Tooltip>

                {isAdminUser ? (
                  <Link
                    className={classes.link}
                    onClick={showUpdateDepositTimeModalHandler}>
                    (Change)
                  </Link>
                ) : (
                  ""
                )}
              </Grid>
            </Grid>
          </Grid>
        </Grid>
      </Stack>

      <Backdrop sx={{ color: "#000", zIndex: 10000000 }} open={loading}>
        <CircularProgress />
      </Backdrop>

      {showOwnerFeesModal && (
        <DepositOwnerFee
          onClose={() => {
            setShowOwnerFeesModal(false);
          }}
          updateOwnerFeesHandler={updateAdminFees}
          loading={loading}
        />
      )}
      {showDepositTimeModal && (
        <DepositDeadline
          onClose={() => {
            setShowDepositTimeModal(false);
          }}
          updateDepositTimeHandler={updateDepositDeadline}
          loading={loading}
        />
      )}

      {showMessage && isSuccessFull && (
        <Alert
          severity="success"
          sx={{
            width: "300px",
            position: "fixed",
            bottom: "30px",
            right: "20px",
            borderRadius: "8px",
          }}>
          {message}
        </Alert>
      )}

      {showMessage && !isSuccessFull && (
        <Alert
          severity="error"
          sx={{
            width: "300px",
            position: "fixed",
            bottom: "30px",
            right: "20px",
            borderRadius: "8px",
          }}>
          {message}
        </Alert>
      )}
    </div>
  );
};

export default AdditionalSettings;
