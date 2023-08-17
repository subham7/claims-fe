import { ClaimModalStyles } from "./ClaimModalStyles";

const ClaimBackdrop = ({ onClose }) => {
  const classes = ClaimModalStyles();
  return <div onClick={onClose} className={classes.backdrop}></div>;
};

export default ClaimBackdrop;
