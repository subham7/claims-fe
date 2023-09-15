import { Skeleton } from "@mui/material";
import React from "react";
import { convertFromWeiGovernance } from "utils/globalFunctions";
import classes from "./NewClaim.module.scss";

const ClaimInput = ({
  claimInput,
  setClaimInput,
  tokenDetails,
  maxClaimableAmount,
  claimRemaining,
  maxHandler,
}) => {
  return (
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
        {/* <p className={classes.smallFont}>$1322.70</p> */}
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
  );
};

export default ClaimInput;
