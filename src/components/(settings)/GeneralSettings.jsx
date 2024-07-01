import React, { useState } from "react";
import SettingItem from "./SettingItem";
import CopyText from "./CopyText";
import AdminFee from "./AdminFee";
import TreasurySigner from "./TreasurySigner";
import BackdropLoader from "@components/common/BackdropLoader";
import { useRouter } from "next/router";
import StatusModal from "@components/modals/StatusModal/StatusModal";
import UpdateAmountTextfield from "./UpdateAmountTextfield";
import classes from "@components/(settings)/Settings.module.scss";
// import EnableKYC from "./EnableKyc";

const GeneralSettings = ({
  clubData,
  routeNetworkId,
  daoAddress,
  settingIsLoading,
}) => {
  const [loading, setLoading] = useState(false);
  const [proposalId, setProposalId] = useState("");
  const [isActionCreated, setIsActionCreated] = useState(null);

  const { gnosisAddress, currentSafeThreshold } = clubData;

  const handleActionComplete = (result, proposalId = "") => {
    setIsActionCreated(result);
    setProposalId(proposalId);
  };

  const router = useRouter();

  const settings = [
    {
      key: "sharePage",
      heading: "Share Page",
      description: "Share this page with your audience to collect deposits.",
      content: (
        <CopyText
          type="share"
          value={`${window.location.origin}/join/${daoAddress}/${routeNetworkId}`}
          settingIsLoading={settingIsLoading}
        />
      ),
    },
    {
      key: "addAdminFees",
      heading: "Add Admin Fees",
      description:
        "Set a percentage of the funds raised to be deducted and sent as administrative fees.",
      content: (
        <AdminFee
          setLoading={setLoading}
          daoAddress={daoAddress}
          clubData={clubData}
          settingIsLoading={settingIsLoading}
        />
      ),
      // isHidden: CC_NETWORKS.includes(routeNetworkId),
    },
    {
      key: "treasuryMultisig",
      heading: "Treasury Multisig",
      description:
        "Funds raised are held in your station’s multisig. You can also send assets to this address directly. Learn more about treasuries on StationX.",
      content: (
        <CopyText
          routeNetworkId={routeNetworkId}
          type="daoAddress"
          value={gnosisAddress}
          settingIsLoading={settingIsLoading}
        />
      ),
    },
    {
      key: "treasurySigners",
      heading: "Treasury Signer(s)",
      description:
        "You can add up to 9 signers, but only 1 at a time. Signers have access control to funds, so choose carefully.",
      content: (
        <TreasurySigner
          clubData={clubData}
          daoAddress={daoAddress}
          routeNetworkId={routeNetworkId}
          setLoading={setLoading}
          handleActionComplete={handleActionComplete}
          settingIsLoading={settingIsLoading}
        />
      ),
    },

    {
      key: "signingThreshold",
      heading: "Signing Threshold",
      description:
        "How many signatures are needed for any transaction to pass inside the station?",
      content: (
        <UpdateAmountTextfield
          className={classes.signators}
          daoAddress={daoAddress}
          handleActionComplete={handleActionComplete}
          routeNetworkId={routeNetworkId}
          setLoading={setLoading}
          type={"signators"}
          prevAmount={Number(currentSafeThreshold)}
          settingIsLoading={settingIsLoading}
        />
      ),
    },

    // {
    //   key: "enableKYC",
    //   heading: "KYC",
    //   description: "Enable KYC on deposits",
    //   content: (
    //     <EnableKYC
    //       clubData={clubData}
    //       daoAddress={daoAddress}
    //       routeNetworkId={routeNetworkId}
    //       setLoading={setLoading}
    //       handleActionComplete={handleActionComplete}
    //     />
    //   ),
    // },
  ];

  return (
    <div>
      {/* {settings.map(({ key, heading, description, content, isHidden }) => (
        <SettingItem
          isHidden={isHidden}
          key={key}
          heading={heading}
          description={description}>
          {content}
        </SettingItem>
      ))} */}

      {settings.map((item) => (
        <SettingItem
          key={item.key}
          heading={item?.heading}
          isHidden={item.isHidden}
          description={item.description}>
          {item.content}
        </SettingItem>
      ))}

      <BackdropLoader isOpen={loading} />

      {isActionCreated && (
        <StatusModal
          isOpen={isActionCreated !== null}
          heading={
            isActionCreated === "success"
              ? "Hurray! We made it"
              : "Something went wrong"
          }
          subheading={
            isActionCreated === "success"
              ? "Transaction created successfully!"
              : "Looks like we hit a bump here, try again?"
          }
          isError={isActionCreated !== "success"}
          onClose={() => setIsActionCreated(null)}
          buttonText={
            isActionCreated === "success"
              ? "View & Sign Transaction"
              : "Try Again?"
          }
          onButtonClick={() => {
            if (isActionCreated === "success") {
              router.push(`/proposals/${daoAddress}/${routeNetworkId}`);
            } else {
              setIsActionCreated(null);
            }
          }}
        />
      )}
    </div>
  );
};

export default GeneralSettings;
