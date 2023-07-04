import React, { useContext } from "react";
import { AnnouncementContext } from "./AnnouncementContext";
import CloseIcon from "@mui/icons-material/Close";

const AnnouncementBar = () => {
  const { showAnnouncement, closeAnnouncement } =
    useContext(AnnouncementContext);

  if (!showAnnouncement) {
    return null; // Hide the announcement bar if showAnnouncement is false
  }

  return (
    <div
      style={{
        display: "flex",
        background:
          "transparent linear-gradient(270deg, #FF2281 0%, #B76CFD 100%) 0% 0% no-repeat padding-box",
        alignItems: "center",
        justifyContent: "center",
        position: "fixed",
        bottom: 0,
        width: "100vw",
        zIndex: "9999",
        padding: ".5rem 0",
      }}>
      <p style={{ margin: "0 0", color: "#fff" }}>
        Astronauts 🧑‍🚀 StationX is currently in testing environment, we’re fixing
        stuff rapidly. Sign up for the V1 beta version coming soon{" "}
        <a
          href="https://www.stationx.network/"
          target="blank"
          style={{ textDecoration: "underline" }}>
          here
        </a>
      </p>

      <CloseIcon
        onClick={closeAnnouncement}
        style={{
          position: "absolute",
          right: "2",
          cursor: "pointer",
          color: "#fff",
        }}
      />
    </div>
  );
};

export default AnnouncementBar;
