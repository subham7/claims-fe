import React, { useState } from "react";
// import classes from "@components/(settings)/Settings.module.scss";
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

  return (
    <div>
      <SettingItem
        heading={"Share Page"}
        description={"Share this page with your audience to collect deposits."}>
        <CopyText
          value={`https://app.stationx.network/join/${daoAddress}/${routeNetworkId}`}
        />
      </SettingItem>

      <SettingItem
        heading={"Add Admin Fees"}
        description={
          "Set a percentage of the funds raised to be deducted and sent as administrative fees."
        }>
        <AdminFee
          setLoading={setLoading}
          daoAddress={daoAddress}
          clubData={clubData}
        />
      </SettingItem>

      <SettingItem
        heading={"Treasury multisig"}
        description={
          "Funds raised are held in your station’s multisig. You can also send assets to this address directly. Learn more about treasuries on StationX."
        }>
        <CopyText value={`${gnosisAddress}`} />
      </SettingItem>

      <SettingItem
        heading={"Treasury Signer(s)"}
        description={
          "You can add up to 9 signers. Signers have access control to funds, so choose carefully."
        }>
        <TreasurySigner
          clubData={clubData}
          daoAddress={daoAddress}
          routeNetworkId={routeNetworkId}
          setLoading={setLoading}
          handleActionComplete={handleActionComplete}
        />
      </SettingItem>

      <SettingItem
        heading={"Signing Threshold"}
        description={
          "How many signatures are needed for any transaction to pass inside the station?"
        }>
        <CustomizedSlider />
      </SettingItem>

      <BackdropLoader isOpen={loading} />

      {isActionCreated === "success" ? (
        <StatusModal
          heading={"Hurray! We made it"}
          subheading="Transaction created successfully!"
          isError={false}
          onClose={() => setIsActionCreated(null)}
          buttonText="View & Sign Transaction"
          onButtonClick={() => {
            router.push(
              `/proposals/${daoAddress}/${routeNetworkId}/${proposalId}`,
            );
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
    </div>
  );
};

export default GeneralSettings;
