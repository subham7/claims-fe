import {
  Button,
  CircularProgress,
  Skeleton,
  TextField,
  Typography,
} from "@mui/material";
import { useWeb3Modal } from "@web3modal/wagmi/react";
import React, { useState } from "react";
import { CHAIN_CONFIG } from "utils/constants";
import { convertToWeiGovernance } from "utils/globalFunctions";
import { switchNetworkHandler } from "utils/helper";
import { useAccount, useNetwork } from "wagmi";
import classes from "../../claims/Claim.module.scss";

const DepositInput = ({
  formik,
  tokenDetails,
  isDisabled,
  allowanceValue,
  approveERC20Handler,
  routeNetworkId,
}) => {
  const ClaimInputShimmer = () => {
    return (
      <div>
        <Skeleton width={120} height={60} />
        <Skeleton height={40} width={150} />
      </div>
    );
  };

  const { address: walletAddress } = useAccount();
  const { open } = useWeb3Modal();
  const { chain } = useNetwork();
  const networkId = "0x" + chain?.id.toString(16);
  const [loading, setLoading] = useState(false);

  const connectWalletHandler = async () => {
    try {
      await open();
    } catch (error) {
      console.error(error);
    }
  };

  const inputValue = convertToWeiGovernance(
    formik.values.tokenInput,
    tokenDetails?.tokenDecimal,
  );

  const onDepositClick = async () => {
    if (tokenDetails?.isNativeToken === false) {
      if (Number(inputValue) <= allowanceValue) {
        await formik.handleSubmit();
      } else {
        await approveERC20Handler();
        await formik.handleSubmit();
      }
    } else {
      await formik.handleSubmit();
    }
  };

  const depositBtnTxt = () => {
    if (tokenDetails?.isNativeToken === false) {
      if (Number(inputValue <= allowanceValue)) {
        return "Deposit";
      } else {
        return "Approve & Deposit";
      }
    } else {
      return "Deposit";
    }
  };

  return (
    <>
      <div className={classes.claimInputContainer}>
        <Typography variant="inherit">Your deposit amount</Typography>
        <div className={classes.inputContainer}>
          <div>
            <TextField
              disabled={!walletAddress || networkId !== routeNetworkId}
              sx={{
                "& fieldset": { border: "none" },
              }}
              value={formik.values.tokenInput}
              name="tokenInput"
              id="tokenInput"
              onChange={formik.handleChange}
              onWheel={(event) => event.target.blur()}
              autoFocus
              type={"number"}
              placeholder="0"
              error={
                formik.touched.tokenInput && Boolean(formik.errors.tokenInput)
              }
              helperText={formik.touched.tokenInput && formik.errors.tokenInput}
            />
          </div>

          {tokenDetails?.tokenDecimal ? (
            <div className={classes.tokenContainer}>
              <Typography variant="inherit" className={classes.token}>
                {tokenDetails?.tokenSymbol}
              </Typography>
              <Typography variant="inherit" className={classes.smallFont}>
                Balance: {tokenDetails?.userBalance}
              </Typography>
            </div>
          ) : (
            <ClaimInputShimmer />
          )}
        </div>
      </div>

      {walletAddress && networkId === routeNetworkId ? (
        <Button
          // disabled={isDisabled}
          disabled={true}
          onClick={onDepositClick}
          variant="contained"
          sx={{
            width: "100%",
            padding: "10px 0",
            margin: "10px 0",
            fontFamily: "inherit",
          }}>
          {depositBtnTxt()}
        </Button>
      ) : walletAddress && networkId !== routeNetworkId ? (
        <Button
          onClick={() => {
            switchNetworkHandler(routeNetworkId, setLoading);
          }}
          variant="contained"
          sx={{
            width: "100%",
            padding: "10px 0",
            margin: "10px 0",
            fontFamily: "inherit",
          }}>
          {loading ? (
            <CircularProgress size={25} />
          ) : (
            `Switch to ${CHAIN_CONFIG[routeNetworkId]?.shortName}`
          )}
        </Button>
      ) : (
        <Button
          onClick={connectWalletHandler}
          variant="contained"
          sx={{
            width: "100%",
            padding: "10px 0",
            margin: "10px 0",
            fontFamily: "inherit",
          }}>
          Connect
        </Button>
      )}
    </>
  );
};

export default DepositInput;
