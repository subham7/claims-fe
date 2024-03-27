import "@zkmelabs/widget/dist/style.css";
import { ZkMeWidget } from "@zkmelabs/widget";
import { useAccount, useWalletClient } from "wagmi";

const ZkMe = () => {
  const { address } = useAccount();
  const walletClient = useWalletClient();

  const provider = {
    async getAccessToken() {
      const response = await fetch("https://nest-api.zk.me/api/token/get", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          apiKey: "bee8ca94.ddb4b6a2acbae35e10c7c9564cab5b4b",
          appId: "M2024031204490984947737391718575",
          apiModePermission: 0,
          lv: 1,
        }),
      });

      const result = await response.json();

      return result.data.accessToken;
    },

    async getUserAccounts() {
      return [address];
    },

    async delegateTransaction(tx) {
      const txResponse = await walletClient.data.writeContract(tx);
      return txResponse.hash;
    },
  };

  const zkMeWidget = new ZkMeWidget(
    "M2024031204490984947737391718575",
    "StationX",
    "0x89",
    provider,
  );

  return zkMeWidget.launch();
};

export default ZkMe;
