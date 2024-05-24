export const lineaHelperStepsData = ({
  setShowInviteMembersModal,
  setShowCustomiseContributionModal,
  setShowAdminFeeModal,
  setShowTreasuryModal,
  setShowTokenGateModal,
  setShowWhitelistModal,
  setShowDistributeModal,
  setShowSendModal,
  setShowDeadlineModal,
  setShowKYCModal,
  setShowEditSignerModal,
  setShowCreateSurveyModal,
  setShowMintGTModal,
  setShowDepositParamsModal,
  setShowStakeDefiModal,
  onClose,
}) => {
  return [
    {
      title: "Invite members/contributors in my Station",
      onClick: () => {
        setShowInviteMembersModal(true);
        onClose();
      },
      onclose: () => {
        setShowInviteMembersModal(false);
      },
    },
    {
      title: "Customise Station’s contribution page",
      onClick: () => {
        setShowCustomiseContributionModal(true);
        onClose();
      },
      onclose: () => {
        setShowCustomiseContributionModal(false);
      },
    },
    {
      title: "Implement upfront fees on deposits",
      onClick: () => {
        setShowAdminFeeModal(true);
        onClose();
      },
      onclose: () => {
        setShowAdminFeeModal(false);
      },
    },
    {
      title: "Where are funds held - Station’s treasury address.",
      onClick: () => {
        setShowTreasuryModal(true);
        onClose();
      },
      onclose: () => {
        setShowTreasuryModal(false);
      },
    },
    {
      title: "Add/remove admins",
      onClick: () => {
        setShowEditSignerModal(true);
        onClose();
      },
      onclose: () => {
        setShowEditSignerModal(false);
      },
    },
    {
      title: "Manage KYC of members",
      onClick: () => {
        setShowKYCModal(true);
        onClose();
      },
      onclose: () => {
        setShowKYCModal(false);
      },
    },
    {
      title: "Increase or decrease contribution deadline",
      onClick: () => {
        setShowDeadlineModal(true);
        onClose();
      },
      onclose: () => {
        setShowDeadlineModal(false);
      },
    },
    {
      title: "Change deposit parameters",
      onClick: () => {
        setShowDepositParamsModal(true);
        onClose();
      },
      onclose: () => {},
    },
    {
      title: "How to Stake/unstake in a DeFi Protocol?",
      onClick: () => {
        setShowStakeDefiModal(true);
        onClose();
      },
      onclose: () => {
        setShowStakeDefiModal(false);
      },
    },
    {
      title: "Create a poll inside the Station",
      onClick: () => {
        setShowCreateSurveyModal(true);
        onClose();
      },
      onclose: () => {
        setShowCreateSurveyModal(false);
      },
    },
    {
      title: "Mint station’s LP tokens to an address",
      onClick: () => {
        setShowMintGTModal(true);
        onClose();
      },
      onclose: () => {
        setShowMintGTModal(false);
      },
    },
    {
      title: "How do I send funds from the station?",
      onClick: () => {
        setShowSendModal(true);
        onClose();
      },
      onclose: () => {
        setShowSendModal(false);
      },
    },
    {
      title: "How do I distribute tokens to members?",
      onClick: () => {
        setShowDistributeModal(true);
        onClose();
      },
      onclose: () => {
        setShowDistributeModal(false);
      },
    },
    {
      title: "Whitelist who can deposit",
      onClick: () => {
        setShowWhitelistModal(true);
        onClose();
      },
      onclose: () => {
        setShowWhitelistModal(false);
      },
    },
    {
      title: "Tokengate deposits of the station",
      onClick: () => {
        setShowTokenGateModal(true);
        onClose();
      },
      onclose: () => {
        setShowTokenGateModal(false);
      },
    },
  ];
};
