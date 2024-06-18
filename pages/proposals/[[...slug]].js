import React from "react";
import { useRouter } from "next/router";
import Layout from "@components/layouts/layout";
import Proposal from "@components/proposal/Proposal";
import ProposalDetail from "@components/proposal/ProposalDetail";

const ProposalPage = () => {
  const router = useRouter();

  const [daoAddress, networkId, proposalId] = router?.query?.slug ?? [];

  if (!daoAddress) {
    return null;
  }

  // if (proposalId === "new") {
  //   return (
  //     <Layout daoAddress={daoAddress} networkId={networkId} page={2}>
  //       <CreateProposalDialog daoAddress={daoAddress} />
  //     </Layout>
  //   );
  // }

  return (
    <Layout daoAddress={daoAddress} networkId={networkId} page={2}>
      {proposalId ? (
        <ProposalDetail
          pid={proposalId}
          daoAddress={daoAddress}
          routeNetworkId={networkId}
        />
      ) : (
        <Proposal daoAddress={daoAddress} routeNetworkId={networkId} />
      )}
    </Layout>
  );
};

export default ProposalPage;
