import React, { useState } from "react";
import ComponentHeader from "@components/common/ComponentHeader";
import classes from "@components/(proposal)/Proposal.module.scss";
import { Typography } from "@mui/material";
import ProposalSigners from "./ProposalSigners";
import SelectActionDialog from "@components/proposalComps/SelectActionDialog";
import BackdropLoader from "@components/common/BackdropLoader";
import ProposalList from "./ProposalList";
import Link from "next/link";

const ProposalSection = ({ daoAddress, routeNetworkId }) => {
  const [showActionsModal, setShowActionsModal] = useState(false);

  const closeActionModalHandler = (event, reason) => {
    if (reason !== "backdropClick" && reason !== "escapeKeyDown") {
      setShowActionsModal(false);
    }
  };

  return (
    <div className={classes.proposalPageContainer}>
      <div className={classes.leftContainer}>
        <ComponentHeader
          title={"Actions"}
          subtext={""}
          showButton={true}
          buttonText="Create Action"
          onClickHandler={() => {
            setShowActionsModal(true);
          }}
        />

        <ProposalList daoAddress={daoAddress} routeNetworkId={routeNetworkId} />
      </div>

      <div className={classes.rightContainer}>
        <div className={classes.infoContainer}>
          <Typography variant="inherit" fontSize={16} fontWeight={600}>
            What&apos;s an action?
          </Typography>
          <Typography variant="inherit" fontSize={15} color={"#707070"}>
            Actions help you manage the day-to-day activities inside your
            station.{" "}
            <Link
              style={{
                color: "#2196f3",
                textDecoration: "underline",
              }}
              target="_blank"
              href={
                "https://stationxnetwork.gitbook.io/docs/managing-a-station/workflows-and-automations"
              }>
              Learn More
            </Link>
            <br />
            <br /> Please begin by executing the top most action in the queue.
          </Typography>
        </div>

        <ProposalSigners
          daoAddress={daoAddress}
          routeNetworkId={routeNetworkId}
        />
      </div>

      <SelectActionDialog
        open={showActionsModal}
        onClose={closeActionModalHandler}
        daoAddress={daoAddress}
        networkId={routeNetworkId}
      />
      <BackdropLoader isOpen={showActionsModal} />
    </div>
  );
};

export default ProposalSection;
