import { Typography } from "@mui/material";
import React from "react";
import classes from "./LineaCreateModal.module.scss";

const LineaSurgeBar = () => {
  return (
    <div className={classes.joinCampaignBar}>
      <Typography variant="inherit" fontSize={17} fontWeight={600}>
        Join the Linea Surge and run stations on StationX to get LXP-L points.{" "}
        <a
          href={`https://stnx.notion.site/Participate-in-SurgeOnLinea-a659cb8412a24233971a2f7b247643f7?pvs=25https://stnx.notion.site/Participate-in-SurgeOnLinea-a659cb8412a24233971a2f7b247643f7?pvs=25`}
          target="_blank"
          rel="noopener noreferrer">
          Learn more.
        </a>
      </Typography>
    </div>
  );
};

export default LineaSurgeBar;
