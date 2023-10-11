import ProgressBar from "@components/progressbar";
import { Typography } from "@mui/material";
import { makeStyles } from "@mui/styles";
import React from "react";
import { convertFromWeiGovernance } from "utils/globalFunctions";

const useStyles = makeStyles({
  layout: {
    marginBottom: "20px",
  },
  container: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
  },
});

const DepositProgress = ({ clubData, tokenDetails, nftMinted = 0 }) => {
  const {
    totalAmountRaised = 0,
    distributionAmount = 0,
    raiseAmount = 0,
    tokenType = "erc20",
  } = clubData;

  const classes = useStyles();

  const { tokenDecimal, tokenSymbol } = tokenDetails;

  return (
    <div className={classes.layout}>
      <div className={classes.container}>
        {tokenType === "erc721" ? (
          <Typography variant="inherit">{nftMinted} minted</Typography>
        ) : (
          <Typography variant="inherit" className="tb-mar-1">
            {convertFromWeiGovernance(totalAmountRaised, tokenDecimal)}{" "}
            {tokenSymbol} raised
          </Typography>
        )}

        {tokenType === "erc721" ? (
          <Typography variant="inherit">{distributionAmount} total</Typography>
        ) : (
          <Typography variant="inherit">
            {convertFromWeiGovernance(raiseAmount, tokenDetails?.tokenDecimal)}{" "}
            {tokenSymbol} total
          </Typography>
        )}
      </div>

      <ProgressBar
        zIndex={-1}
        value={
          tokenType === "erc721"
            ? (Number(nftMinted) * 100) / Number(distributionAmount)
            : (Number(totalAmountRaised) * 100) / Number(raiseAmount)
        }
      />
    </div>
  );
};

export default DepositProgress;
