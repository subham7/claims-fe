import "../styles/globals.css"
import React from "react"
import { ThemeProvider } from "@mui/material/styles"
import theme from "../src/theme/theme"
import store from "../src/redux/store"
import { Provider } from "react-redux"
import Faucet from "./faucet"
import "../styles/fonts.css"

function MyApp({ Component, pageProps }) {
  return (
    <Provider store={store}>
      <ThemeProvider theme={theme("dark")}>
        <Component {...pageProps} />
        
      </ThemeProvider>
    </Provider>
  )
}

export default MyApp
