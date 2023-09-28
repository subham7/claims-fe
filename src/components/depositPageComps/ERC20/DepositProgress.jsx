import ProgressBar from "@components/progressbar";
import { Typography } from "@mui/material";
import React from "react";
import { convertFromWeiGovernance } from "utils/globalFunctions";

const DepositProgress = ({ clubData, tokenDetails, nftMinted = 0 }) => {
  console.log("xxx", clubData);
  return (
    <div
      style={{
        marginBottom: "20px",
      }}>
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
        }}>
        {clubData?.tokenType === "erc721" ? (
          <Typography>{nftMinted} minted</Typography>
        ) : (
          <Typography variant="info" className="tb-mar-1">
            {convertFromWeiGovernance(
              clubData?.totalAmountRaised,
              tokenDetails.tokenDecimal,
            )}{" "}
            {tokenDetails.tokenSymbol} raised
          </Typography>
        )}

        {clubData?.tokenType === "erc721" ? (
          <Typography>{clubData?.distributionAmount} total</Typography>
        ) : (
          <Typography>
            {convertFromWeiGovernance(
              clubData?.raiseAmount,
              tokenDetails?.tokenDecimal,
            )}{" "}
            {tokenDetails.tokenSymbol} total
          </Typography>
        )}
      </div>

      <ProgressBar
        value={
          clubData?.tokenType === "erc721"
            ? (Number(nftMinted) * 100) / Number(clubData?.distributionAmount)
            : (Number(clubData?.totalAmountRaised) * 100) /
              Number(clubData?.raiseAmount)
        }
      />
    </div>
  );
};

export default DepositProgress;
