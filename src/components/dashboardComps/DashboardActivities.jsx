import classes from "./Dashboard.module.scss";
import CopyLinkContainer from "./CopyLinkContainer";
import PendingTranscation from "./PendingTranscation";
import { getLatesExecutableProposal } from "api/proposal";
import { useEffect, useState } from "react";

const DashboardActivities = ({ proposals, daoAddress, networkId }) => {
  const [proposal, setProposal] = useState();

  const loadExecutableLatestProposal = async () => {
    const data = await getLatesExecutableProposal(daoAddress);
    setProposal(data?.data[0]);
  };

  const refreshProposals = async () => {
    await loadExecutableLatestProposal();
  };

  useEffect(() => {
    if (daoAddress) loadExecutableLatestProposal();
  }, [daoAddress]);

  return (
    <div className={classes.rightContainer}>
      <CopyLinkContainer daoAddress={daoAddress} routeNetworkId={networkId} />
      <PendingTranscation
        routeNetworkId={networkId}
        daoAddress={daoAddress}
        proposal={proposal}
        executionId={proposal?.commands[0]?.executionId}
        onProposalUpdate={refreshProposals}
      />
    </div>
  );
};

export default DashboardActivities;
