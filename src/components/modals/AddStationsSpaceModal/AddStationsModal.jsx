import Modal from "@components/common/Modal/Modal";
import classes from "./AddStationsModal.module.scss";
import { RxCross2 } from "react-icons/rx";
import Station from "./Station";
import { useAccount, useChainId } from "wagmi";
import { CHAIN_CONFIG, OMIT_DAOS } from "utils/constants";
import { useState } from "react";

const AddStationsModal = ({
  setShowAddStationsModal,
  clubs,
  isLoading,
  selectedStations,
  setSelectedStations,
}) => {
  const { address } = useAccount();
  const chainId = useChainId();
  const [stationURL, setStationURL] = useState("");

  const handleAddStation = () => {
    if (stationURL) {
      const url = new URL(stationURL);
      const pathSegments = url.pathname.split("/");

      if (pathSegments.includes("join")) {
        const daoAddress = pathSegments[2];
        setSelectedStations([...selectedStations, daoAddress]);
        setStationURL("");
        setShowAddStationsModal(false);
      }
    }
  };

  const initialChainClubs = clubs.filter(
    (club) => CHAIN_CONFIG[club.networkId].chainId === chainId,
  );
  const clubsWithoutInitialChain = clubs.filter(
    (club) => CHAIN_CONFIG[club.networkId].chainId !== chainId,
  );
  const sortedClubs = [...initialChainClubs, ...clubsWithoutInitialChain];

  return (
    <Modal className={classes.createModal}>
      <div className={classes.add}>
        <span
          style={{
            display: "flex",
            justifyContent: "end",
          }}>
          <button
            className={classes.closeButton}
            onClick={() => {
              setShowAddStationsModal(false);
            }}>
            <RxCross2 size={20} />
          </button>
        </span>
        <h2>Add Station(s)</h2>
        <div className={classes.search}>
          <input
            type="text"
            placeholder="Enter URL"
            className={classes.searchInput}
            value={stationURL}
            onChange={(event) => setStationURL(event.target.value)}
          />
          <button
            className={classes.addButton}
            onClick={() => {
              handleAddStation();
            }}>
            Add
          </button>
        </div>
        <hr className={classes.divider} />
        <div className={classes.header}>
          <p>
            Choose from your stations {clubs.length > 0 && `(${clubs.length})`}
          </p>
          {selectedStations.length > 0 && (
            <p>{selectedStations.length} added</p>
          )}
        </div>
        <div className={classes.stations}>
          {isLoading ? (
            <p
              style={{
                color: "#707070",
                fontSize: "1.2rem",
                textAlign: "center",
              }}>
              Fetching stations...
            </p>
          ) : address && sortedClubs.length ? (
            sortedClubs
              ?.filter((club) => !OMIT_DAOS.includes(club.daoAddress))
              .map((club, key) => {
                return (
                  <Station
                    club={club}
                    key={key}
                    selectedStations={selectedStations}
                    setSelectedStations={setSelectedStations}
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
                color: "#707070",
              }}>
              <h3
                style={{
                  fontSize: "20px",
                  fontWeight: "400",
                  marginBottom: 0,
                }}>
                No stations found
              </h3>
              <p style={{ fontWeight: "300" }}>
                Station(s) you created or a part of appear here
              </p>
            </div>
          )}
        </div>
      </div>
    </Modal>
  );
};

export default AddStationsModal;
