import React, { useState } from "react";
import classes from "./Spaces.module.scss";
import Image from "next/image";
import { Typography } from "@mui/material";
import StatItem from "./Stats/StatItem";

const SpacesHeader = () => {
  const [bgImageUrl, setBgImageUrl] = useState(
    "/assets/images/spacesHeader.png",
  );

  const handleFileUpload = (event) => {
    const file = event.target.files[0];
    if (file) {
      const uploadedImageUrl = URL.createObjectURL(file);
      setBgImageUrl(uploadedImageUrl);
    }
  };

  const headerStyle = {
    backgroundImage: `linear-gradient(180deg, rgba(30, 30, 30, 0) 0%, rgba(24, 24, 24, 0.6) 39.11%, #111111 86.57%), url(${bgImageUrl})`,
    backgroundPosition: "center",
    backgroundRepeat: "no-repeat",
    backgroundSize: "cover",
    display: "flex",
    height: "50vh",
  };

  return (
    <div className={classes.headerImage} style={headerStyle}>
      <div className={classes.spaceInfoContainer}>
        <Image
          src={"/assets/networks/0xe708.png"}
          height={80}
          width={80}
          className={classes.logo}
        />
        <Typography className={classes.name} variant="inherit">
          Linea Space
        </Typography>

        <div>
          <div className={classes.address}>
            <Image
              src={"/assets/icons/avatar.png"}
              height={20}
              width={20}
              alt="avatar"
            />
            <Typography className={classes.walletAddress} variant="inherit">
              stationxnetwork.eth
            </Typography>
          </div>

          <div className={classes.infoContainer}>
            <Typography variant="inherit" className={classes.details}>
              Get exposure to best Linea Ecosystem Projects curated by Linea and
              StationX For Ecosystem Investment Partners & LXP holders.
            </Typography>

            <div className={classes.spaceDetails}>
              <StatItem primaryText={"11"} secondaryText={"Stations"} />
              <StatItem primaryText={"$297,792"} secondaryText={"Space AUM"} />
              <StatItem
                primaryText={"2,312"}
                secondaryText={"Members (unique)"}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SpacesHeader;
