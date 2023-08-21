import React from "react";
import { useRouter } from "next/router";
import Layout1 from "@components/layouts/layout1";
import Claim from "@components/claims/claim";

const Dashboard = () => {
  const router = useRouter();

  const [claimAddress, network] = router?.query?.slug ?? [];

  return (
    <Layout1
      showSidebar={false}
      claimAddress={claimAddress}
      isClaims={true}
      network={network}>
      <Claim claimAddress={claimAddress} />
    </Layout1>
  );
};

export default Dashboard;
