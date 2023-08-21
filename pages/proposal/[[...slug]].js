import React from "react";
import { useRouter } from "next/router";
import Layout1 from "@components/layouts/layout1";
import Proposal from "@components/proposal/Proposal";
import ProposalDetail from "@components/proposal/ProposalDetail";

const ProposalPage = () => {
  const router = useRouter();

  const [daoAddress, proposalId] = router?.query?.slug ?? [];

  if (!daoAddress) {
    return null;
  }

  return (
    <Layout1 daoAddress={daoAddress} page={2}>
      {proposalId ? (
        <ProposalDetail pid={proposalId} daoAddress={daoAddress} />
      ) : (
        <Proposal daoAddress={daoAddress} />
      )}
    </Layout1>
  );
};

export default ProposalPage;
