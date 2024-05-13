import React from "react";
import { Tabs, Tab } from "@mui/material";
import classes from "./Staking.module.scss";

const StakingTabs = ({ tabType, onChange }) => {
  return (
    <div className={classes.tabsSelection}>
      <Tabs
        TabIndicatorProps={{
          style: { backgroundColor: "#fff" },
        }}
        textColor="inherit"
        onChange={onChange}
        value={tabType}>
        <Tab
          sx={{
            fontFamily: "inherit",
            textTransform: "none",
          }}
          value="ETH"
          label="ETH Pools"
        />
        <Tab
          sx={{
            fontFamily: "inherit",
            textTransform: "none",
          }}
          value="USDC"
          label="USDC Pools"
        />
        <Tab
          sx={{
            fontFamily: "inherit",
            textTransform: "none",
          }}
          value="PAIR"
          label="PAIR - Pools"
        />
      </Tabs>
    </div>
  );
};

export default StakingTabs;
