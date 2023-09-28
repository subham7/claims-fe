import { Skeleton, TextField, Typography } from "@mui/material";
import React from "react";
import classes from "../../claims/Claim.module.scss";

const DepositInput = ({}) => {
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
      <Typography variant="inherit">How much do you want to claim?</Typography>
      <div className={classes.inputContainer}>
        <div>
          <TextField
            sx={{
              "& fieldset": { border: "none" },
            }}
            // value={claimInput}
            name="tokenInput"
            id="tokenInput"
            // onChange={(event) => {
            //   setClaimInput(event.target.value);
            // }}
            onWheel={(event) => event.target.blur()}
            autoFocus
            type={"number"}
            placeholder="0"
          />
        </div>

        {/* {maxClaimableAmount && tokenDetails?.tokenDecimal ? ( */}
        <div className={classes.tokenContainer}>
          <Typography variant="inherit" className={classes.token}>
            {/* {tokenDetails?.tokenSymbol} */}
          </Typography>
          <Typography variant="inherit" className={classes.smallFont}>
            Balance:{" "}
          </Typography>
        </div>
        {/* ) : (
          <ClaimInputShimmer />
        )} */}
      </div>
    </div>
  );
};

export default DepositInput;
