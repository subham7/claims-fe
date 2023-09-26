import React from "react";
import { useRouter } from "next/router";
import Layout from "@components/layouts/layout";
import ClaimInsight from "@components/claims/claimInsight";
import ListClaims from "@components/claims/listClaims";
import CreateClaim from "@components/claims/create";

const ClaimsPage = () => {
  const router = useRouter();

  const routeParams = router?.query?.slug ?? [];

  let [networkId, claimAddress] = routeParams;

  if (routeParams.length < 2) {
    claimAddress = networkId;
    networkId = "0x89";
  }

  return (
    <Layout
      showSidebar={false}
      claimAddress={claimAddress}
      networkId={networkId}>
      {claimAddress === undefined && networkId !== "create" ? (
        <ListClaims />
      ) : networkId === "create" ? (
        <CreateClaim />
      ) : (
        <ClaimInsight claimAddress={claimAddress} />
      )}
    </Layout>
  );
};

export default ClaimsPage;
