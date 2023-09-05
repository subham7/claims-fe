import React from "react";
import { useRouter } from "next/router";
import Layout from "@components/layouts/layout";
import Settings from "@components/settings/setttings";

const SettingsPage = () => {
  const router = useRouter();

  const [daoAddress, networkId] = router?.query?.slug ?? [];

  if (!daoAddress) {
    return null;
  }

  return (
    <Layout daoAddress={daoAddress} networkId={networkId} page={5}>
      <Settings daoAddress={daoAddress} />
    </Layout>
  );
};

export default SettingsPage;
