import React from "react";
import { Tabs, Tab } from "@mui/material";
import classes from "./Proposal.module.scss";

const ProposalTabs = ({ tabType, onChange }) => {
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
          value="Queue"
          label="Queue"
        />
        <Tab
          sx={{
            fontFamily: "inherit",
            textTransform: "none",
          }}
          value="History"
          label="History"
        />
      </Tabs>
    </div>
  );
};

export default ProposalTabs;
