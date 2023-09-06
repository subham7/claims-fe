import React from "react";
import { useRouter } from "next/router";
import Layout from "@components/layouts/layout";
import ClaimInsight from "@components/claims/claimInsight";
import ListClaims from "@components/claims/listClaims";
import CreateClaim from "@components/claims/create";

const ClaimsPage = () => {
  const router = useRouter();

  const [claimAddress, networkId] = router?.query?.slug ?? [];

  return (
    <Layout
      showSidebar={false}
      claimAddress={claimAddress}
      isClaims={true}
      network={networkId}>
      {claimAddress === undefined ? (
        <ListClaims />
      ) : claimAddress === "create" ? (
        <CreateClaim />
      ) : (
        <ClaimInsight claimAddress={claimAddress} />
      )}
    </Layout>
  );
};

export default ClaimsPage;
