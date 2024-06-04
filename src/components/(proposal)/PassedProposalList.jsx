import React from "react";
import ProposalItem from "./ProposalItem";

const PassedProposalList = ({
  passedProposals,
  daoAddress,
  routeNetworkId,
}) => {
  return (
    <div>
      {passedProposals?.length ? (
        passedProposals?.map((proposal, index) => (
          <div key={index}>
            <ProposalItem
              proposal={proposal}
              executionId={proposal?.commands[0]?.executionId}
              type={"sign"}
              daoAddress={daoAddress}
              routeNetworkId={routeNetworkId}
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
