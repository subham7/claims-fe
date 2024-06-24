import { defaultWagmiConfig } from "@web3modal/wagmi/react/config";
import { stationNetworksChainId } from "utils/constants";
import { cookieStorage, createStorage } from "wagmi";

// Get projectId at https://cloud.walletconnect.com
export const projectId = process.env.NEXT_PUBLIC_PROJECT_ID;
if (!projectId) throw new Error("Project ID is not defined");

const metadata = {
  name: "StationX",
  description: "StationX App",
  url: "https://www.stationx.network/",
  icons: [
    "https://www.stationx.network/_next/image?url=%2Fassets%2Ficons%2Flogo.png&w=384&q=75",
  ],
};

// Create wagmiConfig
export const config = defaultWagmiConfig({
  chains: stationNetworksChainId,
  projectId,
  metadata,
  ssr: true,
  storage: createStorage({
    storage: cookieStorage,
  }),
});
