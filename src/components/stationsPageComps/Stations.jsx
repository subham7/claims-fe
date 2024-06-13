/* eslint-disable @next/next/no-img-element */

import React, { useState } from "react";
import classes from "./Stations.module.scss";
import { useAccount } from "wagmi";
import { OMIT_DAOS } from "utils/constants";
import { useRouter } from "next/router";
import { GoPlus } from "react-icons/go";
import FilterStations from "./Filter";
import Station from "./Station";
import CreateSpaceModal from "@components/modals/CreateSpaceModal/CreateSpaceModal";

const Stations = ({ clubListData }) => {
  const { address: walletAddress } = useAccount();
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedNetworks, setSelectedNetworks] = useState([]);
  const [showCreateSpaceModal, setShowCreateSpaceModal] = useState(false);

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
      <h1 className={classes.title}>GM, anon!</h1>
      <FilterStations
        searchQuery={searchQuery}
        selectedNetworks={selectedNetworks}
        setSearchQuery={setSearchQuery}
        setSelectedNetworks={setSelectedNetworks}
      />
      <div className={classes.section}>
        <span className={classes.sectionHeader}>
          <span className={classes.sectionTitle}>
            Space <h3 className={classes.sectionSubTitle}>Beta</h3>
          </span>
          <button
            className={classes.button}
            onClick={() => setShowCreateSpaceModal(true)}>
            <GoPlus size={22} /> Create space
          </button>
        </span>
        <div className={classes.stations}>
          {walletAddress ? (
            <p>Your spaces will appear here.</p>
          ) : (
            <p
              style={{
                color: "#707070",
                fontWeight: "300",
                textAlign: "center",
              }}>
              You don&apos;t own any space(s) yet. Get started by creating one.
            </p>
          )}
        </div>
      </div>
      <div className={classes.section}>
        <span className={classes.sectionHeader}>
          <h2 className={classes.sectionTitle}>
            Stations {filteredClubs.length > 0 && `: ${filteredClubs.length}`}
          </h2>
          <button className={classes.button} onClick={handleCreateButtonClick}>
            <GoPlus size={22} /> Create station
          </button>
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
      {showCreateSpaceModal && (
        <CreateSpaceModal setShowCreateSpaceModal={setShowCreateSpaceModal} />
      )}
    </div>
  );
};

export default Stations;
