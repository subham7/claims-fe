import React from "react";
// import classes from "@components/(settings)/Settings.module.scss";
import SettingItem from "./SettingItem";
import CopyText from "./CopyText";
import AdminFee from "./adminFee";

const GeneralSettings = () => {
  return (
    <div>
      <SettingItem
        heading={"Share Page"}
        description={"Share this page with your audience to collect deposits."}>
        <CopyText
          value={
            "https://app.stationx.network/join/0x38ed8407df36b456add16d50b1f61721cba6fbc0/0x89"
          }
        />
      </SettingItem>
      <SettingItem
        heading={"Add Admin Fees"}
        description={
          "Set a percentage of the funds raised to be deducted and sent as administrative fees."
        }>
        <AdminFee adminAddress={"0x38ed8407df36b456add16d50b1f61721cba6fbc0"} />
      </SettingItem>
      <SettingItem
        heading={"Treasury multisig"}
        description={
          "Funds raised are held in your station’s multisig. You can also send assets to this address directly. Learn more about treasuries on StationX."
        }>
        <CopyText value={"0x38ed8407df36b456add16d50b1f61721cba6fbc0"} />
      </SettingItem>
      <SettingItem
        heading={"Treasury Signer(s)"}
        description={
          "You can add up to 9 signers. Signers have access control to funds, so choose carefully."
        }></SettingItem>

      <SettingItem
        heading={"Signing Threshold"}
        description={
          "How many signatures are needed for any transaction to pass inside the station?"
        }></SettingItem>
    </div>
  );
};

export default GeneralSettings;
