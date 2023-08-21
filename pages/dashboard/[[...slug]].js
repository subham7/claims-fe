import React from "react";
import DashboardIndex from "../../src/components/dashboardComps/DashboardIndex";
import { useRouter } from "next/router";
import Layout1 from "@components/layouts/layout1";

const DashboardPage = () => {
  const router = useRouter();

  const [daoAddress] = router?.query?.slug ?? [];

  if (!daoAddress) {
    return null;
  }

  return (
    <Layout1 daoAddress={daoAddress} page={1}>
      <DashboardIndex />
    </Layout1>
  );
};

export default DashboardPage;
