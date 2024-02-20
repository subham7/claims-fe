import React from "react";
import { useRouter } from "next/router";
import Layout from "@components/layouts/layout";
import Settings from "@components/settings/setttings";

const SettingsPage = () => {
  const router = useRouter();

  const [daoAddress, networkId = "0x89"] = router?.query?.slug ?? [];

  if (!daoAddress) {
    return null;
  }

  return (
    <Layout daoAddress={daoAddress} networkId={networkId} page={5}>
      <Settings daoAddress={daoAddress} routeNetworkId={networkId} />
    </Layout>
  );
};

export default SettingsPage;
