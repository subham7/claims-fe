import React, { useState } from "react";
import classes from "../Dashboard.module.scss";
import { FaArrowDownShortWide, FaArrowUp } from "react-icons/fa6";
import ActionModal from "./ActionModal";

const DashboardActionContainer = ({ daoAddress, networkId, gnosisAddress }) => {
  const [showSendAssetsModal, setShowSendAssetsModal] = useState(false);
  const [showDistributeModal, setShowDistributeModal] = useState(false);

  const sendModalHandler = () => {
    setShowSendAssetsModal(true);
  };
  const distributeModalHandler = () => {
    setShowDistributeModal(true);
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
        />
      )}
      {showDistributeModal && (
        <ActionModal
          daoAddress={daoAddress}
          gnosisAddress={gnosisAddress}
          networkId={networkId}
          onClose={() => setShowDistributeModal(false)}
          type={"distribute"}
        />
      )}
    </>
  );
};

export default DashboardActionContainer;
