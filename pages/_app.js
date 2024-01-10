import React from "react";
import { ThemeProvider } from "@mui/material/styles";
import theme from "../src/theme/theme";
import store from "../src/redux/store";
import { Provider } from "react-redux";
import "../styles/globals.scss";
import { ApolloClient, ApolloProvider, InMemoryCache } from "@apollo/client";
import {
  EthereumClient,
  w3mConnectors,
  w3mProvider,
} from "@web3modal/ethereum";
import { Web3Modal } from "@web3modal/react";
import { configureChains, createConfig, WagmiConfig } from "wagmi";
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
import Script from "next/script";

const API_URL = "https://api.lens.dev";

export const apolloClient = new ApolloClient({
  uri: API_URL,
  cache: new InMemoryCache(),
});

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
const projectId = process.env.NEXT_PUBLIC_PROJECT_ID;

const { publicClient } = configureChains(chains, [w3mProvider({ projectId })]);
const wagmiConfig = createConfig({
  autoConnect: true,
  connectors: w3mConnectors({ projectId, chains }),
  publicClient,
});

const ethereumClient = new EthereumClient(wagmiConfig, chains);

function MyApp({ Component, pageProps }) {
  return (
    <>
      <Script
        src={`https://www.googletagmanager.com/gtag/js?id=${process.env.NEXT_PUBLIC_GOOGLE_ANALYTICS}`}
      />
      <Script id="google-analytics">
        {`
          window.dataLayer = window.dataLayer || [];
          function gtag(){dataLayer.push(arguments);}
          gtag('js', new Date());
 
          gtag('config', "${process.env.NEXT_PUBLIC_GOOGLE_ANALYTICS}");
        `}
      </Script>
      <ThemeProvider theme={theme()}>
        <ApolloProvider client={apolloClient}>
          <WagmiConfig config={wagmiConfig}>
            <Provider store={store}>
              {/* <AnnouncementProvider>
              <AnnouncementBar /> */}
              <Component {...pageProps} />
              {/* </AnnouncementProvider> */}
            </Provider>
          </WagmiConfig>
          <Web3Modal
            chainImages={{
              59144: "/assets/icons/linea-mainnet.webp",
              8453: "/assets/icons/base-mainnet.png",
              5000: "/assets/icons/mantle-mainnet.png",
              169: "/assets/icons/manta.png",
              534352: "/assets/icons/scroll.jpeg",
              167007: "/assets/icons/taiko.jpeg",
            }}
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
      </ThemeProvider>
    </>
  );
}

export default MyApp;
