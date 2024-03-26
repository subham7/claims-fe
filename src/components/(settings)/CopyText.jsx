import React from "react";
import { IoCopyOutline } from "react-icons/io5";
import { RxExternalLink } from "react-icons/rx";
import classes from "@components/(settings)/Settings.module.scss";
import { useDispatch } from "react-redux";
import { setAlertData } from "redux/reducers/alert";
import { generateAlertData } from "utils/globalFunctions";
import { CHAIN_CONFIG } from "utils/constants";

const CopyText = ({ value, type = "daoAddress", routeNetworkId }) => {
  const dispatch = useDispatch();

  const dispatchAlert = (message, severity) => {
    dispatch(setAlertData(generateAlertData(message, severity)));
  };

  const copyHandler = () => {
    navigator.clipboard.writeText(value);
    dispatchAlert("Copied", "success");
  };

  return (
    <div className={classes.copyTextContainer}>
      <input className={classes.input} disabled value={value} />
      <IoCopyOutline onClick={copyHandler} className={classes.icon} />
      <RxExternalLink
        onClick={() => {
          if (
            type === "daoAddress"
              ? window.open(
                  `${CHAIN_CONFIG[routeNetworkId].blockExplorerUrl}/address/${value}`,
                )
              : window.open(value, "_blank")
          );
        }}
        className={classes.icon}
      />
    </div>
  );
};

export default CopyText;
