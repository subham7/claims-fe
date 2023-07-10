import Image from "next/image";
import React from "react";

const LensterShareButton = ({ daoName, daoAddress, message = "" }) => {
  return (
    <button
      style={{
        display: "flex",
        alignItems: "center",
        borderRadius: "20px",
        overflow: "hidden",
        border: "none",
        padding: "5px 8px",
        background: "#8B5BF9",
        cursor: "pointer",
        marginTop: "-2px",
      }}>
      <Image
        src="/assets/icons/lenster.jpeg"
        alt="Share on Lenster"
        height={20}
        width={20}
      />
      <a
        href={`https://lenster.xyz/?text=${
          message
            ? message
            : "Just joined ${daoName} Station on stationxnetwork!"
        }&url=${
          window.location.origin
        }/join/${daoAddress}&via=StationX&hashtags=lens,web3,stationX`}
        style={{
          color: "#fff",
          fontWeight: "600",
        }}
        target="_blank"
        rel="noreferrer">
        Lenster
      </a>
    </button>
  );
};

export default LensterShareButton;
