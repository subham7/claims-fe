import { createTheme } from "@mui/material/styles"
import { darkComponents } from "./darkComponent"
import { lightComponents } from "./lightComponent"

const theme = (mode) =>
  createTheme({
    palette: {
      mode: mode,
      background: {
        default: mode == "dark" ? "#19274B" : "#EFEFEF",
        paper: mode == "dark" ? "#191919" : "#F4F4F5",
      },
    },
    components: {
      ...(mode == "dark" ? darkComponents : lightComponents),
      MuiTab: {
        styleOverrides: {
          root: { textTransform: "none" },
        },
      },
    },
    text: {
      primary: "#484848",
    },
  })

export default theme
