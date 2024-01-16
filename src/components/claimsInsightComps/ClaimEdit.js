import { useTheme } from "@mui/styles";
import React, { useState } from "react";
import { IoIosArrowForward } from "react-icons/io";
import AddMoreTokenModal from "../claimsModals/AddMoreTokenModal";
import ModifyStartEndModal from "../claimsModals/ModifyStartEndModal";
import RollbackTokenModal from "../claimsModals/RollbackTokenModal";
import { ClaimsInsightStyles } from "./claimsInsightStyles";

const ClaimEdit = ({
  airdropTokenDetails,
  addMoreTokensHandler,
  rollbackTokensHandler,
  modifyStartAndEndTimeHandler,
  endTime,
  startTime,
  hasAllowanceMechanism,
}) => {
  const theme = useTheme();
  const classes = ClaimsInsightStyles(theme);

  const [showAddMoreTokensModal, setShowAddMoreTokensModal] = useState(false);
  const [showRollbackTokensModal, setShowRollbackTokensModal] = useState(false);
  const [showModifyTimeModal, setShowModifyTimeModal] = useState(false);

  const closeAddTokenModal = () => {
    setShowAddMoreTokensModal(false);
  };

  const closeRollbackTokensModal = () => {
    setShowRollbackTokensModal(false);
  };

  const closeModifyTimeModal = () => {
    setShowModifyTimeModal(false);
  };

  return (
    <div className={classes.claimEditContainer}>
      {!hasAllowanceMechanism ? (
        <>
          <div
            onClick={() => {
              setShowAddMoreTokensModal(true);
            }}
            style={{ cursor: "pointer" }}
            className={classes.flexContainer}>
            <p>Add more tokens</p>
            <IoIosArrowForward />
          </div>
          <div
            onClick={() => {
              setShowRollbackTokensModal(true);
            }}
            style={{ cursor: "pointer" }}
            className={classes.flexContainer}>
            <p>Rollback unclaimed tokens</p>
            <IoIosArrowForward />
          </div>
        </>
      ) : null}

      <div
        onClick={() => {
          setShowModifyTimeModal(true);
        }}
        style={{ cursor: "pointer" }}
        className={classes.flexContainer}>
        <p>Modify end/start of claims</p>
        <IoIosArrowForward />
      </div>

      {showAddMoreTokensModal && (
        <AddMoreTokenModal
          airdropTokenDetails={airdropTokenDetails}
          addMoreTokensHandler={addMoreTokensHandler}
          onClose={closeAddTokenModal}
        />
      )}

      {showRollbackTokensModal && (
        <RollbackTokenModal
          rollbackTokensHandler={rollbackTokensHandler}
          onClose={closeRollbackTokensModal}
        />
      )}

      {showModifyTimeModal && (
        <ModifyStartEndModal
          startTime={startTime}
          endTime={endTime}
          modifyStartAndEndTimeHandler={modifyStartAndEndTimeHandler}
          onClose={closeModifyTimeModal}
        />
      )}
    </div>
  );
};

export default ClaimEdit;
