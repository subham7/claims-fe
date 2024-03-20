import React, { useEffect, useRef, useState } from "react";
import classes from "@components/(settings)/Settings.module.scss";
import { IoMdCheckmark } from "react-icons/io";
import classNames from "classnames";
import { GoPencil } from "react-icons/go";
import useAppContractMethods from "hooks/useAppContractMethods";
import { useDispatch } from "react-redux";
import { setAlertData } from "redux/reducers/alert";
import { addClubData } from "redux/reducers/club";
import { generateAlertData } from "utils/globalFunctions";

const AdminFee = ({ daoAddress, clubData, setLoading }) => {
  const [canEdit, setCanEdit] = useState(false);
  const [percentageValue, setPercentageValue] = useState(0);
  const inputRef = useRef(null);
  const dispatch = useDispatch();

  const { updateOwnerFee } = useAppContractMethods({
    daoAddress,
  });

  const { ownerAddress, ownerFeePerDepositPercent: prevAdminFee } = clubData;

  const checkMarkClass =
    percentageValue > 0 && percentageValue <= 100
      ? classes.active
      : classes.disabled;

  const dispatchAlert = (message, severity) => {
    dispatch(setAlertData(generateAlertData(message, severity)));
  };

  const adminFeeSubmitHandler = async () => {
    setLoading(true);
    try {
      await updateOwnerFee(percentageValue * 100);
      setLoading(false);
      dispatchAlert("Owner fee updated successfully", "success");
      dispatch(
        addClubData({
          ...clubData,
          ownerFeePerDepositPercent: percentageValue * 100,
        }),
      );
    } catch (error) {
      console.log(error.code);
      setLoading(false);
      if (error.code === 4001) {
        dispatchAlert("Metamask Signature denied", "error");
      } else {
        dispatchAlert("Owner fee updating failed", "error");
      }
    }
  };

  useEffect(() => {
    if (prevAdminFee) setPercentageValue(prevAdminFee / 100);
  }, [prevAdminFee]);

  useEffect(() => {
    if (canEdit) {
      inputRef.current && inputRef.current.focus();
    }
  }, [canEdit]);

  return (
    <div className={classes.copyTextContainer}>
      <input
        disabled
        value={ownerAddress}
        className={classNames(classes.input, classes.address)}
      />
      <input
        ref={inputRef}
        onChange={(e) => {
          setPercentageValue(e.target.value);
        }}
        value={percentageValue}
        type="number"
        placeholder="0.00%"
        disabled={!canEdit}
        className={classNames(classes.input, classes.percentage)}
      />
      {canEdit ? (
        <IoMdCheckmark
          onClick={adminFeeSubmitHandler}
          className={classNames(classes.icon, checkMarkClass)}
        />
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

export default AdminFee;
