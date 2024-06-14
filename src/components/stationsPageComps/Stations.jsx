/* eslint-disable @next/next/no-img-element */

import React, { useState } from "react";
import classes from "./Stations.module.scss";
import { useAccount } from "wagmi";
import { OMIT_DAOS } from "utils/constants";
import { useRouter } from "next/router";
import { GoPlus } from "react-icons/go";
import FilterStations from "./Filter";
import Station from "./Station";

const Stations = ({ clubListData }) => {
  const { address: walletAddress } = useAccount();
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

  return (
    <div className={classes.container}>
      <div className={classes.header}>
        <h1 className={classes.title}>GM, anon!</h1>
        <button className={classes.button} onClick={handleCreateButtonClick}>
          <GoPlus size={22} /> Create station
        </button>
      </div>
      <FilterStations
        searchQuery={searchQuery}
        selectedNetworks={selectedNetworks}
        setSearchQuery={setSearchQuery}
        setSelectedNetworks={setSelectedNetworks}
      />
      <div className={classes.section}>
        <span className={classes.sectionHeader}>
          <h2 className={classes.sectionTitle}>
            My stations{" "}
            {filteredClubs.length > 0 && (
              <p className={classes.sectionSubtitle}>
                ({filteredClubs.length})
              </p>
            )}
          </h2>
          {clubListData.length > 0 && (
            <p className={classes.sectionSubtitle}>
              Total Stations: {clubListData.length}
            </p>
          )}
        </span>
        <div className={classes.stations}>
          {walletAddress && filteredClubs.length ? (
            filteredClubs
              ?.filter((club) => !OMIT_DAOS.includes(club.daoAddress))
              .map((club, key) => {
                return (
                  <Station
                    networkId={club.networkId}
                    imageUrl={club.clubLogoUrl}
                    daoAddress={club.daoAddress}
                    name={club.name}
                    tokenType={club.tokenType}
                    membersCount={club.membersCount}
                    totalAmountRaised={club.totalAmountRaised}
                    depositTokenAddress={club.depositTokenAddress}
                    gnosisAddress={club.gnosisAddress}
                    key={key}
                  />
                );
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
