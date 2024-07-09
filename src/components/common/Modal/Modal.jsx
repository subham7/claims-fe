import React from "react";
import classes from "./Modal.module.scss";
import classNames from "classnames";
import Backdrop from "../Backdrop/Backdrop";

const Modal = ({ children, className, onClose }) => {
  return (
    <>
      <Backdrop onClose={onClose} />
      <div className={classNames(classes.modal, className)}>{children}</div>
    </>
  );
};

export default Modal;
