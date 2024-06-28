import Layout from "@components/layouts/layout";
import React from "react";

import { useRouter } from "next/router";
import ProposalSection from "@components/(proposal)/ProposalSection";
import CreateProposalDialog from "@components/proposalComps/CreateProposalDialog";

const ProposalPageNew = () => {
  const router = useRouter();
  const [daoAddress, networkId, proposalId] = router?.query?.slug ?? [];

  if (!daoAddress) {
    return null;
  }

  if (proposalId === "new") {
    return (
      <Layout daoAddress={daoAddress} networkId={networkId}>
        <CreateProposalDialog daoAddress={daoAddress} />
      </Layout>
    );
  }

  return (
    <Layout daoAddress={daoAddress} networkId={networkId}>
      <ProposalSection daoAddress={daoAddress} routeNetworkId={networkId} />
    </Layout>
  );
};

export default ProposalPageNew;
