import React, { useState } from "react";
import SettingItem from "./SettingItem";
import CopyText from "./CopyText";
import AdminFee from "./adminFee";
import CustomizedSlider from "@components/common/CustomizedSlider";
import TreasurySigner from "./TreasurySigner";
import BackdropLoader from "@components/common/BackdropLoader";
import { useRouter } from "next/router";
import StatusModal from "@components/modals/StatusModal/StatusModal";

const GeneralSettings = ({ clubData, routeNetworkId, daoAddress }) => {
  const [loading, setLoading] = useState(false);
  const [proposalId, setProposalId] = useState("");
  const [isActionCreated, setIsActionCreated] = useState(null);

  const { gnosisAddress } = clubData;

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
          value={`https://app.stationx.network/join/${daoAddress}/${routeNetworkId}`}
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
        />
      ),
    },
    {
      key: "treasuryMultisig",
      heading: "Treasury Multisig",
      description:
        "Funds raised are held in your station’s multisig. You can also send assets to this address directly. Learn more about treasuries on StationX.",
      content: <CopyText value={gnosisAddress} />,
    },
    {
      key: "treasurySigners",
      heading: "Treasury Signer(s)",
      description:
        "You can add up to 9 signers. Signers have access control to funds, so choose carefully.",
      content: (
        <TreasurySigner
          clubData={clubData}
          daoAddress={daoAddress}
          routeNetworkId={routeNetworkId}
          setLoading={setLoading}
          handleActionComplete={handleActionComplete}
        />
      ),
    },
    {
      key: "signingThreshold",
      heading: "Signing Threshold",
      description:
        "How many signatures are needed for any transaction to pass inside the station?",
      content: <CustomizedSlider />,
    },
  ];

  return (
    <div>
      {settings.map(({ key, heading, description, content }) => (
        <SettingItem key={key} heading={heading} description={description}>
          {content}
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
              router.push(
                `/proposals/${daoAddress}/${routeNetworkId}/${proposalId}`,
              );
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
