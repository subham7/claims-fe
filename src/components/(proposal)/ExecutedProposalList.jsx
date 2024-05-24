import React from "react";
import ProposalItem from "./ProposalItem";

const ExecutedProposalList = ({ executedProposals }) => {
  console.log("xxx", executedProposals);
  return (
    <div>
      {/* <ProposalItem type={"executed"} />
      <ProposalItem type={"executed"} note={"Hello"} /> */}

      {executedProposals?.map((proposal, index) => (
        <>
          <p>{index}</p>
          <ProposalItem
            proposal={proposal}
            executionId={proposal?.commands[0]?.executionId}
            key={proposal.proposalId}
            type={"executed"}
          />
        </>
      ))}
    </div>
  );
};

export default ExecutedProposalList;
