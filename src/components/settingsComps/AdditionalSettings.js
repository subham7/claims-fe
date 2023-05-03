import {
  Divider,
  Grid,
  IconButton,
  Link,
  Skeleton,
  Stack,
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
import { NEW_FACTORY_ADDRESS } from "../../api";
import { DateTimePicker, LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import dayjs from "dayjs";

const AdditionalSettings = ({
  tokenType,
  daoDetails,
  erc20TokenDetails,
  walletAddress,
}) => {
  const classes = AdditionalSettingsStyles();
  const router = useRouter();
  const { clubId: daoAddress } = router.query;
  const [depositTime, setDepositTime] = useState(dayjs(Date.now() + 300000));

  console.log("Deaddline", daoDetails.depositDeadline);
  const startingTimeInNum = new Date(+daoDetails.depositDeadline * 1000);

  const updateOwnerFee = async () => {
    try {
      const factoryContract = new SmartContract(
        FactoryContractABI,
        NEW_FACTORY_ADDRESS,
        walletAddress,
        undefined,
        undefined,
      );

      const res = await factoryContract.updateOwnerFee(20, daoAddress);
      console.log(res);
    } catch (error) {
      console.log(error);
    }
  };

  const updateDepositTime = async () => {
    try {
      const factoryContract = new SmartContract(
        FactoryContractABI,
        NEW_FACTORY_ADDRESS,
        walletAddress,
        undefined,
        undefined,
      );

      const res = factoryContract.updateDepositTime(20034034, daoAddress);
      console.log(res);
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div className={classes.container}>
      <Typography className={classes.heading}>Additional Details</Typography>

      <Stack spacing={3} ml={3}>
        {tokenType === "erc721" ? (
          <Grid container>
            <Grid item>
              <Typography variant="settingText">
                NFT contract address
              </Typography>
            </Grid>
            <Grid
              container
              sx={{ display: "flex", justifyContent: "flex-end" }}
              spacing={1}
            >
              <Grid item>
                <IconButton
                  color="primary"
                  onClick={() => {
                    navigator.clipboard.writeText(nftContractAddress);
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
                      `https://goerli.etherscan.io/address/${nftContractAddress}`,
                    );
                  }}
                >
                  <OpenInNewIcon className={classes.iconColor} />
                </IconButton>
              </Grid>
              <Grid item mr={4}>
                <Typography variant="p" className={classes.valuesStyle}>
                  {daoAddress !== null ? (
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
        ) : null}
        <Divider />
        <Grid container>
          <Grid item>
            <Typography variant="settingText">Club contract address</Typography>
          </Grid>
          <Grid
            container
            sx={{ display: "flex", justifyContent: "flex-end" }}
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
        <Grid container>
          <Grid item mt={3}>
            <Typography variant="settingText">Owner fees</Typography>
          </Grid>
          <Grid
            container
            sx={{ display: "flex", justifyContent: "flex-end" }}
            spacing={1}
          >
            <Grid mr={4}>
              <Grid sx={{ display: "flex", alignItems: "center" }}>
                <Typography className={classes.text} mr={1}>
                  {daoDetails.ownerFee}
                </Typography>
                <Link className={classes.link} onClick={updateOwnerFee}>
                  (Change)
                </Link>
              </Grid>
            </Grid>
          </Grid>
        </Grid>
        <Divider />
      </Stack>

      <Stack spacing={1} ml={3}>
        <Grid container>
          <Grid item mt={3}>
            <Typography variant="settingText">Deposit Time</Typography>
          </Grid>
          <Grid
            container
            sx={{ display: "flex", justifyContent: "flex-end" }}
            spacing={1}
          >
            <Grid mr={4}>
              <Grid sx={{ display: "flex", alignItems: "center" }}>
                <Typography className={classes.text} mr={1}>
                  <Countdown
                    className={classes.closingIn}
                    date={startingTimeInNum}
                  />
                </Typography>

                <Link className={classes.link} onClick={updateOwnerFee}>
                  (Change)
                </Link>

                {/* <LocalizationProvider dateAdapter={AdapterDayjs}>
                  <DateTimePicker
                    sx={{
                      width: "65px",
                      background: "inherit",
                      paddingRight: "-40px",
                      // paddingLeft: "40px",
                    }}
                    value={depositTime}
                    minDateTime={dayjs(Date.now())}
                    onChange={(value) => {
                      setDepositTime(value);
                    }}
                  />
                </LocalizationProvider> */}
                {/* <input type={"datetime-local"} /> */}
              </Grid>
            </Grid>
          </Grid>
        </Grid>
      </Stack>
    </div>
  );
};

export default AdditionalSettings;
