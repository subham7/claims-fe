import { Skeleton, TextField, Tooltip, Typography } from "@mui/material";
import React from "react";
import { convertFromWeiGovernance } from "utils/globalFunctions";
import classes from "./Claim.module.scss";
import { AiFillInfoCircle } from "react-icons/ai";
import { convertToFullNumber } from "utils/helper";

const ClaimInput = ({
  inputAmount,
  setClaimInput,
  tokenDetails,
  maxClaimableAmount,
  claimRemaining,
  maxHandler,
  claimsData,
  whitelistTokenBalance,
}) => {
  const ClaimInputShimmer = () => {
    return (
      <div>
        <Skeleton width={120} height={60} />
        <Skeleton height={40} width={150} />
      </div>
    );
  };

  return (
    <div className={classes.claimInputContainer}>
      <h3>How much do you want to claim?</h3>
      <br />
      <div className={classes.inputContainer}>
        <div>
          <TextField
            sx={{
              "& fieldset": { border: "none" },
            }}
            value={inputAmount}
            name="tokenInput"
            id="tokenInput"
            onChange={(event) => {
              setClaimInput(event.target.value);
            }}
            onWheel={(event) => event.target.blur()}
            autoFocus
            type={"number"}
            placeholder="0"
          />
        </div>

        {tokenDetails?.tokenDecimal ? (
          <div className={classes.tokenContainer}>
            <Typography variant="inherit" className={classes.token}>
              {tokenDetails?.tokenSymbol}
            </Typography>
            <Typography variant="inherit" className={classes.smallFont}>
              Available:{" "}
              {Number(claimsData?.minWhitelistTokenValue) &&
              Number(claimsData?.minWhitelistTokenValue) >
                Number(whitelistTokenBalance)
                ? 0
                : Number(
                    convertFromWeiGovernance(
                      convertToFullNumber(claimRemaining + ""),
                      tokenDetails.tokenDecimal,
                    ),
                  ).toFixed(4)}
              <span onClick={maxHandler}>Max</span>
            </Typography>
          </div>
        ) : (
          <ClaimInputShimmer />
        )}
      </div>

      <Typography variant="inherit" className={classes.allocated}>
        <Tooltip title="Allocated amount to claim per user">
          <span className={classes.icon}>
            <AiFillInfoCircle size={18} cursor="pointer" />
          </span>
        </Tooltip>
        Total allocation is{" "}
        {claimsData?.claimType && tokenDetails?.tokenDecimal ? (
          <span>
            {claimsData?.claimType === "0" || claimsData?.claimType === "2"
              ? Number(
                  convertFromWeiGovernance(
                    claimsData?.maxClaimableAmount,
                    tokenDetails?.tokenDecimal,
                  ),
                )
              : Number(
                  convertFromWeiGovernance(
                    maxClaimableAmount,
                    tokenDetails?.tokenDecimal,
                  ),
                ).toFixed(4)}{" "}
            {tokenDetails?.tokenSymbol}
          </span>
        ) : (
          <Skeleton height={40} width={150} />
        )}
      </Typography>
    </div>
  );
};

export default ClaimInput;
