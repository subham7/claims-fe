import React, { useEffect, useState } from "react";
import classes from "@components/(proposal)/Proposal.module.scss";

import ProposalTabs from "./ProposalTabs";
import { Typography } from "@mui/material";
import ProposalItem from "./ProposalItem";
import { getProposalByDaoAddress } from "api/proposal";
import ExecutedProposalList from "./ExecutedProposalList";
import PassedProposalList from "./PassedProposalList";

const ProposalList = ({ daoAddress, routeNetworkId }) => {
  const [tabType, setTabType] = useState("Queue");
  const [executedProposals, setExecutedProposals] = useState([]);
  const [passedProposals, setPassedProposals] = useState([]);

  const tabChangeHandler = (event, newValue) => {
    setTabType(newValue);
  };

  const fetchProposals = async () => {
    const data = await getProposalByDaoAddress(daoAddress);

    const executedProposals = data.data?.filter(
      (proposal) => proposal.status === "executed",
    );

    const passedProposals = data.data?.filter(
      (proposal) => proposal.status === "passed",
    );

    setExecutedProposals(executedProposals);
    setPassedProposals(passedProposals);
  };

  useEffect(() => {
    if (daoAddress) fetchProposals();
  }, [daoAddress]);

  return (
    <div>
      <ProposalTabs onChange={tabChangeHandler} tabType={tabType} />

      {tabType === "Queue" ? (
        <div>
          <div className={classes.nextProposalContainer}>
            <Typography
              fontFamily={"inherit"}
              fontSize={12}
              sx={{
                textTransform: "uppercase",
              }}
              color={"#707070"}>
              Next
            </Typography>
            <ProposalItem type={"sign"} note={"Hello there"} />
          </div>

          <Typography
            paddingTop={4}
            fontFamily={"inherit"}
            fontSize={12}
            sx={{
              textTransform: "uppercase",
            }}
            color={"#707070"}>
            Execute later
          </Typography>
          <PassedProposalList
            daoAddress={daoAddress}
            routeNetworkId={routeNetworkId}
            passedProposals={passedProposals}
          />
        </div>
      ) : (
        <ExecutedProposalList
          daoAddress={daoAddress}
          routeNetworkId={routeNetworkId}
          executedProposals={executedProposals}
        />
      )}
    </div>
  );
};

export default ProposalList;
