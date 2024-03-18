import React from "react";
import { Tabs, Tab } from "@mui/material";
import classes from "./Settings.module.scss";

const TabSelection = ({ settingsType, onChange }) => {
  return (
    <div className={classes.tabsSelection}>
      <Tabs
        TabIndicatorProps={{
          style: { backgroundColor: "#fff" },
        }}
        textColor="inherit"
        onChange={onChange}
        value={settingsType}>
        <Tab
          sx={{
            fontFamily: "inherit",
            textTransform: "none",
          }}
          value="general"
          label="General"
        />
        <Tab
          sx={{
            fontFamily: "inherit",
            textTransform: "none",
          }}
          value="deposits"
          label="Deposits"
        />
      </Tabs>
    </div>
  );
};

export default TabSelection;
