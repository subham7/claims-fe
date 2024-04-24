import { Typography } from "@mui/material";
import React from "react";
import { useSelector } from "react-redux";
import classes from "../../claims/Claim.module.scss";
import { formatNumbers, shortAddress } from "utils/helper";

const DepositDetails = () => {
  const clubData = useSelector((state) => {
    return state.club.clubData;
  });

  const {
    minDepositAmountFormatted,
    maxDepositAmountFormatted,
    ownerAddress,
    depositTokenSymbol,
  } = clubData;

  return (
    <div>
      <div className={classes.detailContainer}>
        <div className={classes.detailCard}>
          <Typography fontSize={14} fontWeight={400} color={"#707070"}>
            Minimum
          </Typography>
          <Typography
            fontSize={16}
            mt={0.4}
            fontWeight={600}
            color={"white"}
            variant="inherit">
            {formatNumbers(Number(minDepositAmountFormatted?.formattedValue))}{" "}
            {depositTokenSymbol}
          </Typography>
        </div>
        <div className={classes.detailCard}>
          <Typography fontSize={14} fontWeight={400} color={"#707070"}>
            Maximum
          </Typography>
          <Typography
            fontSize={16}
            mt={0.4}
            fontWeight={600}
            color={"white"}
            variant="inherit">
            {formatNumbers(Number(maxDepositAmountFormatted?.formattedValue))}{" "}
            {depositTokenSymbol}
          </Typography>
        </div>
        <div className={classes.detailCard}>
          <Typography fontSize={14} fontWeight={400} color={"#707070"}>
            Owner
          </Typography>
          <Typography
            fontSize={16}
            mt={0.4}
            fontWeight={600}
            color={"white"}
            variant="inherit">
            🐻 {shortAddress(ownerAddress)}
          </Typography>
        </div>
      </div>
    </div>
  );
};

export default DepositDetails;
