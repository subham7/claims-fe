import { createTheme } from "@mui/material/styles";
// import { darkComponents } from "./darkComponent";
// import { lightComponents } from "./lightComponent";

const theme = (mode) =>
  createTheme({
    palette: {
      primary: {
        main: "#2D55FF",
        dark: "#2E55FF",
        contrastText: "#F5F5F5",
      },
      error: {
        main: "#D55438",
        contrastText: "#F5F5F5",
      },
      info: {
        main: "#FFB74D",
        contrastText: "#F5F5F5",
      },
      success: {
        main: "#0ABB92",
        contrastText: "#F5F5F5",
      },
      background: { default: "#0F0F0F" },
      text: {
        primary: "#F5F5F5",
      },
    },
    // components: {
    //   ...(mode == "dark" ? darkComponents : lightComponents),
    // },
  });

export default theme;
