import React from "react";
import { ThemeProvider } from "@mui/material/styles";
import theme from "../src/theme/theme";
import store from "../src/redux/store";
import { Provider } from "react-redux";
import "../styles/fonts.css";
import "../styles/globals.scss";
import { Web3OnboardProvider } from "@web3-onboard/react";
import { web3Onboard } from "../src/utils/wallet";
import { ApolloProvider } from "@apollo/client";
import { SUBGRAPH_CLIENT } from "../src/api";
import { AnnouncementProvider } from "../src/components/AnnouncementContext";
import AnnouncementBar from "../src/components/AnnouncementBar";

function MyApp({ Component, pageProps }) {
  return (
    web3Onboard && (
      <ApolloProvider client={SUBGRAPH_CLIENT}>
        <Provider store={store}>
          <ThemeProvider theme={theme("dark")}>
            <AnnouncementProvider>
              <AnnouncementBar />
              <Web3OnboardProvider web3Onboard={web3Onboard}>
                <Component {...pageProps} />
              </Web3OnboardProvider>
            </AnnouncementProvider>
          </ThemeProvider>
        </Provider>
      </ApolloProvider>
    )
  );
}

export default MyApp;
