import React, { useContext, useEffect } from "react";
import { AnnouncementContext } from "./AnnouncementContext";
import CloseIcon from "@mui/icons-material/Close";
import { useRouter } from "next/router";

const AnnouncementBar = () => {
  const { showAnnouncement, closeAnnouncement } =
    useContext(AnnouncementContext);
  const router = useRouter();

  const [daoAddress, networkId = "0x89"] = router?.query?.slug ?? [];

  useEffect(() => {
    if (router.pathname.includes("staking")) {
      closeAnnouncement();
    }
  }, [router.pathname]);

  if (!showAnnouncement) {
    return null; // Hide the announcement bar if showAnnouncement is false
  }

  return (
    <div
      style={{
        display: "flex",
        background: "#fff",
        alignItems: "center",
        justifyContent: "center",
        position: "sticky",
        top: 0,
        width: "100vw",
        zIndex: "9999",
        padding: ".3rem 0",
      }}>
      <p style={{ margin: "0 0", color: "#000", fontWeight: 500 }}>
        {daoAddress
          ? "Earn Stars, Eigen points and other protocol points. Pool ETH inside the station & stake "
          : "Eigen Exploration is on. Earn stars, eigen points & other protocol rewards. Create your Defi Squad "}

        <span
          onClick={() => {
            if (daoAddress) {
              router.push(`/staking/${daoAddress}/${networkId}`);
            } else {
              router.push("/stations");
            }
          }}
          style={{
            textDecoration: "underline",
            cursor: "pointer",
            fontWeight: 700,
          }}>
          here
        </span>
      </p>

      <CloseIcon
        onClick={closeAnnouncement}
        style={{
          position: "absolute",
          right: "2",
          cursor: "pointer",
          color: "#000",
        }}
      />
    </div>
  );
};

export default AnnouncementBar;
