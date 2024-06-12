import { useState } from "react";
import Image from "next/image";
import classes from "./Stations.module.scss";
import { HiSearch } from "react-icons/hi";
import { RiFilter3Fill } from "react-icons/ri";
import {
  CHAIN_CONFIG,
  stationNetworksChainId,
  supportedNetworksChaindId,
} from "utils/constants";

const FilterStations = ({
  searchQuery,
  selectedNetworks,
  setSearchQuery,
  setSelectedNetworks,
}) => {
  const [isOpen, setIsOpen] = useState(false);

  const handleToggleNetwork = (networkId) => {
    setSelectedNetworks((prev) =>
      prev.includes(networkId)
        ? prev.filter((id) => id !== networkId)
        : [...prev, networkId],
    );
  };

  return (
    <div className={classes.filter}>
      <div className={classes.searchBar}>
        <HiSearch size={25} className={classes.searchIcon} />
        <input
          className={classes.searchInput}
          placeholder="Search your stations by name, owner, ticker..."
          value={searchQuery}
          onChange={(e) => {
            setSearchQuery(e.target.value);
          }}
        />
      </div>
      <div className={classes.chainFilter}>
        <button
          className={classes.filterButton}
          onClick={() => {
            setIsOpen((prev) => !prev);
          }}>
          <RiFilter3Fill size={25} />
          Chains
        </button>
        {isOpen && (
          <div className={classes.filterDropdown}>
            {stationNetworksChainId.map((network, key) => {
              const networkId = supportedNetworksChaindId.filter(
                (chain) => chain?.chainId === network.id,
              )[0]?.networkId;
              const isSelected = selectedNetworks.includes(networkId);
              return (
                <button
                  key={key}
                  className={
                    isSelected ? classes.selectedNetwork : classes.filterOption
                  }
                  onClick={() => {
                    handleToggleNetwork(networkId);
                  }}>
                  <span
                    style={{
                      display: "flex",
                      gap: 10,
                      fontSize: "1rem",
                      alignItems: "center",
                    }}>
                    <Image
                      alt={CHAIN_CONFIG[networkId]?.shortName}
                      src={CHAIN_CONFIG[networkId]?.logoUri}
                      width={10}
                      height={10}
                      style={{
                        width: 20,
                        height: 20,
                        backgroundColor: "white",
                        borderRadius: "1rem",
                      }}
                    />
                    {network.name}
                  </span>
                </button>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};

export default FilterStations;
