import { Typography } from "@mui/material";
import { makeStyles, useTheme } from "@mui/styles";
import React from "react";
import { IoMdClose } from "react-icons/io";
import BackdropLoader from "@components/common/BackdropLoader";
import { BsTwitter } from "react-icons/bs";

const useStyles = makeStyles((theme) => ({
  modal: {
    width: "570px",
    background: theme.palette.background.default,
    position: "fixed",
    top: "50%",
    left: "50%",
    transform: "translateX(-50%) translateY(-50%)",
    zIndex: 2002,
    padding: "32px",
    borderRadius: "20px",
    boxShadow: "rgba(0, 0, 0, 0.35) 0px 5px 15px;",
  },
  title: {
    fontSize: "28px",
  },
  img: {
    display: "flex",
    justifyContent: "center",
    margin: "20px",
  },
  subtitle: {
    color: "#dcdcdc",
    fontSize: "20px",
    textAlign: "center",
  },
  relative: {
    position: "relative",
  },
  icon: {
    position: "absolute",
    top: "-16px",
    right: "-16px",
    cursor: "pointer",
  },
  shareBtns: {
    display: "flex",
    gap: "8px",
    alignItems: "center",
    padding: "8px 20px",
    width: "fit-content",
    borderRadius: "10px",
    background: "#2e2e2e",
    margin: "20px auto 0",
    cursor: "pointer",
    "&:hover": {
      background: "#707070",
    },
  },
}));

const TwitterSharingModal = ({
  onClose,
  message,
  tweetText = "I just claimed a drop on @stationxnetwork. Yayyy!",
}) => {
  const theme = useTheme();
  const classes = useStyles(theme);

  return (
    <BackdropLoader showLoading={false} isOpen={true}>
      <div className={classes.modal}>
        <div className={classes.relative}>
          <div className={classes.img}>
            <img src="/assets/images/astronaut_hurray.png" width="50%" />
          </div>
          <div className={classes.subtitle}>{message}</div>
          <div
            className={classes.shareBtns}
            onClick={() => {
              window.open(
                `https://twitter.com/intent/tweet?text=${tweetText
                  .replaceAll("#", "%23")
                  .replaceAll(";", "%0A")}`,
                "_blank",
              );
            }}>
            <BsTwitter size={18} />
            <Typography variant="inherit">Share</Typography>
          </div>
          <IoMdClose onClick={onClose} className={classes.icon} size={20} />
        </div>
      </div>
    </BackdropLoader>
  );
};

export default TwitterSharingModal;
