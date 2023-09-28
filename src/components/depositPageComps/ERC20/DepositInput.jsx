import { Button, Skeleton, TextField, Typography } from "@mui/material";
import React from "react";
import classes from "../../claims/Claim.module.scss";

const DepositInput = ({
  formik,
  tokenDetails,
  remainingDays,
  remainingTimeInSecs,
  isTokenGated,
  isEligibleForTokenGating,
  clubData,
  whitelistUserData,
  remainingClaimAmount,
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
    <>
      <div className={classes.claimInputContainer}>
        <Typography variant="inherit">Your deposit amount</Typography>
        <div className={classes.inputContainer}>
          <div>
            <TextField
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

      <Button
        disabled={
          (remainingDays >= 0 && remainingTimeInSecs > 0 && isTokenGated
            ? !isEligibleForTokenGating
            : remainingDays >= 0 && remainingTimeInSecs > 0
            ? false
            : true) ||
          +clubData?.raiseAmount <= +clubData?.totalAmountRaised ||
          +remainingClaimAmount <= 0 ||
          (whitelistUserData?.setWhitelist === true &&
            whitelistUserData?.proof === null)
        }
        onClick={formik.handleSubmit}
        variant="contained"
        sx={{
          width: "100%",
          padding: "10px 0",
          margin: "10px 0",
        }}>
        Deposit
      </Button>
    </>
  );
};

export default DepositInput;
