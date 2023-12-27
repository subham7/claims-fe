import classes from "./Backdrop.module.scss";

const Backdrop = ({ onClose }) => {
  return <div onClick={onClose} className={classes.backdrop}></div>;
};

export default Backdrop;
