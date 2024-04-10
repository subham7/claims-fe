import { Typography } from "@mui/material";
import Image from "next/image";
import React from "react";
import classes from "./Card.module.scss";

const Erc20Card = ({ imageUrl, stationName, raiseAmount, depositToken }) => {
  return (
    <div className={classes.card}>
      <Image
        src={imageUrl}
        height={150}
        width={300}
        alt={stationName}
        className={classes.bannerImage}
      />
      <div className={classes.infoContainer}>
        <Typography fontWeight={600} fontSize={18} mb={0.8} variant="inherit">
          {stationName}
        </Typography>
        <Typography color={"#C4C4C4"} fontSize={14} mb={1.2} variant="inherit">
          Raising {raiseAmount} {depositToken}
        </Typography>
        <button>Join</button>
      </div>
    </div>
  );
};

export default Erc20Card;
