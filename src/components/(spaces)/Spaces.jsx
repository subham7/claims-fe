/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable @next/next/no-img-element */
import classes from "./Spaces.module.scss";
import SpacesHeader from "./SpacesHeader";
import { Typography } from "@mui/material";
import Socials from "./Socials";
import useSpaceFetch from "hooks/useSpaceFetch";
import BackdropLoader from "@components/common/BackdropLoader";
import { CHAIN_CONFIG, GRADIENT_BUCKET } from "utils/constants";
import dayjs from "dayjs";
import useStationFetch from "hooks/useStationFetch";
import Link from "next/link";
import { useEffect, useState } from "react";
import { getSpace } from "api/space";
import { useRouter } from "next/router";

const Spaces = ({ spaceId }) => {
  const [isValidating, setIsValidating] = useState(true);
  const { spaceData, isLoading } = useSpaceFetch(spaceId);
  const { stationData } = useStationFetch(JSON.stringify(spaceData?.stations));
  const router = useRouter();

  useEffect(() => {
    const fetchSpace = async () => {
      const response = await getSpace(spaceId);
      if (!response) {
        router.push("/");
      }
      setIsValidating(false);
    };
    if (spaceId) {
      fetchSpace();
    }
  }, [spaceId]);

  if (isLoading || isValidating) {
    return <BackdropLoader isOpen={true} showLoading={true} />;
  }

  return (
    <div className={classes.spacesContainer}>
      <SpacesHeader spaceData={spaceData} />
      <div className={classes.stationsContainer}>
        <div className={classes.header}>
          <Socials spaceData={spaceData} />
        </div>
        <Typography
          variant="inherit"
          color={"#a0a0a0"}
          style={{
            textTransform: "uppercase",
          }}
          fontSize={18}
          fontWeight={700}
          my={4}>
          Featured Stations
        </Typography>
        <div className={classes.stations}>
          {stationData.length ? (
            stationData.map((station, key) => {
              const randomIndex = Math.floor(Math.random() * 12);
              const day = Math.floor(new Date().getTime() / 1000.0);
              const day1 = dayjs.unix(day);
              const day2 = dayjs.unix(station.depositDeadline);
              const remainingDays = day2.diff(day1, "day");
              const remainingTimeInSecs = day2.diff(day1, "seconds");
              const isRemainingTimeInvalid =
                remainingDays < 0 || remainingTimeInSecs <= 0;
              return (
                <div className={classes.stationCard} key={key}>
                  <img
                    src={CHAIN_CONFIG[station.networkId]?.logoUri}
                    alt="network"
                    className={classes.networkImage}
                  />
                  {station?.clubLogoUrl ? (
                    <img
                      src={
                        station?.clubLogoUrl ?? "/assets/images/spaceLogo.png"
                      }
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
                      color: "white",
                    }}>
                    {station.name}
                  </h3>
                  <p className={classes.stationMembers}>
                    {station.membersCount}{" "}
                    {station.membersCount > 1 ? "members" : "member"}
                  </p>
                  <div
                    style={{
                      width: "fit-content",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      paddingInline: "0.8rem",
                      paddingTop: "0.3rem",
                      paddingBottom: "0.2rem",
                      position: "absolute",
                      backgroundColor: isRemainingTimeInvalid
                        ? "#450a0a70"
                        : "#052e16",
                      color: isRemainingTimeInvalid ? "#dc2626" : "#22c55e",
                      top: "1.5rem",
                      right: "1.5rem",
                      borderRadius: "1rem",
                    }}>
                    {isRemainingTimeInvalid ? "Closed" : "Live"}
                  </div>
                  <Link
                    href={`/join/${station.daoAddress}/${station.networkId}`}
                    className={classes.join}
                    target="_blank">
                    Join
                  </Link>
                </div>
              );
            })
          ) : (
            <div className={classes.banner}>
              The owner hasn&apos;t added any station(s) to this space yet.
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Spaces;
