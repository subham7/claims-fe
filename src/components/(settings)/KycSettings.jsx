import React, { useState } from "react";
import classes from "@components/(settings)/Settings.module.scss";
import KycModal from "@components/modals/KycModal/KycModal";

const KycSettings = ({ daoAddress, setLoading }) => {
  const [showKycModal, setShowKycModal] = useState(false);
  return (
    <>
      <button
        onClick={() => {
          setShowKycModal(true);
        }}
        className={classes.allowlistButton}>
        Manage
      </button>

      {showKycModal ? (
        <KycModal
          daoAddress={daoAddress}
          setLoading={setLoading}
          onClose={() => {
            setShowKycModal(false);
          }}
        />
      ) : null}
    </>
  );
};

export default KycSettings;
