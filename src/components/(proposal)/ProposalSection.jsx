import React, { useState } from "react";
import ComponentHeader from "@components/common/ComponentHeader";
import classes from "@components/(proposal)/Proposal.module.scss";
import { Typography } from "@mui/material";
import ProposalSigners from "./ProposalSigners";
import ProposalList from "./ProposalList";
import Link from "next/link";
import ProposalActionModal from "@components/modals/ProposalActionModal/ProposalActionModal";
import { useSelector } from "react-redux";
import ActionModal from "@components/dashboardComps/dashboardActions/ActionModal";
import StatusModal from "@components/modals/StatusModal/StatusModal";
import MintModal from "@components/modals/ProposalActionModal/MintModal";

const ProposalSection = ({ daoAddress, routeNetworkId }) => {
  const [showActionsModal, setShowActionsModal] = useState(false);
  const [showSendAssetsModal, setShowSendAssetsModal] = useState(false);
  const [showDistributeModal, setShowDistributeModal] = useState(false);
  const [showMintModal, setShowMintModal] = useState(false);
  const [isActionCreated, setIsActionCreated] = useState(null);
  const gnosisAddress = useSelector((state) => {
    return state.club.clubData.gnosisAddress;
  });

  const handleActionComplete = (result, proposalId = "") => {
    setShowSendAssetsModal(false);
    setShowDistributeModal(false);
    setIsActionCreated(result);
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

      {showActionsModal && (
        <ProposalActionModal
          setShowActionModal={setShowActionsModal}
          setShowSendAssetsModal={setShowSendAssetsModal}
          setShowDistributeModal={setShowDistributeModal}
          setShowMintModal={setShowMintModal}
        />
      )}

      {showSendAssetsModal && (
        <ActionModal
          daoAddress={daoAddress}
          gnosisAddress={gnosisAddress}
          networkId={routeNetworkId}
          onClose={() => setShowSendAssetsModal(false)}
          type={"send"}
          onActionComplete={handleActionComplete}
        />
      )}

      {showDistributeModal && (
        <ActionModal
          daoAddress={daoAddress}
          gnosisAddress={gnosisAddress}
          networkId={routeNetworkId}
          onClose={() => setShowDistributeModal(false)}
          onActionComplete={handleActionComplete}
          type={"distribute"}
        />
      )}

      {showMintModal && (
        <MintModal
          daoAddress={daoAddress}
          gnosisAddress={gnosisAddress}
          networkId={routeNetworkId}
          onClose={() => setShowMintModal(false)}
          onActionComplete={handleActionComplete}
        />
      )}

      {isActionCreated === "success" ? (
        <StatusModal
          heading={"Hurray! We made it"}
          subheading="Transaction created successfully!"
          isError={false}
          onClose={() => setIsActionCreated(null)}
          buttonText="View & Sign Transaction"
          onButtonClick={() => {
            router.push(`/newProposals/${daoAddress}/${routeNetworkId}`);
          }}
        />
      ) : isActionCreated === "failure" ? (
        <StatusModal
          heading={"Something went wrong"}
          subheading="Looks like we hit a bump here, try again?"
          isError={true}
          onClose={() => {
            setIsActionCreated(null);
          }}
          buttonText="Try Again?"
          onButtonClick={() => {
            setIsActionCreated(null);
          }}
        />
      ) : null}
    </div>
  );
};

export default ProposalSection;
