import { Skeleton, Tooltip } from "@mui/material";
import React from "react";
import { convertFromWeiGovernance } from "utils/globalFunctions";
import classes from "./NewClaim.module.scss";
import { AiFillInfoCircle } from "react-icons/ai";

const ClaimInput = ({
  claimInput,
  setClaimInput,
  tokenDetails,
  maxClaimableAmount,
  claimRemaining,
  maxHandler,
  claimsData,
}) => {
  return (
    <div className={classes.claimInputContainer}>
      <p>How much do you want to claim?</p>
      <div className={classes.inputContainer}>
        <div>
          <input
            value={claimInput}
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

        <div className={classes.tokenContainer}>
          {tokenDetails?.tokenSymbol ? (
            <p className={classes.token}>{tokenDetails?.tokenSymbol}</p>
          ) : (
            <Skeleton width={120} height={60} />
          )}

          {maxClaimableAmount && tokenDetails?.tokenDecimal ? (
            <p className={classes.smallFont}>
              Available:{" "}
              {Number(
                convertFromWeiGovernance(
                  claimRemaining,
                  tokenDetails.tokenDecimal,
                ),
              ).toFixed(4)}
              <span onClick={maxHandler}>Max</span>
            </p>
          ) : (
            <Skeleton height={40} width={150} />
          )}
        </div>
      </div>

      <p className={classes.allocated}>
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
      </p>
    </div>
  );
};

export default ClaimInput;
