import React from "react";
import { useRouter } from "next/router";
import Layout from "@components/layouts/layout";
import Claim from "@components/claims/Claim";

const ClaimPage = () => {
  const router = useRouter();

  const [claimAddress, networkId = "0x89"] = router?.query?.slug ?? [];

  console.log("xxx", networkId);

  return (
    <Layout
      showSidebar={false}
      claimAddress={claimAddress}
      isClaims={true}
      networkId={networkId}>
      <Claim claimAddress={claimAddress} />
    </Layout>
  );
};

export default ClaimPage;
