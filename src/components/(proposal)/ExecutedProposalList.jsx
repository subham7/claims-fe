import React from "react";
import ProposalItem from "./ProposalItem";

const ExecutedProposalList = ({
  executedProposals,
  daoAddress,
  routeNetworkId,
  onProposalUpdate,
}) => {
  return (
    <div>
      {executedProposals?.length ? (
        executedProposals?.map((proposal, index) => (
          <div key={proposal.proposalId}>
            <ProposalItem
              number={index + 1}
              proposal={proposal}
              executionId={proposal?.commands[0]?.executionId}
              type={"executed"}
              daoAddress={daoAddress}
              routeNetworkId={routeNetworkId}
              onProposalUpdate={onProposalUpdate}
            />
          </div>
        ))
      ) : (
        <p style={{ textAlign: "center" }}>No history found</p>
      )}
    </div>
  );
};

export default ExecutedProposalList;
