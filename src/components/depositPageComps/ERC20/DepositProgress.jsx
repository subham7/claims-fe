import ProgressBar from "@components/progressbar";
import { Typography } from "@mui/material";
import React from "react";
import { convertFromWeiGovernance } from "utils/globalFunctions";

const DepositProgress = ({ clubData, tokenDetails }) => {
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
        <Typography variant="info" className="tb-mar-1">
          {convertFromWeiGovernance(
            clubData?.totalAmountRaised,
            tokenDetails.tokenDecimal,
          )}{" "}
          {tokenDetails.tokenSymbol} raised
        </Typography>

        <Typography>
          {convertFromWeiGovernance(
            clubData?.raiseAmount,
            tokenDetails?.tokenDecimal,
          )}{" "}
          {tokenDetails.tokenSymbol} total
        </Typography>
      </div>

      <ProgressBar
        zIndex={-1}
        value={
          (Number(clubData?.totalAmountRaised) * 100) /
          Number(clubData?.raiseAmount)
        }
      />
    </div>
  );
};

export default DepositProgress;
