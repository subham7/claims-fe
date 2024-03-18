import Layout from "@components/layouts/layout";
import classes from "@components/(settings)/Settings.module.scss";
import Header from "@components/(settings)/Header";
import TabSelection from "@components/(settings)/TabSelection";
import GeneralSettings from "@components/(settings)/GeneralSettings";
import { useState } from "react";
import DepositSettings from "@components/(settings)/DepositSettings";

const Test = () => {
  const [settingsType, setSettingsType] = useState("general");

  const tabChangeHandler = (event, newValue) => {
    setSettingsType(newValue);
  };

  return (
    <Layout showSidebar={true}>
      <div className={classes.settings}>
        <Header />
        <TabSelection settingsType={settingsType} onChange={tabChangeHandler} />

        {settingsType === "general" ? <GeneralSettings /> : <DepositSettings />}
      </div>
    </Layout>
  );
};

export default Test;
