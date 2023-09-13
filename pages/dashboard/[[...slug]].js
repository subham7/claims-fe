import React from "react";
import DashboardIndex from "../../src/components/dashboardComps/DashboardIndex";
import { useRouter } from "next/router";
import Layout from "@components/layouts/layout";

const DashboardPage = () => {
  const router = useRouter();

  const [daoAddress] = router?.query?.slug ?? [];

  if (!daoAddress) {
    return null;
  }

  return (
    <Layout daoAddress={daoAddress} page={1}>
      <DashboardIndex daoAddress={daoAddress} />
    </Layout>
  );
};

export default DashboardPage;