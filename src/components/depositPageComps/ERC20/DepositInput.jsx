import { Button, Skeleton, TextField, Typography } from "@mui/material";
import React from "react";
import { convertToWeiGovernance } from "utils/globalFunctions";
import classes from "../../claims/Claim.module.scss";

const DepositInput = ({
  formik,
  tokenDetails,
  isDisabled,
  allowanceValue,
  approveERC20Handler,
}) => {
  const ClaimInputShimmer = () => {
    return (
      <div>
        <Skeleton width={120} height={60} />
        <Skeleton height={40} width={150} />
      </div>
    );
  };

  const inputValue = convertToWeiGovernance(
    formik.values.tokenInput,
    tokenDetails?.tokenDecimal,
  );

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
        disabled={isDisabled}
        onClick={
          Number(inputValue) > allowanceValue
            ? approveERC20Handler
            : formik.handleSubmit
        }
        variant="contained"
        sx={{
          width: "100%",
          padding: "10px 0",
          margin: "10px 0",
        }}>
        {Number(inputValue) > allowanceValue ? "Approve" : "Deposit"}
      </Button>
    </>
  );
};

export default DepositInput;
