import React from "react";
import { useRouter } from "next/router";
import Layout from "@components/layouts/layout";
import ClaimInsight from "@components/claims/claimInsight";
import ListClaims from "@components/claims/listClaims";
import CreateClaim from "@components/claims/create";
import CreateDisburse from "@components/claims/disburse";

const ClaimsPage = () => {
  const router = useRouter();

  const [claimAddress, networkId] = router?.query?.slug ?? [];

  return (
    <Layout
      showSidebar={false}
      claimAddress={claimAddress}
      networkId={networkId}>
      {!claimAddress && !networkId ? (
        <ListClaims />
      ) : claimAddress === "create" ? (
        <CreateClaim />
      ) : claimAddress === "disburse" ? (
        <CreateDisburse />
      ) : (
        <ClaimInsight routeNetworkId={networkId} claimAddress={claimAddress} />
      )}
    </Layout>
  );
};

export default ClaimsPage;
