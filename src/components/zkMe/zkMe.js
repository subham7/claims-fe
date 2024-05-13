import "@zkmelabs/widget/dist/style.css";
import { ZkMeWidget } from "@zkmelabs/widget";
import { useAccount, useWalletClient } from "wagmi";
import { getKYCToken } from "api/club";

const ZkMe = ({ daoAddress, routeNetworkId, zkMeAppId }) => {
  const { address } = useAccount();
  const walletClient = useWalletClient();

  const provider = {
    async getAccessToken() {
      const token = await getKYCToken(daoAddress);
      return token?.accessToken;
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
    zkMeAppId,
    "StationX",
    routeNetworkId,
    provider,
  );

  return zkMeWidget.launch();
};

export default ZkMe;
