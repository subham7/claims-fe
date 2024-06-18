import styles from "./Tabs.module.scss";

const Tabs = ({ activeTab, setActiveTab }) => {
  const tabs = [
    { id: "ERC20", label: "ERC20" },
    { id: "NFT", label: "NFT" },
  ];

  const handleTabClick = (tabId) => {
    setActiveTab(tabId);
  };

  const sliderStyle = {
    width: `calc(95% / ${tabs.length})`,
    transform: `translateX(${
      tabs.findIndex((tab) => tab.id === activeTab) * 100
    }%)`,
  };

  return (
    <div className={styles.tabs}>
      <div className={styles.tabs__slider} style={sliderStyle} />
      {tabs.map((tab) => (
        <button
          key={tab.id}
          className={`${styles.tabs__button} ${
            tab.id === activeTab ? styles["tabs__button--active"] : ""
          }`}
          onClick={() => handleTabClick(tab.id)}>
          {tab.label}
        </button>
      ))}
    </div>
  );
};

export default Tabs;
