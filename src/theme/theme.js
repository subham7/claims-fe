import { createTheme } from "@mui/material/styles"
import { darkComponents } from "./darkComponent"
import { lightComponents } from "./lightComponent"

const theme = (mode) =>
  createTheme({
    palette: {
      mode: mode,
      background: {
        default: mode == "dark" ? "#121212" : "#F4F4F5",
        paper: mode == "dark" ? "#242424" : "#F4F4F5",
      },
    },
    components: {
      ...(mode == "dark" ? darkComponents : lightComponents),
    },
  })

export default theme
