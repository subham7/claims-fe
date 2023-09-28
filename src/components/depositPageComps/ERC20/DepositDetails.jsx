import { Typography } from "@mui/material";
import React from "react";
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

const convertValue = (value, decimal) =>
  convertFromWeiGovernance(value, decimal);

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

  return (
    <div>
      <div className={classes.detailContainer}>
        <Detail
          title="Min"
          value={convertValue(minDepositAmount, tokenDecimal)}
          isAmount
        />
        <Detail
          title="Max"
          value={convertValue(maxDepositAmount, tokenDecimal)}
          isAmount
        />
        <Detail
          title={tokenSymbol}
          value={convertValue(pricePerToken, tokenDecimal)}
          tokenName={symbol}
          isPricePerToken
        />
      </div>
      <div className={classes.detailContainer}>
        <Detail title="Control" value="Admins" />
        <Detail title="Quorum" value={quorum} />
        <Detail title="Threshold" value={threshold} />
      </div>
    </div>
  );
};

export default DepositDetails;
