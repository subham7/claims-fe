import React, { useState } from "react";
// import classes from "@components/(settings)/Settings.module.scss";
import SettingItem from "./SettingItem";
import CopyText from "./CopyText";
import AdminFee from "./adminFee";
import CustomizedSlider from "@components/common/CustomizedSlider";
import TreasurySigner from "./TreasurySigner";
import BackdropLoader from "@components/common/BackdropLoader";

const GeneralSettings = ({ clubData, routeNetworkId, daoAddress }) => {
  const [loading, setLoading] = useState(false);
  const { gnosisAddress } = clubData;

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
        <TreasurySigner />
      </SettingItem>

      <SettingItem
        heading={"Signing Threshold"}
        description={
          "How many signatures are needed for any transaction to pass inside the station?"
        }>
        <CustomizedSlider />
      </SettingItem>

      <BackdropLoader isOpen={loading} />
    </div>
  );
};

export default GeneralSettings;
