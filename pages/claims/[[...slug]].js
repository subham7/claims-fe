import React from "react";
import { useRouter } from "next/router";
import Layout1 from "@components/layouts/layout1";
import CreateClaim from "redux/reducers/createClaim";
import ClaimInsight from "@components/claims/claimInsight";
import ListClaims from "@components/claims/listClaims";

const Claims = () => {
  const router = useRouter();

  const [insights, claimAddress] = router?.query?.slug ?? [];

  return (
    <Layout1 showSidebar={false} claimAddress={claimAddress} isClaims={true}>
      {claimAddress === undefined ? (
        <ListClaims />
      ) : claimAddress === "create" ? (
        <CreateClaim />
      ) : (
        <ClaimInsight claimAddress={claimAddress} />
      )}
    </Layout1>
  );
};

export default Claims;
