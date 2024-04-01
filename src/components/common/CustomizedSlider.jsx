import Slider from "@mui/material/Slider";
import { styled } from "@mui/material/styles";

const GradientSlider = styled(Slider)(({ theme }) => ({
  width: "300px",
  "& .MuiSlider-thumb": {
    backgroundColor: "#fff",
  },
  "& .MuiSlider-track": {
    backgroundImage: "linear-gradient(to left, #FF274C, #E0A100, #0ABB92)",
  },
  "& .MuiSlider-rail": {
    opacity: 0.9,
    backgroundImage: "linear-gradient(to left, #FF274C, #E0A100, #0ABB92)",
  },
}));

export default function CustomizedSlider() {
  return (
    <GradientSlider
      aria-label="Gradient slider"
      defaultValue={20}
      step={10}
      marks
      min={10}
      max={110}
    />
  );
}
