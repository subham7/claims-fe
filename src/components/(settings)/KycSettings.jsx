import React, { useState } from "react";
import classes from "@components/(settings)/Settings.module.scss";
import KycModal from "@components/modals/KycModal/KycModal";
import { useSelector } from "react-redux";

const KycSettings = ({ daoAddress, setLoading, setIsKycEnabledSettings }) => {
  const [showKycModal, setShowKycModal] = useState(false);

  const isAdmin = useSelector((state) => {
    return state.gnosis.adminUser;
  });

  return (
    <>
      {isAdmin ? (
        <button
          onClick={() => {
            setShowKycModal(true);
          }}
          className={classes.allowlistButton}>
          Manage
        </button>
      ) : null}

      {showKycModal ? (
        <KycModal
          setIsKycEnabledSettings={setIsKycEnabledSettings}
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
