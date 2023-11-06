import React from "react";
import { useRouter } from "next/router";
import Layout from "@components/layouts/layout";
import Dashboard from "@components/dashboardComps/Dashboard";

const DashboardPage = () => {
  const router = useRouter();

  const [daoAddress, networkId = "0x89"] = router?.query?.slug ?? [];

  if (!daoAddress) {
    return null;
  }

  return (
    <Layout daoAddress={daoAddress} networkId={networkId} page={1}>
      <Dashboard daoAddress={daoAddress} />
    </Layout>
  );
};

export default DashboardPage;
