import {
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
import { useAccount, useChainId } from "wagmi";
import classes from "../../claims/Claim.module.scss";
import Image from "next/image";
import DepositCardModal from "@components/modals/DepositCardModal/DepositCardModal";
import { getTokenImageFromAddress } from "utils/tokenHelper";
import { useSelector } from "react-redux";

const ClaimInputShimmer = () => {
  return (
    <div>
      <Skeleton width={120} height={60} />
      <Skeleton height={40} width={150} />
    </div>
  );
};

const DepositInput = ({
  formik,
  tokenDetails,
  isDisabled,
  allowanceValue,
  approveERC20Handler,
  routeNetworkId,
  ownerAddress,
}) => {
  const [showModal, setShowModal] = useState(false);
  const { address: walletAddress } = useAccount();
  const { open } = useWeb3Modal();
  const chain = useChainId();
  const networkId = "0x" + chain?.toString(16);
  const [loading, setLoading] = useState(false);

  const clubData = useSelector((state) => {
    return state.club.clubData;
  });

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
        setShowModal(false);
      } else {
        await approveERC20Handler();
        await formik.handleSubmit();
        setShowModal(false);
      }
    } else {
      await formik.handleSubmit();
      setShowModal(false);
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
                "& .MuiInputBase-root": {
                  backgroundColor: "#111111",
                },
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
              <div className={classes.token} style={{}}>
                <Image
                  style={{
                    borderRadius: "50px",
                  }}
                  width={25}
                  height={25}
                  src={getTokenImageFromAddress({
                    tokenAddress: clubData?.depositTokenAddress,
                    networkId: routeNetworkId,
                  })}
                />
                <Typography mt={0.5} variant="inherit">
                  {tokenDetails?.tokenSymbol}
                </Typography>
              </div>
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
        <button
          disabled={isDisabled}
          onClick={() => {
            setShowModal(true);
          }}
          // onClick={onDepositClick}
          className={classes.primaryButton}>
          Deposit
        </button>
      ) : walletAddress && networkId !== routeNetworkId ? (
        <button
          onClick={() => {
            switchNetworkHandler(routeNetworkId, setLoading);
          }}
          className={classes.primaryButton}>
          {loading ? (
            <CircularProgress size={25} />
          ) : (
            `Switch to ${CHAIN_CONFIG[routeNetworkId]?.shortName}`
          )}
        </button>
      ) : (
        <button
          onClick={connectWalletHandler}
          className={classes.primaryButton}>
          Connect
        </button>
      )}

      {showModal ? (
        <DepositCardModal
          submitHandler={onDepositClick}
          text={depositBtnTxt()}
          onClose={() => {
            setShowModal(false);
          }}
          wallet={ownerAddress}
          amount={formik.values.tokenInput}
          networkId={networkId}
          routeNetworkId={routeNetworkId}
          isNative={tokenDetails?.isNativeToken}
        />
      ) : null}
    </>
  );
};

export default DepositInput;
