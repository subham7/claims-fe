import classes from "./Spaces.module.scss";
import SpacesHeader from "./SpacesHeader";
import { Typography } from "@mui/material";
import Socials from "./Socials";
import useSpaceFetch from "hooks/useSpaceFetch";
import BackdropLoader from "@components/common/BackdropLoader";

const Spaces = ({ spaceId }) => {
  const { spaceData, isLoading } = useSpaceFetch(spaceId);

  if (isLoading) {
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
        <div className={classes.banner}>
          The owner hasn&apos;t added any station(s) to this space yet.
        </div>
      </div>
    </div>
  );
};

export default Spaces;
