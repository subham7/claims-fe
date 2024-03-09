import { Button, CircularProgress, Typography } from "@mui/material";
import React, { useState } from "react";
import { AiFillMinusCircle, AiFillPlusCircle } from "react-icons/ai";
import {
  convertFromWeiGovernance,
  convertToWeiGovernance,
} from "utils/globalFunctions";
import classes from "./Mint.module.scss";
import { CHAIN_CONFIG } from "utils/constants";
import { useAccount } from "wagmi";
import { useWeb3Modal } from "@web3modal/wagmi/react";
import { switchNetworkHandler } from "utils/helper";

const Mint = ({
  clubData,
  claimNFTHandler,
  remainingDays,
  remainingTimeInSecs,
  hasClaimed,
  count,
  setCount,
  balanceOfNft,
  isTokenGated,
  isEligibleForTokenGating,
  whitelistUserData,
  isSigned,
  isW8BenSigned,
  isSignable,
  approveERC721Handler,
  allowanceValue,
  tokenDetails,
  networkId,
  userBalance,
  routeNetworkId,
}) => {
  const { address: walletAddress } = useAccount();
  const { open } = useWeb3Modal();
  const [loading, setLoading] = useState(false);

  const connectWalletHandler = async () => {
    try {
      await open();
    } catch (error) {
      console.error(error);
    }
  };

  const inputValue = clubData.pricePerToken * count;

  const isButtonDisabled = () => {
    if (isSignable) {
      if (
        typeof isSigned !== "undefined" &&
        typeof isW8BenSigned !== "undefined"
      ) {
        if (!isSigned) return true;
        if (!isW8BenSigned) return true;
      }
    } else if (remainingDays <= 0 && remainingTimeInSecs < 0) return true;
    else if (hasClaimed) return true;
    else if (
      whitelistUserData?.setWhitelist === true &&
      whitelistUserData?.proof === null
    )
      return true;
    else if (isTokenGated) {
      return !isEligibleForTokenGating;
    } else if (inputValue === 0) return true;
    else if (
      (convertToWeiGovernance(userBalance, tokenDetails.tokenDecimal) ?? 0) <
      inputValue
    ) {
      return true;
    }

    return false;
  };

  const getBtnText = () => {
    if (hasClaimed) {
      return "Minted";
    } else if (tokenDetails.isNativeToken === true) {
      return "Mint";
    } else if (Number(inputValue) <= allowanceValue) {
      return "Mint";
    } else if (Number(inputValue) >= allowanceValue) {
      return "Approve & Mint";
    }
  };

  const onMintClick = async () => {
    if (tokenDetails.isNativeToken === true) {
      await claimNFTHandler();
    } else if (Number(inputValue) <= allowanceValue) {
      await claimNFTHandler();
    } else if (Number(inputValue) >= allowanceValue) {
      await approveERC721Handler();
      await claimNFTHandler();
    }
  };

  return (
    <div className={classes.mintContainer}>
      <Typography variant="inherit">Price per piece</Typography>
      <h2>
        {convertFromWeiGovernance(
          clubData?.pricePerToken,
          tokenDetails.tokenDecimal,
        )}{" "}
        {tokenDetails.tokenSymbol}
      </h2>
      <h5>Your balance - {Number(userBalance ?? 0).toFixed(4)}</h5>

      <div className={classes.flex}>
        <div className={classes.counterContainer}>
          <div className={classes.buttons}>
            <AiFillMinusCircle
              onClick={() => {
                count > 1 ? setCount(count - 1) : 1;
              }}
            />
          </div>
          <Typography>{count}</Typography>
          <div className={classes.buttons}>
            <AiFillPlusCircle
              onClick={() =>
                count < clubData?.maxTokensPerUser - balanceOfNft
                  ? setCount(count + 1)
                  : clubData?.maxTokensPerUser
              }
            />
          </div>
        </div>

        {walletAddress && networkId === routeNetworkId ? (
          <Button
            onClick={onMintClick}
            sx={{
              width: "100%",
              padding: "10px 20px",
              margin: "10px 0",
              fontFamily: "inherit",
            }}
            disabled={routeNetworkId === "0x1" ? true : isButtonDisabled()}
            // disabled={true}
            variant="contained">
            {getBtnText()}
          </Button>
        ) : walletAddress && networkId !== routeNetworkId ? (
          <Button
            onClick={() => {
              switchNetworkHandler(routeNetworkId, setLoading);
            }}
            variant="contained"
            sx={{
              width: "100%",
              padding: "10px 20px",
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
      </div>

      <Typography variant="inherit">
        This Station allows {clubData?.maxTokensPerUser} mint(s) per user
      </Typography>
    </div>
  );
};

export default Mint;
