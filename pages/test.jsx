import Layout from "@components/layouts/layout";
import classes from "@components/(settings)/Settings.module.scss";
import Header from "@components/(settings)/Header";
import TabSelection from "@components/(settings)/TabSelection";
import GeneralSettings from "@components/(settings)/GeneralSettings";

const Test = () => {
  return (
    <Layout showSidebar={true}>
      <div className={classes.settings}>
        <Header />
        <TabSelection />
        <GeneralSettings />
        {/* <DepositSettings /> */}
      </div>
    </Layout>
  );
};

export default Test;
