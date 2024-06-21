/* eslint-disable @next/next/no-img-element */
import { FiPlus } from "react-icons/fi";
import classes from "../Spaces.module.scss";
import { RxCross2 } from "react-icons/rx";
import { CHAIN_CONFIG, GRADIENT_BUCKET } from "utils/constants";

const Stations = ({
  setShowAddStationsModal,
  selectedStations,
  setSelectedStations,
  stationData,
}) => {
  return (
    <>
      <div className={classes.form}>
        <div className={classes.subHeader}>
          <h1 className={classes.title}>Stations</h1>
          <p className={classes.description}>
            Display stations and link them to this space.
          </p>
        </div>
        <button
          className={classes.addButton}
          onClick={() => {
            setShowAddStationsModal(true);
          }}>
          <FiPlus /> Add station
        </button>
      </div>
      <div className={classes.stations}>
        {stationData.length ? (
          stationData.map((station, key) => {
            const randomIndex = Math.floor(Math.random() * 12);
            return (
              <div className={classes.stationCard} key={key}>
                <img
                  src={CHAIN_CONFIG[station.networkId]?.logoUri}
                  alt="network"
                  className={classes.networkImage}
                />
                {station?.clubLogoUrl ? (
                  <img
                    src={station?.clubLogoUrl ?? "/assets/images/spaceLogo.png"}
                    alt="station"
                    className={classes.stationImage}
                  />
                ) : (
                  <span
                    style={{
                      width: "3.5rem",
                      height: "3.5rem",
                      background: GRADIENT_BUCKET[randomIndex],
                      borderRadius: "0.6375rem",
                      objectFit: "cover",
                    }}></span>
                )}
                <h3
                  style={{
                    marginTop: "1rem",
                    whiteSpace: "nowrap",
                    overflow: "hidden",
                    textOverflow: "ellipsis",
                  }}>
                  {station.name}
                </h3>
                <p className={classes.stationMembers}>
                  {station.membersCount}{" "}
                  {station.membersCount > 1 ? "members" : "member"}
                </p>
                <button
                  className={classes.close}
                  onClick={() => {
                    setSelectedStations(
                      selectedStations.filter(
                        (club) => club !== station.daoAddress,
                      ),
                    );
                  }}>
                  <RxCross2 size={25} />
                </button>
              </div>
            );
          })
        ) : (
          <div className={classes.defaultStations}>
            <img
              src="/assets/icons/verified_icon.svg"
              alt="verified"
              style={{
                width: "40px",
                height: "40px",
              }}
            />
            <p
              style={{
                color: "#707070",
              }}>
              Show your stations to the world. <br /> Add one to get started.
            </p>
          </div>
        )}
      </div>
    </>
  );
};

export default Stations;
