import { init } from "@web3-onboard/react";
import injectedModule from "@web3-onboard/injected-wallets";
import { POLYGON_MAINNET_RPC_URL } from "../api";

const INFURA_ID = "sdf";

const MATIC_MAINNET_RPC = "https://matic-mainnet.chainstacklabs.com";
const ETH_MAINNET_RPC = `https://mainnet.infura.io/v3/${INFURA_ID}`;
const ETH_GOERLI_RPC = `https://eth-goerli.g.alchemy.com/v2/kVRnoC6Kb95260vGYxLHCD7J_ZyfYEtu`;

const ethereumMainnet = {
  id: "0x1",
  token: "ETH",
  label: "Ethereum Mainnet",
  rpcUrl: ETH_MAINNET_RPC,
};

const ethereumGoerli = {
  id: "0x5",
  token: "gETH",
  label: "Ethereum Goerli Testnet",
  rpcUrl: ETH_GOERLI_RPC,
};

const polygonMainnet = {
  id: "0x89",
  token: "MATIC",
  label: "Polygon",
  rpcUrl: POLYGON_MAINNET_RPC_URL,
};

const chains = [ethereumMainnet, ethereumGoerli, polygonMainnet];
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
  // disconnect: disconnectWallet({ label: primaryWallet.label }),
});
