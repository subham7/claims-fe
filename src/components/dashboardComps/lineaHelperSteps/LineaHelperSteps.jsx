import React from "react";
import classes from "./LineaHelperSteps.module.scss";
import Backdrop from "@components/common/Backdrop/Backdrop";
import { lineaHelperStepsData } from "data/lineaHelperStepsData";
import useLockBodyScroll from "hooks/useLockBodyScroll";

const LineaHelperSteps = ({
  onClose,
  setShowInviteMembersModal,
  setShowCustomiseContributionModal,
  setShowAdminFeeModal,
  setShowTreasuryModal,
  setShowTokenGateModal,
  setShowWhitelistModal,
  setShowSendModal,
  setShowDistributeModal,
  setShowDeadlineModal,
  setShowKYCModal,
  setShowEditSignerModal,
  setShowCreateSurveyModal,
  setShowMintGTModal,
  setShowDepositParamsModal,
  setShowStakeDefiModal,
}) => {
  useLockBodyScroll(true);

  return (
    <>
      <Backdrop />
      <div className={classes.container}>
        <p className={classes.heading}>How to manage station?</p>

        <div className={classes.list}>
          {lineaHelperStepsData({
            onClose,
            setShowInviteMembersModal,
            setShowCustomiseContributionModal,
            setShowAdminFeeModal,
            setShowTreasuryModal,
            setShowTokenGateModal,
            setShowWhitelistModal,
            setShowDistributeModal,
            setShowDeadlineModal,
            setShowKYCModal,
            setShowSendModal,
            setShowEditSignerModal,
            setShowCreateSurveyModal,
            setShowMintGTModal,
            setShowDepositParamsModal,
            setShowStakeDefiModal,
          }).map((item) => (
            <div key={item.title}>
              <p onClick={item.onClick} className={classes.featureItem}>
                {item.title}
              </p>
            </div>
          ))}
        </div>
      </div>
    </>
  );
};

export default LineaHelperSteps;
