import React, { useState } from "react";
import ComponentHeader from "@components/common/ComponentHeader";
import classes from "@components/(proposal)/Proposal.module.scss";
import { Typography } from "@mui/material";
import ProposalSigners from "./ProposalSigners";
import SelectActionDialog from "@components/proposalComps/SelectActionDialog";
import BackdropLoader from "@components/common/BackdropLoader";
import ProposalList from "./ProposalList";

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
            Each action helps you get done with day-to-day stuff inside your
            station. Please begin by executing the top most action in the queue.
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
