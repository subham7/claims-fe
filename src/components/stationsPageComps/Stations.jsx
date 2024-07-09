/* eslint-disable @next/next/no-img-element */

import React, { useState } from "react";
import classes from "./Stations.module.scss";
import { useAccount, useChainId } from "wagmi";
import { CHAIN_CONFIG, OMIT_DAOS } from "utils/constants";
import { useRouter } from "next/router";
import { GoPlus } from "react-icons/go";
import FilterStations from "./Filter";
import Station from "./Station";

const Stations = ({ clubListData }) => {
  const { address: walletAddress } = useAccount();
  const chainId = useChainId();
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedNetworks, setSelectedNetworks] = useState([]);

  const handleCreateButtonClick = async () => {
    const { pathname } = router;

    if (pathname.includes("/stations")) {
      router.push("/create");
    }
  };

  const filteredSearchClubs = searchQuery
    ? clubListData.filter((club) =>
        club.name.toLowerCase().includes(searchQuery.toLowerCase()),
      )
    : clubListData;

  const filteredClubs = selectedNetworks.length
    ? filteredSearchClubs.filter((club) =>
        selectedNetworks.includes(club?.networkId),
      )
    : filteredSearchClubs;

  const initialChainClubs = filteredClubs.filter(
    (club) => CHAIN_CONFIG[club.networkId].chainId === chainId,
  );
  const clubsWithoutInitialChain = filteredClubs.filter(
    (club) => CHAIN_CONFIG[club.networkId].chainId !== chainId,
  );
  const sortedClubs = [...initialChainClubs, ...clubsWithoutInitialChain];

  return (
    <div className={classes.container}>
      <h3 className={classes.title}>GM, anon!</h3>
      <FilterStations
        searchQuery={searchQuery}
        selectedNetworks={selectedNetworks}
        setSearchQuery={setSearchQuery}
        setSelectedNetworks={setSelectedNetworks}
      />
      <div className={classes.section}>
        <span className={classes.sectionHeader}>
          <h2 className={classes.sectionTitle}>
            Stations {clubListData.length > 0 && `: ${clubListData.length}`}
          </h2>
          <button className={classes.button} onClick={handleCreateButtonClick}>
            <GoPlus size={22} /> Create station
          </button>
        </span>
        <div className={classes.stations}>
          {walletAddress && sortedClubs.length ? (
            sortedClubs
              ?.filter((club) => !OMIT_DAOS.includes(club.daoAddress))
              .map((club, key) => {
                return <Station club={club} key={key} idx={key} />;
              })
          ) : (
            <div
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                flexDirection: "column",
              }}>
              <h3
                style={{
                  fontSize: "20px",
                  fontWeight: "400",
                  marginBottom: 0,
                }}>
                No stations found
              </h3>
              <p style={{ color: "#dcdcdc", fontWeight: "300" }}>
                Station(s) you created or a part of appear here
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Stations;
