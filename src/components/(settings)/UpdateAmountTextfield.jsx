import React, { useState } from "react";
import { GoPencil } from "react-icons/go";
import classes from "@components/(settings)/Settings.module.scss";
import { IoMdCheckmark } from "react-icons/io";
import classNames from "classnames";

const UpdateAmountTextfield = ({ prevAmount }) => {
  const [canEdit, setCanEdit] = useState(false);
  const [amount, setAmount] = useState(prevAmount);

  const checkMarkClass =
    prevAmount !== amount && amount > 0 ? classes.active : classes.disabled;

  return (
    <div className={classes.copyTextContainer}>
      <div className={classes.amountInputField}>
        <input
          type="number"
          disabled={!canEdit}
          className={classes.amountInput}
          onChange={(e) => {
            setAmount(e.target.value);
          }}
          value={amount}
        />
        <div>USDC</div>
      </div>

      {canEdit ? (
        <IoMdCheckmark className={classNames(classes.icon, checkMarkClass)} />
      ) : (
        <GoPencil
          onClick={() => {
            setCanEdit(true);
          }}
          className={classes.icon}
        />
      )}
    </div>
  );
};

export default UpdateAmountTextfield;
