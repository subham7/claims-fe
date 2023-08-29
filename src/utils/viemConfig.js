import { createPublicClient, createWalletClient, custom, http } from "viem";
import { polygon } from "viem/chains";

export const publicClient = createPublicClient({
  chain: polygon,
  transport: http(),
});

export let walletClient;
if (typeof window !== "undefined") {
  walletClient = createWalletClient({
    chain: polygon,
    transport: custom(window.ethereum),
  });
}
