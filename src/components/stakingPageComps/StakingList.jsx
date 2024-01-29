import { Typography } from "@mui/material";
import React from "react";
import StakingCard from "./StakingCard";
import classes from "./Staking.module.scss";
import { DEFI_PROPOSALS } from "utils/proposalConstants";
import { useNetwork } from "wagmi";

const StakingList = ({ daoAddress }) => {
  const { chain } = useNetwork();
  const networkId = "0x" + chain?.id.toString(16);

  return (
    <div className={classes.container}>
      <Typography fontSize={24} fontWeight={600} variant="inherit">
        Featured Pools
      </Typography>

      <div className={classes.list}>
        {DEFI_PROPOSALS({
          clipFinanceStaked: 0,
        })
          .filter((item) => item.availableOnNetworkIds.includes(networkId))
          .map((item) => (
            <StakingCard
              apy={item.APY}
              image={item.logo}
              name={item.name}
              staked={item.staked}
              token={item.token}
              key={item.name}
              daoAddress={daoAddress}
              executionIds={item.executionIds}
            />
          ))}
      </div>
    </div>
  );
};

export default StakingList;
