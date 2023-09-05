import React from "react";
import { useRouter } from "next/router";
import Layout from "@components/layouts/layout";
import Claim from "@components/claims/claim";

const ClaimPage = () => {
  const router = useRouter();

  const [claimAddress, networkId] = router?.query?.slug ?? [];

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
