import React, { useState } from "react";
import classes from "@components/(settings)/Settings.module.scss";
import { IoMdCheckmark } from "react-icons/io";
import classNames from "classnames";

const AdminFee = ({ adminAddress }) => {
  const [percentageValue, setPercentageValue] = useState();

  const checkMarkClass =
    percentageValue > 0 && percentageValue <= 100
      ? classes.active
      : classes.disabled;

  return (
    <div className={classes.copyTextContainer}>
      <input
        disabled
        value={adminAddress}
        className={classNames(classes.input, classes.address)}
      />
      <input
        onChange={(e) => {
          setPercentageValue(e.target.value);
        }}
        value={percentageValue}
        type="number"
        placeholder="0.00%"
        className={classNames(classes.input, classes.percentage)}
      />
      <IoMdCheckmark className={classNames(classes.icon, checkMarkClass)} />
    </div>
  );
};

export default AdminFee;
