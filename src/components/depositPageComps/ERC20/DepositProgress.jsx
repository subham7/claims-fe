import ProgressBar from "@components/progressbar";
import { Typography } from "@mui/material";
import { makeStyles } from "@mui/styles";
import React from "react";
import { formatNumbers } from "utils/helper";

const useStyles = makeStyles({
  layout: {
    marginBottom: "20px",
  },
  container: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: "4px",
  },
});

const DepositProgress = ({ clubData, nftMinted = 0 }) => {
  const {
    totalAmountRaisedFormatted,
    distributionAmountFormatted = 0,
    raiseAmountFormatted,
    tokenType = "erc20",
    depositTokenSymbol,
  } = clubData;

  const classes = useStyles();

  return (
    <div className={classes.layout}>
      <div className={classes.container}>
        {tokenType === "erc721" ? (
          <Typography variant="inherit">{nftMinted} minted</Typography>
        ) : (
          <Typography variant="inherit" className="tb-mar-1">
            {formatNumbers(Number(totalAmountRaisedFormatted?.formattedValue))}{" "}
            {depositTokenSymbol} raised
          </Typography>
        )}

        {tokenType === "erc721" ? (
          <Typography variant="inherit">
            {formatNumbers(Number(distributionAmountFormatted?.actualValue))}{" "}
            total
          </Typography>
        ) : (
          <Typography variant="inherit">
            {formatNumbers(Number(raiseAmountFormatted?.formattedValue))}{" "}
            {depositTokenSymbol} total
          </Typography>
        )}
      </div>

      <ProgressBar
        zIndex={-1}
        value={
          tokenType === "erc721"
            ? (Number(nftMinted) * 100) /
              Number(distributionAmountFormatted?.actualValue)
            : totalAmountRaisedFormatted?.bigNumberValue
                .times(100)
                .dividedBy(raiseAmountFormatted?.bigNumberValue)
                .integerValue()
                .toFixed()
        }
      />
    </div>
  );
};

export default DepositProgress;
