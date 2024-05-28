import React from "react";
import ProposalItem from "./ProposalItem";

const ExecutedProposalList = ({
  executedProposals,
  // daoAddress,
  // routeNetworkId,
}) => {
  return (
    <div>
      {executedProposals?.map((proposal, index) => (
        <div key={proposal.proposalId}>
          <ProposalItem
            proposal={proposal}
            executionId={proposal?.commands[0]?.executionId}
            type={"executed"}
            // daoAddress={daoAddress}
            // routeNetworkId={routeNetworkId}
          />
        </div>
      ))}
    </div>
  );
};

export default ExecutedProposalList;
