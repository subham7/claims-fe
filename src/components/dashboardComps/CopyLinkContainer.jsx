import React from "react";
import { Typography } from "@mui/material";
import { BsCopy } from "react-icons/bs";
import classes from "./Dashboard.module.scss";
import { useDispatch } from "react-redux";
import { setAlertData } from "redux/reducers/alert";
import { generateAlertData } from "utils/globalFunctions";

const CopyLinkContainer = ({ daoAddress, routeNetworkId }) => {
  const dispatch = useDispatch();

  const dispatchAlert = (message, severity) => {
    dispatch(setAlertData(generateAlertData(message, severity)));
  };

  const copyHandler = () => {
    navigator.clipboard.writeText(
      `${window.location.origin}/join/${daoAddress}/${routeNetworkId}`,
    );
    dispatchAlert("Copied", "success");
  };

  return (
    <div className={classes.copyContainer}>
      <Typography fontSize={18} fontWeight={600} variant="inherit">
        Deposit Page
      </Typography>

      <div className={classes.flexContainer}>
        <Typography className={classes.copyText} variant="inherit">
          {`${window.location.origin}/join/${daoAddress}/${routeNetworkId}`.substring(
            0,
            30,
          )}
          ...
        </Typography>
        <BsCopy onClick={copyHandler} cursor={"pointer"} size={12} />
      </div>

      <Typography fontSize={12} color={"#707070"} variant="inherit">
        Share this page to start collecting deposits.
      </Typography>
    </div>
  );
};

export default CopyLinkContainer;
