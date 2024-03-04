import React from "react";
import classes from "../Dashboard.module.scss";
import { FaArrowDownShortWide, FaArrowUp } from "react-icons/fa6";
import ActionModal from "./ActionModal";

const DashboardActionContainer = ({
  sendModalHandler,
  distributeModalHandler,
}) => {
  return (
    <>
      <div className={classes.actionsContainer}>
        <button onClick={sendModalHandler} className={classes.actionButton}>
          <FaArrowUp />
          <p>Send</p>
        </button>
        <button
          onClick={distributeModalHandler}
          className={classes.actionButton}>
          <FaArrowDownShortWide />
          <p>Distribute</p>
        </button>
      </div>

      <ActionModal />
    </>
  );
};

export default DashboardActionContainer;
