import { ApolloClient, ApolloProvider, InMemoryCache } from "@apollo/client";
import { ThemeProvider } from "@mui/material/styles";
// import { ConnectKitProvider } from "connectkit";
import Script from "next/script";
import React from "react";
import { Provider } from "react-redux";
import { cookieToInitialState } from "wagmi";

import { config } from "config";
import Web3ModalProvider from "context/WagmiProvider";

import store from "../src/redux/store";
import theme from "../src/theme/theme";

import "../styles/globals.scss";

const API_URL = "https://api.lens.dev";

export const apolloClient = new ApolloClient({
  uri: API_URL,
  cache: new InMemoryCache(),
});

// const chains = [
//   mainnet,
//   polygon,
//   base,
//   arbitrum,
//   bsc,
//   mantle,
//   lineaMainnetWalletConnect,
//   gnosis,
//   taikoJolnir,
//   scrollMainnet,
//   beraMainnetWalletConnect,
//   mantaMainnet,
//   goerli,
//   blastMainnetWalletConnect,
//   avalanche,
// ];

// const wagmiConfig = defaultWagmiConfig({
//   chains: stationNetworksChainId,
//   projectId,
//   metadata,
// });

// createWeb3Modal({
//   wagmiConfig,
//   projectId,
//   chains: stationNetworksChainId,
//   themeVariables: {
//     "--w3m-accent": "#1e1e1e",
//     "--w3m-font-family": "inherit",
//   },

//   includeWalletIds: [
//     "c57ca95b47569778a828d19178114f4db188b89b763c899ba0be274e97267d96",
//     "a797aa35c0fadbfc1a53e7f675162ed5226968b44a19ee3d24385c64d1d3c393",
//     "18388be9ac2d02726dbac9777c96efaac06d744b2f6d580fccdd4127a6d01fd1",
//     "19177a98252e07ddfc9af2083ba8e07ef627cb6103467ffebb3f8f4205fd7927",
//     "1ae92b26df02f0abca6304df07debccd18262fdf5fe82daa81593582dac9a369",
//     "4622a2b2d6af1c9844944291e5e7351a6aa24cd7b23099efac1b2fd875da31a0",
//     "fd20dc426fb37566d803205b19bbc1d4096b248ac04548e3cfb6b3a38bd033aa",
//   ],
// });

function MyApp({ Component, pageProps }) {
  const initialState = cookieToInitialState(config);

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
          {/* <WagmiConfig config={wagmiConfig}> */}
          <Web3ModalProvider initialState={initialState}>
            {/* <ConnectKitProvider> */}
            <Provider store={store}>
              <Component {...pageProps} />
            </Provider>
            {/* </ConnectKitProvider> */}
          </Web3ModalProvider>
          {/* </WagmiConfig> */}
        </ApolloProvider>
      </ThemeProvider>
    </>
  );
}

export default MyApp;
