import React from "react"
import { Box, Slider } from "@mui/material"
import { styled } from "@mui/material"

const CustomPrompt = styled(Slider)(({ theme }) => ({
  '& .MuiSlider-rail': {
    color: '#C1D3FF',
    backgroundColor: '#C1D3FF',
  },
  '& .MuiSlider-track': {
    color: '#3B7AFD'
  },

  '& .MuiSlider-valueLabel': {
    fontSize: 12,
    fontWeight: 'normal',
    top: -6,
    backgroundColor: 'unset',
    '&:before': {
      display: 'none',
    },
    '& *': {
      background: 'transparent',
      color: theme.palette.mode === 'dark' ? '#fff' : '#000',
    },
  },
}));

function valuetext(value, index) {
  return `${value}%`;
}

export default function CustomSlider(props) {
  return(
    <Box sx={{width: "28vw"}}>
      <CustomPrompt
        aria-label="Always visible"
        step={1}
        valueLabelDisplay="on"
        valueLabelFormat={valuetext}
        onChange={props.onChange}
      />
    </Box>
  );
}