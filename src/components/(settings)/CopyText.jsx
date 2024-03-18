import React from "react";
import { IoCopyOutline } from "react-icons/io5";
import { RxExternalLink } from "react-icons/rx";
import classes from "@components/(settings)/Settings.module.scss";

const CopyText = ({ value }) => {
  const copyHandler = () => {
    navigator.clipboard.writeText(value);
  };

  return (
    <div className={classes.copyTextContainer}>
      <input className={classes.input} disabled value={value} />
      <IoCopyOutline onClick={copyHandler} className={classes.icon} />
      <RxExternalLink className={classes.icon} />
    </div>
  );
};

export default CopyText;
