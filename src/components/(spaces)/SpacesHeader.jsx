/* eslint-disable @next/next/no-img-element */
import classes from "./Spaces.module.scss";
import Image from "next/image";
import { Typography } from "@mui/material";
import StatItem from "./Stats/StatItem";

const SpacesHeader = ({ spaceData }) => {
  const headerStyle = {
    backgroundImage: `linear-gradient(180deg, rgba(30, 30, 30, 0) 0%, rgba(24, 24, 24, 0.6) 39.11%, #111111 86.57%), url(${"/assets/images/spacePlaceholder.svg"})`,
    backgroundPosition: "center",
    backgroundRepeat: "no-repeat",
    backgroundSize: "cover",
    display: "flex",
    height: "60vh",
  };

  return (
    <div className={classes.headerImage} style={headerStyle}>
      <div className={classes.spaceInfoContainer}>
        <img
          alt={spaceData?.name}
          src={spaceData?.logo ? spaceData?.logo : "/assets/images/nft.png"}
          height={50}
          width={50}
          className={classes.logo}
        />
        <Typography className={classes.name} variant="inherit">
          {spaceData?.name}
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
              {spaceData?.creator}
            </Typography>
          </div>

          <div className={classes.infoContainer}>
            <Typography variant="inherit" className={classes.details}>
              {spaceData?.description}
            </Typography>

            <div className={classes.spaceDetails}>
              <StatItem primaryText={"0"} secondaryText={"Stations"} />
              <StatItem primaryText={"$0"} secondaryText={"Space AUM"} />
              <StatItem primaryText={"0"} secondaryText={"Members (unique)"} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SpacesHeader;
