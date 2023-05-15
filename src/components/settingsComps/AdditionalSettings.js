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
import React, { useCallback, useEffect, useState } from "react";
import ContentCopyIcon from "@mui/icons-material/ContentCopy";
import OpenInNewIcon from "@mui/icons-material/OpenInNew";
import CancelIcon from "@mui/icons-material/Cancel";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import { AdditionalSettingsStyles } from "./AdditionalSettingsStyles";
import { useRouter } from "next/router";
import Countdown from "react-countdown";
import { SmartContract } from "../../api/contract";
import FactoryContractABI from "../../abis/newArch/factoryContract.json";
import { DateTimePicker, LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import dayjs from "dayjs";
import DepositOwnerFee from "./modals/DepositOwnerFee";
import DepositDeadline from "./modals/DepositDeadline";
import ClubFetch from "../../utils/clubFetch";
import { useSelector } from "react-redux";

const AdditionalSettings = ({
  tokenType,
  daoDetails,
  erc20TokenDetails,
  walletAddress,
  fetchErc20ContractDetails,
  fetchErc721ContractDetails,
  isAdminUser,
}) => {
  const classes = AdditionalSettingsStyles();
  const router = useRouter();
  const { clubId: daoAddress } = router.query;
  const [showDepositTimeModal, setShowDepositTimeModal] = useState(false);
  const [showOwnerFeesModal, setShowOwnerFeesModal] = useState(false);
  const [loading, setLoading] = useState(false);
  const [showMessage, setShowMessage] = useState(false);
  const [message, setMessage] = useState("");
  const [isSuccessFull, setIsSuccessFull] = useState(false);

  console.log("Deaddline", daoDetails);
  const startingTimeInNum = new Date(+daoDetails?.depositDeadline * 1000);

  const GNOSIS_TRANSACTION_URL = useSelector((state) => {
    return state.gnosis.transactionUrl;
  });

  const FACTORY_CONTRACT_ADDRESS = useSelector((state) => {
    return state.gnosis.factoryContractAddress;
  });

  const USDC_CONTRACT_ADDRESS = useSelector((state) => {
    return state.gnosis.usdcContractAddress;
  });

  const updateOwnerFee = async (ownerFee) => {
    setLoading(true);
    try {
      const factoryContract = new SmartContract(
        FactoryContractABI,
        FACTORY_CONTRACT_ADDRESS,
        walletAddress,
        USDC_CONTRACT_ADDRESS,
        GNOSIS_TRANSACTION_URL,
      );

      const res = await factoryContract.updateOwnerFee(
        +ownerFee * 100,
        daoAddress,
      );
      console.log(res);

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

  const updateDepositTime = async (depositTime) => {
    setLoading(true);
    try {
      const factoryContract = new SmartContract(
        FactoryContractABI,
        FACTORY_CONTRACT_ADDRESS,
        walletAddress,
        USDC_CONTRACT_ADDRESS,
        GNOSIS_TRANSACTION_URL,
      );

      const res = await factoryContract.updateDepositTime(
        +depositTime.toFixed(0).toString(),
        daoAddress,
      );
      console.log(res);
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

      <Stack spacing={3} ml={3}>
        <Divider />
        <Grid
          container
          sx={{ display: "flex", justifyContent: "space-between" }}
        >
          <Grid item>
            <Typography variant="settingText">Club contract address</Typography>
          </Grid>
          <Grid
            // container
            sx={{ display: "flex", alignItems: "center" }}
            spacing={1}
          >
            <Grid item>
              <IconButton
                color="primary"
                onClick={() => {
                  navigator.clipboard.writeText(daoAddress);
                }}
              >
                <ContentCopyIcon className={classes.iconColor} />
              </IconButton>
            </Grid>
            <Grid item>
              <IconButton
                color="primary"
                onClick={() => {
                  window.open(
                    `https://goerli.etherscan.io/address/${daoAddress}`,
                  );
                }}
              >
                <OpenInNewIcon className={classes.iconColor} />
              </IconButton>
            </Grid>
            <Grid item mr={4}>
              <Typography variant="p" className={classes.valuesStyle}>
                {daoDetails ? (
                  daoAddress?.substring(0, 6) +
                  "......" +
                  daoAddress?.substring(daoAddress.length - 4)
                ) : tokenType === "erc721" ? (
                  daoAddress?.substring(0, 6) +
                  "......" +
                  daoAddress?.substring(daoAddress.length - 4)
                ) : (
                  <Skeleton variant="rectangular" width={100} height={25} />
                )}
              </Typography>
            </Grid>
          </Grid>
        </Grid>

        <Divider />
      </Stack>

      <Stack spacing={1} ml={3}>
        <Grid
          container
          py={2}
          sx={{ display: "flex", justifyContent: "space-between" }}
        >
          <Grid item mt={3}>
            <Typography variant="settingText">Owner fees</Typography>
          </Grid>
          <Grid
            sx={{
              display: "flex",
              justifyContent: "flex-end",
              alignItems: "center",
            }}
            spacing={1}
          >
            <Grid mr={4}>
              <Grid sx={{ display: "flex", alignItems: "center" }}>
                <Typography className={classes.text} mr={1}>
                  {daoDetails.ownerFee}%
                </Typography>

                {isAdminUser ? (
                  <Link
                    className={classes.link}
                    onClick={showUpdateOwnerFeesModalHandler}
                  >
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

      <Stack spacing={1} ml={3}>
        <Grid
          container
          py={2}
          sx={{ display: "flex", justifyContent: "space-between" }}
        >
          <Grid item mt={3}>
            <Typography variant="settingText">Deposit Time</Typography>
          </Grid>
          <Grid
            // container
            sx={{ display: "flex", alignItems: "center" }}
            spacing={1}
          >
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
                    onClick={showUpdateDepositTimeModalHandler}
                  >
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

      <Backdrop sx={{ color: "#fff", zIndex: 10000000 }} open={loading}>
        <CircularProgress color="inherit" />
      </Backdrop>

      {showOwnerFeesModal && (
        <DepositOwnerFee
          onClose={() => {
            setShowOwnerFeesModal(false);
          }}
          updateOwnerFeesHandler={updateOwnerFee}
          loading={loading}
        />
      )}
      {showDepositTimeModal && (
        <DepositDeadline
          onClose={() => {
            setShowDepositTimeModal(false);
          }}
          updateDepositTimeHandler={updateDepositTime}
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
          }}
        >
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
          }}
        >
          {message}
        </Alert>
      )}
    </div>
  );
};

export default AdditionalSettings;
