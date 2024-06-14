import classes from "./Backdrop.module.scss";

const Backdrop = ({ onClose, children }) => {
  return (
    <div onClick={onClose} className={classes.backdrop}>
      {children}
    </div>
  );
};

export default Backdrop;
