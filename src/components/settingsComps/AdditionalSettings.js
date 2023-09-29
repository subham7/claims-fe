import {
  Backdrop,
  CircularProgress,
  Divider,
  Grid,
  IconButton,
  Link,
  Skeleton,
  Stack,
  Switch,
  Tooltip,
  Typography,
} from "@mui/material";
import React, { useEffect, useState } from "react";
import ContentCopyIcon from "@mui/icons-material/ContentCopy";
import OpenInNewIcon from "@mui/icons-material/OpenInNew";
import { AdditionalSettingsStyles } from "./AdditionalSettingsStyles";
import DepositOwnerFee from "./modals/DepositOwnerFee";
import DepositDeadline from "./modals/DepositDeadline";
import useAppContractMethods from "../../hooks/useAppContractMethods";
import { shortAddress } from "utils/helper";
import DepositDocument from "./modals/DepositDocument";
import { useNetwork } from "wagmi";
import { editDepositConfig } from "api/deposit";
import { createStation, fetchClubByDaoAddress } from "api/club";
import CustomAlert from "@components/common/CustomAlert";

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
  const [showDepositDocumentLinkModal, setShowDepositDocumentLinkModal] =
    useState(false);
  const [showOwnerFeesModal, setShowOwnerFeesModal] = useState(false);
  const [loading, setLoading] = useState(false);
  const [showMessage, setShowMessage] = useState(false);
  const [message, setMessage] = useState("");
  const [isSuccessFull, setIsSuccessFull] = useState(false);
  const [checked, setChecked] = useState(true);
  const [clubAlreadyExists, setClubAlreadyExists] = useState(true);

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

  const updateDocumentLink = async (documentLink) => {
    try {
      const parts = documentLink.split("/");

      // Get the last part
      const subscriptionId = parts[parts.length - 1];

      if (!clubAlreadyExists) {
        await createStation({
          depositConfig: {
            subscriptionDocId: subscriptionId,
            enableKyc: false,
            uploadDocId: null,
          },
          name: daoDetails.daoName,
          daoAddress: daoAddress?.toLowerCase(),
          safeAddress: gnosisAddress,
          networkId,
          tokenType: tokenType === "erc721" ? "erc721" : "erc20NonTransferable",
        });
        setClubAlreadyExists(true);
      } else {
        await editDepositConfig(
          { subscriptionDocId: subscriptionId },
          daoAddress.toLowerCase(),
        );
      }
      setLoading(false);
      showMessageHandler();
      setIsSuccessFull(true);
      setChecked(!checked);
      setMessage("Subscription link updated Successfully");
    } catch (error) {
      showMessageHandler();
      setLoading(false);
      setIsSuccessFull(false);
      setMessage("Subscription link updating failed");
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

  const handleDocumentLinkChange = async () => {
    if (!checked) {
      setShowDepositDocumentLinkModal(true);
    } else {
      try {
        await editDepositConfig({ subscriptionDocId: null }, daoAddress);
        setLoading(false);
        showMessageHandler();
        setIsSuccessFull(true);
        setChecked(!checked);
        setMessage("Subscription link removed Successfully");
      } catch (error) {
        showMessageHandler();
        setLoading(false);
        setIsSuccessFull(false);
        setMessage("Subscription link removing failed");
      }
    }
  };

  const getDepositPreRequisites = async () => {
    const res = await fetchClubByDaoAddress(daoAddress.toLowerCase());

    if (res.data?.message === "Club not found") {
      setClubAlreadyExists(false);
    } else {
      setClubAlreadyExists(true);
    }

    if (res?.data?.depositConfig?.subscriptionDocId !== null) {
      setChecked(true);
    } else setChecked(false);
  };

  useEffect(() => {
    if (daoAddress) getDepositPreRequisites();
  }, [daoAddress]);

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
                ) : null}
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
                ) : null}
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
            <Typography variant="settingText">
              Enable pre-requisites for deposit
            </Typography>
          </Grid>
          <Grid
            // container
            sx={{ display: "flex", alignItems: "center" }}
            spacing={1}>
            <Grid mr={4}>
              <Grid sx={{ display: "flex", alignItems: "center" }}>
                <Switch
                  checked={checked}
                  onChange={() => {
                    // handlePrerequisitesChange();
                    handleDocumentLinkChange();
                  }}
                  inputProps={{ "aria-label": "controlled" }}
                />

                {isAdminUser ? (
                  <Link
                    className={classes.link}
                    onClick={handleDocumentLinkChange}>
                    (Change document link)
                  </Link>
                ) : null}
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

      {showDepositDocumentLinkModal && (
        <DepositDocument
          onClose={() => {
            setShowDepositDocumentLinkModal(false);
          }}
          updateDocumentLink={updateDocumentLink}
          loading={loading}
        />
      )}

      {showMessage ? (
        <CustomAlert severity={isSuccessFull} alertMessage={message} />
      ) : null}
    </div>
  );
};

export default AdditionalSettings;
