import React from "react";
import classes from "@components/(settings)/Settings.module.scss";
import { BiPlus } from "react-icons/bi";
import { Typography } from "@mui/material";

const TreasurySigner = () => {
  return (
    <div className={classes.treasurySignerContainer}>
      <input
        className={classes.input}
        disabled
        value={"0x38ed8407df36b456add16d50b1f61721cba6fbc0"}
      />

      <button>
        <Typography variant="inherit">Add</Typography>
        <BiPlus size={15} />
      </button>
    </div>
  );
};

export default TreasurySigner;
