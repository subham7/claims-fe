import "../styles/globals.css"
import "ui-neumorphism/dist/index.css"
import React from "react"
import { ThemeProvider } from "@mui/material/styles"
import theme from "../src/theme/theme"

function MyApp({ Component, pageProps }) {
  return (
    <ThemeProvider theme={theme("dark")}>
      <Component {...pageProps} />
    </ThemeProvider>
  )
}

export default MyApp
