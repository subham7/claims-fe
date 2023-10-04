import { makeStyles } from "@mui/styles";
import { IoMdClose } from "react-icons/io";
import React from "react";
import BackdropLoader from "@components/common/BackdropLoader";

const useStyles = makeStyles({
  modal: {
    width: "900px",
    background: "#0F0F0F",
    // border: "1px solid #6475A3",
    position: "fixed",
    top: "50%",
    left: "50%",
    transform: "translateX(-50%) translateY(-50%)",
    zIndex: 2002,
    padding: "30px",
    borderRadius: "12px",
    boxShadow: "rgba(0, 0, 0, 0.35) 0px 5px 15px;",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    gap: "20px",
  },
  icon: {
    position: "absolute",
    top: "1rem",
    right: "1rem",
    cursor: "pointer",
  },
});

const VideoModal = ({ onClose }) => {
  const classes = useStyles();

  return (
    <>
      <BackdropLoader isOpen={true} forLoading={false}>
        <div className={classes.modal}>
          <IoMdClose
            onClick={onClose}
            className={classes.icon}
            size={20}
            color="white"
          />

          <iframe
            width="800px"
            height="500px"
            src="https://www.youtube.com/embed/WwIGpRWwyAk"
            title="YouTube video player"
            frameBorder="0"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
            allowfullscreen></iframe>
        </div>
      </BackdropLoader>
    </>
  );
};

export default VideoModal;
