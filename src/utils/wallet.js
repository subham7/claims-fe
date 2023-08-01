import { init } from "@web3-onboard/react";
import injectedModule from "@web3-onboard/injected-wallets";
import { POLYGON_MAINNET_RPC_URL } from "../api";

const polygonMainnet = {
  id: "0x89",
  token: "MATIC",
  label: "Polygon",
  rpcUrl: POLYGON_MAINNET_RPC_URL,
};

const chains = [polygonMainnet];
const wallets = [injectedModule()];

const customTheme = {
  "--w3o-background-color": "#111d38",
  "--w3o-foreground-color": "#111d38",
  "--w3o-text-color": "#fff",
  "--w3o-border-color": "#ccc",
  "--w3o-action-color": "#007bff",
  "--w3o-border-radius": "24px",
};

export const web3Onboard = init({
  connect: {
    autoConnectLastWallet: true,
  },
  theme: customTheme,
  wallets,
  chains,
  appMetadata: {
    name: "StaionX",
    icon: "<svg>My App Icon</svg>",
    description: "create DAO in 60 secs",
  },
  accountCenter: {
    desktop: {
      enabled: true,
      position: "topRight",
      minimal: false,
    },
    mobile: {
      enabled: true,
      position: "topRight",
    },
  },
});
