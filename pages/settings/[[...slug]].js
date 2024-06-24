import Layout from "@components/layouts/layout";
import classes from "@components/(settings)/Settings.module.scss";
import Header from "@components/(settings)/Header";
import TabSelection from "@components/(settings)/TabSelection";
import GeneralSettings from "@components/(settings)/GeneralSettings";
import { useState } from "react";
import DepositSettings from "@components/(settings)/DepositSettings";
import { useRouter } from "next/router";
import { useSelector } from "react-redux";

const SettingPage2 = () => {
  const [settingsType, setSettingsType] = useState("general");

  const router = useRouter();
  const [daoAddress, networkId = "0x89"] = router?.query?.slug ?? [];

  const clubData = useSelector((state) => {
    return state.club.clubData;
  });

  if (!daoAddress) {
    return null;
  }

  const tabChangeHandler = (event, newValue) => {
    setSettingsType(newValue);
  };
  const settingIsLoading = Boolean(clubData?.adminAddresses?.length);

  return (
    <Layout daoAddress={daoAddress} networkId={networkId} showSidebar={true}>
      <div className={classes.settings}>
        <Header
          clubName={clubData?.name}
          clubSymbol={clubData?.symbol}
          settingIsLoading={settingIsLoading}
        />

        <TabSelection settingsType={settingsType} onChange={tabChangeHandler} />

        {settingsType === "general" ? (
          <GeneralSettings
            daoAddress={daoAddress}
            clubData={clubData}
            routeNetworkId={networkId}
            settingIsLoading={settingIsLoading}
          />
        ) : (
          <DepositSettings
            daoAddress={daoAddress}
            clubData={clubData}
            routeNetworkId={networkId}
          />
        )}
      </div>
    </Layout>
  );
};

export default SettingPage2;
