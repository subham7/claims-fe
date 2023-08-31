import { createTheme } from "@mui/material/styles";
import { darkComponents } from "./darkComponent";
import { lightComponents } from "./lightComponent";

const theme = (mode) =>
  createTheme({
    palette: {
      mode: mode,
      // primary: {
      //   main: "#2D55FF",
      //   dark: "#2E55FF",
      //   contrastText: "#F5F5F5",
      // },
      // error: {
      //   main: "#D55438",
      //   contrastText: "#F5F5F5",
      // },
      // info: {
      //   main: "#FFB74D",
      //   contrastText: "#F5F5F5",
      // },
      // success: {
      //   main: "#0ABB92",
      //   contrastText: "#F5F5F5",
      // },
      // background: { default: "#0F0F0F" },
      background: {
        default: mode == "dark" ? "#111D38" : "#EFEFEF",
        paper: mode == "dark" ? "#191919" : "#F4F4F5",
      },
      text: {
        primary: "#F5F5F5",
      },
    },
    components: {
      ...(mode == "dark" ? darkComponents : lightComponents),
    },
  });

export default theme;
