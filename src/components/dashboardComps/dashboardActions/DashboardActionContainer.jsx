import React, { useState } from "react";
import classes from "../Dashboard.module.scss";
import { FaArrowDownShortWide, FaArrowUp } from "react-icons/fa6";
import ActionModal from "./ActionModal";
import StatusModal from "@components/modals/StatusModal/StatusModal";
import { useRouter } from "next/router";

const DashboardActionContainer = ({ daoAddress, networkId, gnosisAddress }) => {
  const [showSendAssetsModal, setShowSendAssetsModal] = useState(false);
  const [showDistributeModal, setShowDistributeModal] = useState(false);
  const [proposalId, setProposalId] = useState("");
  const [isActionCreated, setIsActionCreated] = useState(null);

  const router = useRouter();

  const sendModalHandler = () => {
    setShowSendAssetsModal(true);
  };
  const distributeModalHandler = () => {
    setShowDistributeModal(true);
  };

  const handleActionComplete = (result, proposalId = "") => {
    setShowSendAssetsModal(false);
    setShowDistributeModal(false);
    setIsActionCreated(result);
    setProposalId(proposalId);
  };

  return (
    <>
      <div className={classes.actionsContainer}>
        <button onClick={sendModalHandler} className={classes.actionButton}>
          <FaArrowUp />
          <p>Send</p>
        </button>
        <button
          onClick={distributeModalHandler}
          className={classes.actionButton}>
          <FaArrowDownShortWide />
          <p>Distribute</p>
        </button>
      </div>

      {showSendAssetsModal && (
        <ActionModal
          daoAddress={daoAddress}
          gnosisAddress={gnosisAddress}
          networkId={networkId}
          onClose={() => setShowSendAssetsModal(false)}
          type={"send"}
          onActionComplete={handleActionComplete}
        />
      )}
      {showDistributeModal && (
        <ActionModal
          daoAddress={daoAddress}
          gnosisAddress={gnosisAddress}
          networkId={networkId}
          onClose={() => setShowDistributeModal(false)}
          onActionComplete={handleActionComplete}
          type={"distribute"}
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
            router.push(`/proposals/${daoAddress}/${networkId}/${proposalId}`);
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
    </>
  );
};

export default DashboardActionContainer;
