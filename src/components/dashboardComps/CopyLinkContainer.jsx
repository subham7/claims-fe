import React, { useEffect, useState } from "react";
import { Typography } from "@mui/material";
import { BsCopy } from "react-icons/bs";
import classes from "./Dashboard.module.scss";
import { useDispatch, useSelector } from "react-redux";
import { setAlertData } from "redux/reducers/alert";
import { generateAlertData } from "utils/globalFunctions";
import { RiExternalLinkLine } from "react-icons/ri";
import { useRouter } from "next/router";

const CopyLinkContainer = ({ daoAddress, routeNetworkId }) => {
  const [visibleLinkLength, setVisibleLinkLength] = useState(32);

  const isAdmin = useSelector((state) => {
    return state.gnosis.adminUser;
  });

  const dispatch = useDispatch();
  const router = useRouter();

  const dispatchAlert = (message, severity) => {
    dispatch(setAlertData(generateAlertData(message, severity)));
  };

  const copyHandler = () => {
    navigator.clipboard.writeText(
      `${window.location.origin}/join/${daoAddress}/${routeNetworkId}`,
    );
    dispatchAlert("Copied", "success");
  };

  useEffect(() => {
    const updateVisibleLinkLength = () => {
      const windowWidth = window.innerWidth;
      if (windowWidth > 1500) {
        setVisibleLinkLength(50);
      } else {
        setVisibleLinkLength(32);
      }
    };

    window.addEventListener("resize", updateVisibleLinkLength);
    updateVisibleLinkLength();
    return () => window.removeEventListener("resize", updateVisibleLinkLength);
  }, []);

  return (
    <div className={classes.copyContainer}>
      <div className={classes.headingContainer2}>
        <Typography fontSize={18} fontWeight={600} variant="inherit">
          Contribution link
        </Typography>

        {isAdmin ? (
          <div
            onClick={() => {
              router.push(`/join/${daoAddress}/${routeNetworkId}`);
            }}
            className={classes.editContainer}>
            <RiExternalLinkLine />
            <Typography variant="inherit">Preview & Edit</Typography>
          </div>
        ) : null}
      </div>

      <div
        onClick={copyHandler}
        className={classes.flexContainer}
        style={{ cursor: "pointer" }}>
        <Typography className={classes.copyText} variant="inherit">
          {`${window.location.origin}/join/${daoAddress}/${routeNetworkId}`.substring(
            0,
            visibleLinkLength,
          )}
          ...
        </Typography>

        <div className={classes.copyButtonContainer}>
          <BsCopy size={12} />
        </div>
      </div>

      <Typography mt={1} fontSize={14} color={"#707070"} variant="inherit">
        Share this link to start collecting fund contributions into this
        station.
      </Typography>
    </div>
  );
};

export default CopyLinkContainer;
