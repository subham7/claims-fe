import React from "react";
import { ThemeProvider } from "@mui/material/styles";
import theme from "../src/theme/theme";
import store from "../src/redux/store";
import { Provider } from "react-redux";
import { ApolloClient, ApolloProvider, InMemoryCache } from "@apollo/client";
import { AnnouncementProvider } from "../src/components/AnnouncementContext";
import { createWeb3Modal, defaultWagmiConfig } from "@web3modal/wagmi/react";
import "../styles/globals.scss";

import { WagmiConfig } from "wagmi";
import {
  polygon,
  base,
  arbitrum,
  bsc,
  mantle,
  gnosis,
  taikoJolnir,
  mainnet,
} from "wagmi/chains";
import {
  lineaMainnetWalletConnect,
  scrollMainnet,
  mantaMainnet,
} from "utils/constants";

const API_URL = "https://api.lens.dev";

export const apolloClient = new ApolloClient({
  uri: API_URL,
  cache: new InMemoryCache(),
});

const projectId = process.env.NEXT_PUBLIC_PROJECT_ID;

const metadata = {
  name: "StationX",
  description: "StationX App",
  url: "https://www.stationx.network/",
  icons: [
    "https://www.stationx.network/_next/image?url=%2Fassets%2Ficons%2Flogo.png&w=384&q=75",
  ],
};

const chains = [
  mainnet,
  polygon,
  base,
  arbitrum,
  bsc,
  mantle,
  lineaMainnetWalletConnect,
  gnosis,
  taikoJolnir,
  scrollMainnet,
  mantaMainnet,
];

const wagmiConfig = defaultWagmiConfig({ chains, projectId, metadata });

createWeb3Modal({
  wagmiConfig,
  projectId,
  chains,
  themeVariables: {
    "--w3m-accent": "#2d55ff",
  },
});

function MyApp({ Component, pageProps }) {
  return (
    <ThemeProvider theme={theme()}>
      <ApolloProvider client={apolloClient}>
        <WagmiConfig config={wagmiConfig}>
          <Provider store={store}>
            <AnnouncementProvider>
              <Component {...pageProps} />
            </AnnouncementProvider>
          </Provider>
        </WagmiConfig>
      </ApolloProvider>
    </ThemeProvider>
  );
}

export default MyApp;
