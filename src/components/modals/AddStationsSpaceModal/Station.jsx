/* eslint-disable @next/next/no-img-element */

import classes from "./AddStationsModal.module.scss";
import Image from "next/image";
import { FiPlus } from "react-icons/fi";
import { LuCheck } from "react-icons/lu";
import { CHAIN_CONFIG, GRADIENT_BUCKET } from "utils/constants";

const Station = ({ club, selectedStations, setSelectedStations }) => {
  const randomIndex = Math.floor(Math.random() * 12);

  const handleAddStation = () => {
    const isSelected = selectedStations.some(
      (station) => station === club.daoAddress,
    );

    if (!isSelected) {
      setSelectedStations([...selectedStations, club.daoAddress]);
    } else {
      setSelectedStations(
        selectedStations.filter((station) => station !== club.daoAddress),
      );
    }
  };

  const isSelected = selectedStations.some(
    (station) => station === club.daoAddress,
  );

  return (
    <div className={classes.station}>
      <Image
        src={CHAIN_CONFIG[club.networkId]?.logoUri}
        alt={CHAIN_CONFIG[club.networkId]?.shortName}
        width={10}
        height={10}
        className={classes.chainIcon}
      />
      {club?.clubLogoUrl ? (
        <img
          src={club.clubLogoUrl}
          alt="stationImage"
          width={50}
          height={50}
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
      <div className={classes.stationInfo}>
        <div className={classes.stationHeader}>
          <h1 className={classes.stationTitle}>
            {club.name}{" "}
            <span className={classes.stationBadge}>
              {club.tokenType === "erc721" ? "NFT" : club.tokenType}
            </span>
          </h1>
          <p className={classes.stationMetadata}>
            {club.isAdmin && "⚡️ Admin •"} {`${club.tokenTicker} •`}{" "}
            {club.membersCount} {club.membersCount > 1 ? "members" : "member"}
          </p>
        </div>
      </div>
      <button
        className={classes.addStationButton}
        style={{
          backgroundColor: isSelected ? "#052e16" : "#1e1e1e",
          color: isSelected ? "#22c55e" : "#fff",
        }}
        onClick={handleAddStation}>
        {isSelected ? <LuCheck size={25} /> : <FiPlus size={25} />}
      </button>
    </div>
  );
};

export default Station;
