import { Typography } from "@mui/material";
import React from "react";

const StatItem = ({ primaryText, secondaryText }) => {
  return (
    <div>
      <Typography
        fontSize={18}
        fontWeight={600}
        color={"white"}
        mb={0.7}
        variant="inherit">
        {primaryText}
      </Typography>
      <Typography fontSize={14} variant="inherit" color={"#707070"}>
        {secondaryText}
      </Typography>
    </div>
  );
};

export default StatItem;
