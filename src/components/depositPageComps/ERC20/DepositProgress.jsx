import ProgressBar from "@components/progressbar";
import { Typography } from "@mui/material";
import React from "react";
import { convertFromWeiGovernance } from "utils/globalFunctions";

const DepositProgress = ({ clubData, tokenDetails, nftMinted = 0 }) => {
  const {
    totalAmountRaised = 0,
    distributionAmount = 0,
    raiseAmount = 0,
    tokenType = "erc20",
  } = clubData;

  const { tokenDecimal, tokenSymbol } = tokenDetails;

  return (
    <div
      style={{
        marginBottom: "20px",
      }}>
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}>
        {tokenType === "erc721" ? (
          <Typography>{nftMinted} minted</Typography>
        ) : (
          <Typography variant="info" className="tb-mar-1">
            {convertFromWeiGovernance(totalAmountRaised, tokenDecimal)}{" "}
            {tokenSymbol} raised
          </Typography>
        )}

        {tokenType === "erc721" ? (
          <Typography>{distributionAmount} total</Typography>
        ) : (
          <Typography>
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
