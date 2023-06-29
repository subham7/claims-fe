import React from "react";
import ClaimBackdrop from "./ClaimBackdrop";
import { ClaimModalStyles } from "./ClaimModalStyles";

const ModalCard = ({ children, onClose }) => {
  const classes = ClaimModalStyles();

  return (
    <>
      <ClaimBackdrop onClose={onClose} />
      <section className={classes.card}>{children}</section>;
    </>
  );
};

export default ModalCard;
