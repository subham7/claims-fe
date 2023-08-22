import React from "react";
import { ThemeProvider } from "@mui/material/styles";
import theme from "../src/theme/theme";
import store from "../src/redux/store";
import { Provider } from "react-redux";
import "../styles/fonts.css";
import "../styles/globals.scss";
import { ApolloClient, ApolloProvider, InMemoryCache } from "@apollo/client";
import { AnnouncementProvider } from "../src/components/AnnouncementContext";
import AnnouncementBar from "../src/components/AnnouncementBar";
import {
  EthereumClient,
  w3mConnectors,
  w3mProvider,
} from "@web3modal/ethereum";
import { Web3Modal } from "@web3modal/react";
import { configureChains, createConfig, WagmiConfig } from "wagmi";
import { polygon, base, arbitrum } from "wagmi/chains";

const API_URL = "https://api.lens.dev";

export const apolloClient = new ApolloClient({
  uri: API_URL,
  cache: new InMemoryCache(),
});

const chains = [polygon, base, arbitrum];
const projectId = "35b31c8ffbfd99ac267e35ecdf60530a";

const { publicClient } = configureChains(chains, [w3mProvider({ projectId })]);
const wagmiConfig = createConfig({
  autoConnect: true,
  connectors: w3mConnectors({ projectId, chains }),
  publicClient,
});

const ethereumClient = new EthereumClient(wagmiConfig, chains);

function MyApp({ Component, pageProps }) {
  return (
    <ApolloProvider client={apolloClient}>
      <WagmiConfig config={wagmiConfig}>
        <Provider store={store}>
          <ThemeProvider theme={theme("dark")}>
            <AnnouncementProvider>
              <AnnouncementBar />
              <Component {...pageProps} />
            </AnnouncementProvider>
          </ThemeProvider>
        </Provider>
      </WagmiConfig>
      <Web3Modal
        themeMode="light"
        themeVariables={{
          "--w3m-overlay-background-color": "#00000088",
          "--w3m-accent-color": "#000",
          "--w3m-background-color": "#000",
        }}
        projectId={projectId}
        ethereumClient={ethereumClient}
      />
    </ApolloProvider>
  );
}

export default MyApp;
