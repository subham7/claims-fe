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
    opacity: 0.6,
    zIndex: 2000,
  },
  modal: {
    width: "570px",
    background: "#0F0F0F",
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
    color: "#dcdcdc",
    fontSize: "16px",
    marginBottom: "6px",
  },
  btn: {
    background: "#2D55FF",
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
        <div>
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
