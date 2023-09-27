import React from "react";
import { Box, Slider } from "@mui/material";
import { styled } from "@mui/material";

const CustomPrompt = styled(Slider)(({ theme }) => ({
  "& .MuiSlider-rail": {
    color: "#dcdcdc",
    backgroundColor: "#dcdcdc",
    height: "13px",
  },
  "& .MuiSlider-track": {
    color: "#2D55FF",
    height: "13px",
  },
  "& .MuiSlider-thumb": {
    width: "26px",
    height: "26px",
  },
  "& .MuiSlider-valueLabel": {
    color: "#dcdcdc",
    fontSize: 18,
    fontWeight: "normal",
    top: -6,
    backgroundColor: "unset",
    "&:before": {
      display: "none",
    },
    "& *": {
      background: "transparent",
      color: theme.palette.mode === "dark" ? "#fff" : "#000",
    },
  },
}));

function valuetext(value, index) {
  return `${value}%`;
}

export default function CustomSlider(props) {
  return (
    <Box sx={{ width: "100%" }}>
      <CustomPrompt
        aria-label="Always visible"
        step={1}
        valueLabelDisplay="on"
        valueLabelFormat={valuetext}
        onChange={props.onChange}
        defaultValue={props.defaultValue}
        min={props.min}
        max={props.max}
      />
    </Box>
  );
}
