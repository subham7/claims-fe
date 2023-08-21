import React from "react";
import { useRouter } from "next/router";
import Layout1 from "@components/layouts/layout1";
import Join from "@components/join/Join";

const Dashboard = () => {
  const router = useRouter();

  const [daoAddress] = router?.query?.slug ?? [];

  if (!daoAddress) {
    return null;
  }

  return (
    <Layout1 showSidebar={false} daoAddress={daoAddress} page={4}>
      <Join />
    </Layout1>
  );
};

export default Dashboard;
