import React from "react";
import ProposalItem from "./ProposalItem";

const PassedProposalList = ({
  passedProposals,
  daoAddress,
  routeNetworkId,
}) => {
  return (
    <div>
      {passedProposals?.map((proposal, index) => (
        <div key={index}>
          <ProposalItem
            proposal={proposal}
            executionId={proposal?.commands[0]?.executionId}
            type={"sign"}
            daoAddress={daoAddress}
            routeNetworkId={routeNetworkId}
          />
        </div>
      ))}
    </div>
  );
};

export default PassedProposalList;
