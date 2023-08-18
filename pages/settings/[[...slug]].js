import React from "react";
import { useRouter } from "next/router";
import Layout1 from "@components/layouts/layout1";
import Settings from "@components/settings/setttings";

const SettingsPage = () => {
  const router = useRouter();

  const [daoAddress] = router?.query?.slug ?? [];

  if (!daoAddress) {
    return null;
  }

  return (
    <Layout1 daoAddress={daoAddress} page={5}>
      <Settings />
    </Layout1>
  );
};

export default SettingsPage;
