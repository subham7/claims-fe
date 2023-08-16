import { Link } from "@mui/material";
import { makeStyles } from "@mui/styles";
import React from "react";

const useStyles = makeStyles({
  backdrop: {
    position: "fixed",
    height: "100vh",
    width: "100vw",
    top: 0,
    left: 0,
    background: "#000000",
    opacity: 0.85,
    zIndex: 2000,
  },
  modal: {
    width: "570px",
    background: "#111D38",
    position: "fixed",
    top: "50%",
    left: "50%",
    transform: "translateX(-50%) translateY(-50%)",
    zIndex: 2002,
    padding: "28px 25px",
    borderRadius: "20px",
    boxShadow: "rgba(0, 0, 0, 0.35) 0px 5px 15px;",
  },
  title: {
    letterSpacing: "0.4px",

    fontSize: "28px",
    color: "red",
  },
  subtitle: {
    color: "#C1D3FF",
    fontSize: "16px",
    marginBottom: "6px",
  },
  btn: {
    background: "#3B7AFD",
    borderRadius: "10px",
    padding: "13px 30px",
    marginTop: "20px",
    border: "none",
    cursor: "pointer",
    color: "white",
    fontWeight: 500,
    letterSpacing: "0.6px",
    fontSize: "16px",
  },
  relative: {
    position: "relative",
  },
  icon: {
    position: "absolute",
    top: "-23px",
    right: 0,
    cursor: "pointer",
  },
  inviteLink: {
    background:
      "transparent linear-gradient(90deg, #111D3800 0%, #3B7AFD 100%) 0% 0% no-repeat padding-box",
    position: "",
    display: "block",
    padding: "0px 20px",
    overflowX: "scroll",
    marginTop: "20px",
    borderRadius: "10px",
    border: "1px solid gray",
    color: "#a7a6ba",
    paddingRight: "20px",
  },
  copy: {
    width: "68px",
    height: "30px",
    background: "#3B7AFD 0% 0% no-repeat padding-box",
    borderRadius: "15px",
  },
  linkInput: {
    width: "100%",
    color: "#C1D3FF",
    background: "#111D38 0% 0% no-repeat padding-box",
    border: "1px solid #C1D3FF40",
    borderRadius: "10px",
    "&:hover": {
      boxShadow: "0px 0px 12px #C1D3FF40",
      border: "1px solid #C1D3FF40",
      borderRadius: "10px",
      opacity: 1,
    },
  },
});
const Backdrop = () => {
  const classes = useStyles();
  return <div className={classes.backdrop}></div>;
};

const ErrorModal = ({ isSignRejected = false, isError = false }) => {
  const classes = useStyles();
  return (
    <>
      <Backdrop />
      <div className={classes.modal}>
        <div className={classes.relative}>
          <h2 className={classes.title}>Error</h2>
          <p className={classes.subtitle}>
            {isSignRejected && "Metamask Signature rejected by user"}
            {isError && "Some unknown error occurred."}
          </p>

          <Link href="/">
            <button className={classes.btn}>Go to homepage</button>
          </Link>
        </div>
      </div>
    </>
  );
};

export default ErrorModal;
