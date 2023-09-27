import { createPublicClient, createWalletClient, custom, http } from "viem";
import { polygon, base, arbitrum, bsc } from "viem/chains";
import {
  CHAIN_CONFIG,
  lineaMainnetWalletConnect,
  mantleMainnetViem,
} from "utils/constants";

const viemChains = {
  "0x89": polygon,
  "0xe708": lineaMainnetWalletConnect,
  "0x2105": base,
  "0xa4b1": arbitrum,
  "0x38": bsc,
  "0x1388": mantleMainnetViem,
};

export const getPublicClient = (networkId) => {
  const client = createPublicClient({
    chain: viemChains[networkId],
    transport: http(CHAIN_CONFIG[networkId]?.appRpcUrl),
  });

  return client;
};

export const getWalletClient = (networkId) => {
  let walletClient;
  if (typeof window !== "undefined") {
    walletClient = createWalletClient({
      chain: viemChains[networkId],
      transport: custom(window.ethereum),
    });
  }

  return walletClient;
};
