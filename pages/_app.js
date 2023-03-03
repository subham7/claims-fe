import "../styles/globals.css";
import React from "react";
import { ThemeProvider } from "@mui/material/styles";
import theme from "../src/theme/theme";
import store from "../src/redux/store";
import { Provider } from "react-redux";
import Faucet from "./faucet";
import "../styles/fonts.css";
import { Web3OnboardProvider } from "@web3-onboard/react";
import { web3Onboard } from "../src/utils/wallet";

function MyApp({ Component, pageProps }) {
  return (
    <Provider store={store}>
      <ThemeProvider theme={theme("dark")}>
        <Web3OnboardProvider web3Onboard={web3Onboard}>
          <Component {...pageProps} />
        </Web3OnboardProvider>
      </ThemeProvider>
    </Provider>
  );
}

export default MyApp;
