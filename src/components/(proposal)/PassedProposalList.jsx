import React from "react";
import ProposalItem from "./ProposalItem";

const PassedProposalList = ({
  passedProposals,
  daoAddress,
  routeNetworkId,
  onProposalUpdate,
}) => {
  return (
    <div>
      {passedProposals?.length ? (
        passedProposals?.map((proposal, index) => (
          <div key={proposal?.proposalId}>
            <ProposalItem
              number={index + 1}
              proposal={proposal}
              executionId={proposal?.commands[0]?.executionId}
              type={"sign"}
              daoAddress={daoAddress}
              routeNetworkId={routeNetworkId}
              onProposalUpdate={onProposalUpdate}
            />
          </div>
        ))
      ) : (
        <p style={{ textAlign: "center" }}>No proposals found</p>
      )}
    </div>
  );
};

export default PassedProposalList;
