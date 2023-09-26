import React from "react";
import { useRouter } from "next/router";
import Layout from "@components/layouts/layout";
import Proposal from "@components/proposal/Proposal";
import ProposalDetail from "@components/proposal/ProposalDetail";

const ProposalPage = () => {
  const router = useRouter();

  let [daoAddress, networkId, proposalId] = router?.query?.slug ?? [];

  if (router?.query?.slug.length < 3) {
    proposalId = networkId;
    networkId = "0x89";
  }

  if (!daoAddress) {
    return null;
  }

  return (
    <Layout daoAddress={daoAddress} networkId={networkId} page={2}>
      {proposalId ? (
        <ProposalDetail pid={proposalId} daoAddress={daoAddress} />
      ) : (
        <Proposal daoAddress={daoAddress} />
      )}
    </Layout>
  );
};

export default ProposalPage;
