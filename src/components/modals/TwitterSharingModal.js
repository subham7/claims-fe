import { Grid } from "@mui/material";
import { makeStyles } from "@mui/styles";
import React from "react";
import { TwitterShareButton } from "react-twitter-embed";
import { IoMdClose } from "react-icons/io";
import BackdropLoader from "@components/common/BackdropLoader";

const useStyles = makeStyles({
  modal: {
    width: "570px",
    background: "#0F0F0F",
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
    "& > div": {
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
    },
  },
});

const TwitterSharingModal = ({ onClose, message, shareText }) => {
  const classes = useStyles();

  return (
    <BackdropLoader showLoading={false} isOpen={true}>
      <div className={classes.modal}>
        <div className={classes.relative}>
          <div className={classes.img}>
            <img src="/assets/images/astronaut_hurray.png" width="50%" />
          </div>
          <div className={classes.subtitle}>{message}</div>
          <Grid
            className={classes.shareBtns}
            item
            sx={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
            mt={2}
            gap={2}>
            Share
            <TwitterShareButton
              options={{
                size: "large",
                text: `${shareText}`,
                via: "stationxnetwork",
              }}
            />
          </Grid>
          <IoMdClose onClick={onClose} className={classes.icon} size={20} />
        </div>
      </div>
    </BackdropLoader>
  );
};

export default TwitterSharingModal;
