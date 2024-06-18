import { Typography } from "@mui/material";
import Image from "next/image";
import React from "react";
import classes from "./Card.module.scss";

const Erc721Card = ({
  imageUrl,
  stationName,
  mintedAmount,
  price,
  depositToken,
}) => {
  return (
    <div className={classes.erc721Card}>
      <Image src={imageUrl} height={265} width={265} alt={stationName} />
      <div className={classes.infoContainer}>
        <Typography fontWeight={600} fontSize={18} mb={0.8} variant="inherit">
          {stationName}
        </Typography>
        <Typography color={"#C4C4C4"} fontSize={14} mb={1.2} variant="inherit">
          {mintedAmount} minted • {price} {depositToken}
        </Typography>
        <button>Join</button>
      </div>
    </div>
  );
};

export default Erc721Card;
