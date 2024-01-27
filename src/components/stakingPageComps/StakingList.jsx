import { Typography } from "@mui/material";
import React from "react";
import StakingCard from "./StakingCard";
import classes from "./Staking.module.scss";

const DUMMY_LIST = [
  {
    name: "Clip Finance",
    logo: "/assets/images/clipFinanceLogo.png",
    APY: "70",
    staked: "1800",
    token: "USDC",
  },
  {
    name: "Lido x ElgenLayer",
    logo: "/assets/images/lido_elgen.png",
    APY: "9.4",
    staked: "100",
    token: "ETH",
  },
];

const StakingList = ({ daoAddress }) => {
  return (
    <div className={classes.container}>
      <Typography fontSize={24} fontWeight={600} variant="inherit">
        Featured Pools
      </Typography>

      <div className={classes.list}>
        {DUMMY_LIST.map((item) => (
          <StakingCard
            apy={item.APY}
            image={item.logo}
            name={item.name}
            staked={item.staked}
            token={item.token}
            key={item.name}
          />
        ))}
      </div>
    </div>
  );
};

export default StakingList;
