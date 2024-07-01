import { useState } from "react";
import classes from "../Spaces.module.scss";

const Tabs = () => {
  const [activeTab, setActiveTab] = useState(0);
  return (
    <div className={classes.tabs}>
      <button
        className={classes.tab}
        style={{
          borderBottom:
            activeTab === 0 ? "2px solid #fff" : "2px solid transparent",
        }}
        onClick={() => setActiveTab(0)}>
        General
      </button>
      {/* <button
        className={classes.tab}
        onClick={() => setActiveTab(1)}
        style={{
          borderBottom:
            activeTab === 1 ? "2px solid #fff" : "2px solid transparent",
        }}
        disabled>
        Permissions
      </button> */}
    </div>
  );
};

export default Tabs;
