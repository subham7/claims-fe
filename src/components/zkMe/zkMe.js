import "@zkmelabs/widget/dist/style.css";
import { ZkMeWidget } from "@zkmelabs/widget";
import { useAccount, useWalletClient } from "wagmi";
import { getKYCToken } from "api/club";

const ZkMe = ({ daoAddress }) => {
  const { address } = useAccount();
  const walletClient = useWalletClient();

  const provider = {
    async getAccessToken() {
      const token = await getKYCToken(daoAddress);
      return token;
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
