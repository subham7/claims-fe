import { Typography } from "@mui/material";
import React from "react";
import { useSelector } from "react-redux";
import { convertFromWeiGovernance } from "utils/globalFunctions";
import classes from "../../claims/Claim.module.scss";

const Detail = ({
  title,
  value,
  isAmount = false,
  isPricePerToken = false,
  tokenName = "",
}) => {
  const renderedValue = isPricePerToken
    ? `1 ${title}: ${value} ${tokenName}`
    : `${title}: ${value} ${isAmount ? "USDC" : ""}`;

  return (
    <div className={classes.detailCard}>
      <Typography>{renderedValue}</Typography>
    </div>
  );
};

const DepositDetails = ({ contractData = {}, tokenDetails = {} }) => {
  const {
    minDepositAmount,
    maxDepositAmount,
    quorum = "-",
    threshold = "-",
    pricePerToken,
    symbol,
  } = contractData;
  const { tokenSymbol, tokenDecimal } = tokenDetails;

  const isGovernanceActive = useSelector((state) => {
    return state.club.erc20ClubDetails.isGovernanceActive;
  });

  return (
    <div>
      <div className={classes.detailContainer}>
        <Detail
          title="Min"
          value={convertFromWeiGovernance(minDepositAmount, tokenDecimal)}
          isAmount
        />
        <Detail
          title="Max"
          value={convertFromWeiGovernance(maxDepositAmount, tokenDecimal)}
          isAmount
        />
        <Detail
          title={symbol}
          value={convertFromWeiGovernance(pricePerToken, tokenDecimal)}
          tokenName={tokenSymbol}
          isPricePerToken
        />
      </div>
      <div className={classes.detailContainer}>
        <Detail
          title="Control"
          value={isGovernanceActive ? "Community" : "Admins"}
        />
        <Detail title="Quorum" value={isGovernanceActive ? quorum : "N/A"} />
        <Detail
          title="Threshold"
          value={isGovernanceActive ? threshold : "N/A"}
        />
      </div>
    </div>
  );
};

export default DepositDetails;
