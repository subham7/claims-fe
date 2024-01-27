import { Typography } from "@mui/material";
import Image from "next/image";
import React from "react";
import classes from "./Staking.module.scss";

const StakingCard = ({ name, image, apy, staked, token }) => {
  return (
    <div className={classes.stakingCard}>
      <div className={classes.heading}>
        <Image src={image} height={30} width={30} alt={name} />
        <Typography fontSize={18} fontWeight={500} variant="inherit">
          {name}
        </Typography>
      </div>

      <div className={classes.apyContainer}>
        <div>
          <Typography fontWeight={600} variant="inherit">
            {apy}%
          </Typography>
          <Typography
            className={classes.smallFont}
            fontSize={14}
            variant="inherit">
            APY
          </Typography>
        </div>

        <div>
          <Typography fontWeight={600} variant="inherit">
            {staked} {token}
          </Typography>
          <Typography
            className={classes.smallFont}
            fontSize={14}
            variant="inherit">
            Staked
          </Typography>
        </div>
      </div>

      <div className={classes.buttonContainer}>
        <button>Stake</button>
        <button>Unstake</button>
      </div>
    </div>
  );
};

export default StakingCard;
