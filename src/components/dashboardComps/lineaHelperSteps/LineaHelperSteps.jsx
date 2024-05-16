import React from "react";
import classes from "./LineaHelperSteps.module.scss";
import Backdrop from "@components/common/Backdrop/Backdrop";
import { lineaHelperStepsData } from "data/lineaHelperStepsData";
import useLockBodyScroll from "hooks/useLockBodyScroll";

const LineaHelperSteps = () => {
  useLockBodyScroll(true);

  return (
    <>
      <Backdrop />
      <div className={classes.container}>
        <p className={classes.heading}>Check feature details?</p>

        <div className={classes.list}>
          {lineaHelperStepsData.map((item) => (
            <p
              key={item.title}
              onClick={item.onClick}
              className={classes.featureItem}>
              {item.title}
            </p>
          ))}
        </div>
      </div>
    </>
  );
};

export default LineaHelperSteps;
