import { Button, Typography } from "@mui/material";
import React from "react";
import { AiFillMinusCircle, AiFillPlusCircle } from "react-icons/ai";
import {
  convertFromWeiGovernance,
  convertToWeiGovernance,
} from "utils/globalFunctions";
import classes from "./Mint.module.scss";
import { CHAIN_CONFIG } from "utils/constants";

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
}) => {
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

  return (
    <div className={classes.mintContainer}>
      <Typography variant="inherit">Price per piece</Typography>
      <h2>
        {" "}
        {convertFromWeiGovernance(
          clubData?.pricePerToken,
          tokenDetails.tokenDecimal,
        )}{" "}
        {tokenDetails.tokenSymbol}
      </h2>
      <h5>Your balance - {Number(userBalance ?? 0).toFixed(4)}</h5>

      <div>
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
        <Button
          onClick={
            Number(inputValue) > allowanceValue &&
            clubData.depositTokenAddress !==
              CHAIN_CONFIG[networkId].nativeToken.toLowerCase()
              ? claimNFTHandler
              : approveERC721Handler
          }
          sx={{
            width: "130px",
          }}
          disabled={isButtonDisabled()}
          variant="contained">
          {hasClaimed
            ? "Minted"
            : Number(inputValue) > allowanceValue &&
              clubData.depositTokenAddress !==
                CHAIN_CONFIG[networkId].nativeToken.toLowerCase()
            ? "Mint"
            : "Approve"}
        </Button>
      </div>

      <Typography variant="inherit">
        This Station allows {clubData?.maxTokensPerUser} mint(s) per user
      </Typography>
    </div>
  );
};

export default Mint;
