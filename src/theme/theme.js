import { createTheme } from "@mui/material/styles";
import { darkComponents } from "./darkComponent";

const theme = () =>
  createTheme({
    palette: {
      mode: "dark",
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
      // background: { default: "#0F0F0F" },
      background: {
        default: "#111D38",
        paper: "#191919",
      },
      text: {
        primary: "#F5F5F5",
      },
    },
    components: {
      ...darkComponents,
    },
  });

export default theme;
