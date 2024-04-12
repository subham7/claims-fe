import classNames from "classnames";
import React, { useEffect, useRef, useState } from "react";
import { GoPencil } from "react-icons/go";
import { IoMdCheckmark } from "react-icons/io";
import classes from "@components/(settings)/Settings.module.scss";
import dayjs from "dayjs";
import useAppContractMethods from "hooks/useAppContractMethods";
import { setAlertData } from "redux/reducers/alert";
import { generateAlertData } from "utils/globalFunctions";
import { useDispatch, useSelector } from "react-redux";
import { addClubData } from "redux/reducers/club";

const DeadlineInput = ({ clubData, daoAddress, setLoading }) => {
  const [canEdit, setCanEdit] = useState(false);
  const [date, setDate] = useState(
    dayjs.unix(clubData?.depositCloseTime).format("YYYY-MM-DDTHH:mm"),
  );
  const inputRef = useRef(null);
  const dispatch = useDispatch();

  const isAdmin = useSelector((state) => {
    return state.gnosis.adminUser;
  });

  const { updateDepositTime } = useAppContractMethods({
    daoAddress,
  });

  const dispatchAlert = (message, severity) => {
    dispatch(setAlertData(generateAlertData(message, severity)));
  };

  const checkMarkClass =
    dayjs.unix(clubData?.depositCloseTime).format("YYYY-MM-DDTHH:mm") !== date
      ? classes.active
      : classes.disabled;

  const submitHandler = async () => {
    if (
      !dayjs.unix(clubData?.depositCloseTime).format("YYYY-MM-DDTHH:mm") !==
      date
    ) {
      return;
    }
    try {
      setLoading(true);
      await updateDepositTime(dayjs(date).unix());
      dispatchAlert("Deadline updated successfully", "success");
      dispatch(
        addClubData({
          ...clubData,
          depositCloseTime: dayjs(date).unix(),
        }),
      );
      setLoading(false);
      setCanEdit(false);
    } catch (error) {
      setLoading(false);
      setCanEdit(false);

      if (error.code === 4001) {
        dispatchAlert("Metamask Signature denied", "error");
      } else {
        dispatchAlert("Deadline updation failed", "error");
      }
    }
  };

  useEffect(() => {
    if (canEdit) {
      inputRef.current && inputRef.current.focus();
    }
  }, [canEdit]);

  return (
    <div className={classes.copyTextContainer}>
      <input
        ref={inputRef}
        className={classes.dateInput}
        type="datetime-local"
        disabled={!canEdit}
        onChange={(e) => {
          setDate(e.target.value);
        }}
        value={date}
        min={dayjs().format("YYYY-MM-DDTHH:mm")}
      />

      {isAdmin ? (
        <>
          {canEdit ? (
            <IoMdCheckmark
              onClick={submitHandler}
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
        </>
      ) : null}
    </div>
  );
};

export default DeadlineInput;
