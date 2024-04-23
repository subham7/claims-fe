import { Button, CircularProgress, Typography } from "@mui/material";
import React, { useEffect, useState } from "react";
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
import { getClubData } from "api/club";
import { verifyWithZkMeServices } from "@zkmelabs/widget";
import DepositCardModal from "@components/modals/DepositCardModal/DepositCardModal";

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
  daoAddress,
}) => {
  const [showModal, setShowModal] = useState(false);
  const { address: walletAddress } = useAccount();
  const { open } = useWeb3Modal();
  const [loading, setLoading] = useState(false);
  const [isVerified, setIsVerified] = useState(false);

  const connectWalletHandler = async () => {
    try {
      await open();
    } catch (error) {
      console.error(error);
    }
  };

  // const inputValue = clubData.pricePerToken * count;
  const inputValue = clubData.pricePerTokenFormatted.bigNumberValue
    .times(count)
    .integerValue()
    .toFixed();

  const isButtonDisabled = () => {
    if (!isVerified) {
      return true;
    }

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
    } else if (inputValue == 0) return true;
    else if (
      Number(
        convertToWeiGovernance(userBalance, tokenDetails.tokenDecimal) ?? 0,
      ) < Number(inputValue)
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
      setShowModal(false);
    } else if (Number(inputValue) <= allowanceValue) {
      await claimNFTHandler();
      setShowModal(false);
    } else if (Number(inputValue) >= allowanceValue) {
      await approveERC721Handler();
      await claimNFTHandler();
      setShowModal(false);
    }
  };

  const getKycSetting = async () => {
    try {
      const response = await getClubData(daoAddress);
      if (response) {
        if (response?.kyc?.isKycEnabled) {
          const results = await verifyWithZkMeServices(
            response?.kyc?.zkmeAppId,
            walletAddress,
          );
          setIsVerified(results);
        } else {
          setIsVerified(true);
        }
        setLoading(false);
      }
    } catch (e) {
      console.error(e);
      setLoading(false);
    }
  };

  useEffect(() => {
    getKycSetting();
  }, []);

  return (
    <>
      <div className={classes.mintContainer}>
        <Typography variant="inherit">Price per piece</Typography>
        <h2>
          {clubData?.pricePerTokenFormatted?.formattedValue}{" "}
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
              onClick={() => {
                setShowModal(true);
              }}
              sx={{
                width: "100%",
                padding: "10px 20px",
                margin: "10px 0",
                fontFamily: "inherit",
              }}
              disabled={isButtonDisabled()}
              variant="contained">
              Mint
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

      {showModal ? (
        <DepositCardModal
          submitHandler={onMintClick}
          text={getBtnText()}
          onClose={() => {
            setShowModal(false);
          }}
          wallet={clubData?.ownerAddress}
          amount={convertFromWeiGovernance(
            inputValue,
            tokenDetails?.tokenDecimal,
          )}
          networkId={networkId}
          isNative={tokenDetails?.isNativeToken}
        />
      ) : null}
    </>
  );
};

export default Mint;
