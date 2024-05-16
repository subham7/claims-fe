export const lineaHelperStepsData = ({
  setShowInviteMembersModal,
  onClose,
}) => {
  return [
    {
      title: "How do I invite members into my station?",
      onClick: () => {
        setShowInviteMembersModal(true);
        onClose();
      },
      onclose: () => {
        setShowInviteMembersModal(false);
      },
    },
    {
      title: "How do I personalise my contribution page?",
      onClick: () => {},
      onclose: () => {},
    },
    {
      title: "How do I charge an admin fee from my depositors?",
      onClick: () => {},
      onclose: () => {},
    },
    {
      title:
        "What’s my treasury address? How do I send funds to my Station’s treasury directly?",
      onClick: () => {},
      onclose: () => {},
    },
    {
      title: "How do I add / modify signers in my Station?",
      onClick: () => {},
      onclose: () => {},
    },
    {
      title: "How do I enable / Disable KYC for my Station?",
      onClick: () => {},
      onclose: () => {},
    },
    {
      title: "How do I change the Deposit deadline?",
      onClick: () => {},
      onclose: () => {},
    },
    {
      title:
        "How do I modify raise settings (token price, min/max deposit amount & total fundraise)?",
      onClick: () => {},
      onclose: () => {},
    },
    {
      title: "How do I stake/unstake in a DeFi Protocol?",
      onClick: () => {},
      onclose: () => {},
    },
    {
      title: "How do I create a poll inside my Station?",
      onClick: () => {},
      onclose: () => {},
    },
    {
      title:
        "How do I mint additional share tokens to a member / new individual?",
      onClick: () => {},
      onclose: () => {},
    },
    {
      title: "How do I send funds from my treasury to an address?",
      onClick: () => {},
      onclose: () => {},
    },
    {
      title:
        "How do I send distribute tokens to my station members pro-rata their share in the pool?",
      onClick: () => {},
      onclose: () => {},
    },
    {
      title: "How do I whitelist contributors for my station?",
      onClick: () => {},
      onclose: () => {},
    },
    {
      title:
        "How do I gate contributions to my station using existing token(s)/NFT(s)?",
      onClick: () => {},
      onclose: () => {},
    },
  ];
};
