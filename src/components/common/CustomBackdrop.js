import { makeStyles } from "@mui/styles";

const useStyles = makeStyles({
  backdrop: {
    position: "fixed",
    top: "0",
    left: "0",
    height: "100vh",
    width: "100vw",
    background: "#fdfdfd",
    opacity: "40%",
    zIndex: "100",
  },
});

const CustomBackdrop = ({ onClick }) => {
  const classes = useStyles();

  return <div onClick={onClick} className={classes.backdrop}></div>;
};

export default CustomBackdrop;
