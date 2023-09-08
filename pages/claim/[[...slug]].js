import React from "react";
import { useRouter } from "next/router";
import Layout from "@components/layouts/layout";
// import Claim from "@components/claims/claim";
import NewClaim from "@components/claims/NewClaim";

const ClaimPage = () => {
  const router = useRouter();

  const [claimAddress, network] = router?.query?.slug ?? [];

  return (
    <Layout
      showSidebar={false}
      claimAddress={claimAddress}
      isClaims={true}
      network={network}>
      {/* <Claim claimAddress={claimAddress} /> */}
      <NewClaim />
    </Layout>
  );
};

export default ClaimPage;
