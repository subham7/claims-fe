import React, { useContext, useEffect } from "react";
import { AnnouncementContext } from "./AnnouncementContext";
import CloseIcon from "@mui/icons-material/Close";
import { useRouter } from "next/router";
import { useChainId } from "wagmi";

const AnnouncementBar = () => {
  const { showAnnouncement, closeAnnouncement, openAnnouncement } =
    useContext(AnnouncementContext);
  const router = useRouter();

  const [daoAddress] = router?.query?.slug ?? [];
  const chain = useChainId();
  const networkId = "0x" + chain?.toString(16);

  useEffect(() => {
    if (
      router.pathname.includes("staking") ||
      router.pathname.includes("join")
    ) {
      closeAnnouncement();
    } else {
      openAnnouncement();
    }
  }, [router.pathname]);

  if (!showAnnouncement) {
    return null; // Hide the announcement bar if showAnnouncement is false
  }

  if (networkId !== "0x1") {
    return null;
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
