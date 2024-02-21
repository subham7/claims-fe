import { createPublicClient, createWalletClient, custom, http } from "viem";
import {
  polygon,
  base,
  arbitrum,
  bsc,
  mainnet,
  gnosis,
  taikoJolnir,
  goerli,
} from "viem/chains";
import {
  CHAIN_CONFIG,
  beraMainnetWalletConnect,
  lineaMainnetWalletConnect,
  mantaMainnet,
  mantleMainnetViem,
  scrollMainnet,
  blastMainnetWalletConnect,
} from "utils/constants";

const viemChains = {
  "0x89": polygon,
  "0x5": goerli,
  "0xe708": lineaMainnetWalletConnect,
  "0x2105": base,
  "0xa4b1": arbitrum,
  "0x38": bsc,
  "0x1388": mantleMainnetViem,
  "0x1": mainnet,
  "0x64": gnosis,
  "0x82750": scrollMainnet,
  "0xa9": mantaMainnet,
  "0x28c5f": taikoJolnir,
  "0x138d5": beraMainnetWalletConnect,
  "0x5": goerli,
  "0xa0c71fd": blastMainnetWalletConnect,
};

export const getPublicClient = (networkId) => {
  if (CHAIN_CONFIG[networkId]?.appRpcUrl || window?.ethereum) {
    const client = createPublicClient({
      chain: viemChains[networkId],
      transport: http(CHAIN_CONFIG[networkId]?.appRpcUrl || window?.ethereum),
    });

    return client;
  } else {
    return {};
  }
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
