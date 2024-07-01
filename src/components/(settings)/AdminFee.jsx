import React, { useEffect, useRef, useState } from "react";
import classes from "@components/(settings)/Settings.module.scss";
import { IoMdCheckmark } from "react-icons/io";
import classNames from "classnames";
import { GoPencil } from "react-icons/go";
import useAppContractMethods from "hooks/useAppContractMethods";
import { useDispatch, useSelector } from "react-redux";
import { setAlertData } from "redux/reducers/alert";
import { addClubData } from "redux/reducers/club";
import { generateAlertData } from "utils/globalFunctions";
import { Box } from "@mui/material";
import CustomSkeleton from "@components/skeleton/CustomSkeleton";

const AdminFee = ({ daoAddress, clubData, setLoading, settingIsLoading }) => {
  const [canEdit, setCanEdit] = useState(false);
  const [percentageValue, setPercentageValue] = useState(0);
  const inputRef = useRef(null);
  const dispatch = useDispatch();

  const isAdmin = useSelector((state) => {
    return state.gnosis.adminUser;
  });

  const { updateOwnerFee } = useAppContractMethods({
    daoAddress,
  });

  const { ownerAddress, ownerFeePerDepositPercent: prevAdminFee } = clubData;

  const checkMarkClass =
    percentageValue > 0 &&
    percentageValue <= 100 &&
    +prevAdminFee / 100 !== percentageValue
      ? classes.active
      : classes.disabled;

  const dispatchAlert = (message, severity) => {
    dispatch(setAlertData(generateAlertData(message, severity)));
  };

  const adminFeeSubmitHandler = async () => {
    if (!Number(percentageValue) > 0 && Number(percentageValue) <= 100) {
      return;
    }

    if (+prevAdminFee / 100 === percentageValue) {
      return;
    }

    setLoading(true);
    try {
      await updateOwnerFee(percentageValue * 100);
      dispatchAlert("Owner fee updated successfully", "success");
      dispatch(
        addClubData({
          ...clubData,
          ownerFeePerDepositPercent: percentageValue * 100,
        }),
      );
      setLoading(false);
      setCanEdit(false);
    } catch (error) {
      console.log(error.code);
      setLoading(false);
      setCanEdit(false);

      if (error.code === 4001) {
        dispatchAlert("Metamask Signature denied", "error");
      } else {
        dispatchAlert("Owner fee updating failed", "error");
      }
    }
  };

  useEffect(() => {
    if (prevAdminFee) setPercentageValue(Number(prevAdminFee / 100));
  }, [prevAdminFee]);

  useEffect(() => {
    if (canEdit) {
      inputRef.current && inputRef.current.focus();
    }
  }, [canEdit]);

  return (
    <>
      {!settingIsLoading ? (
        <Box sx={{ width: "400px" }}>
          <CustomSkeleton
            marginTop={"20px"}
            width={"100%"}
            height={40}
            length={1}
          />
        </Box>
      ) : (
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
            onWheel={(e) => e.target.blur()}
            className={classNames(classes.input, classes.percentage)}
          />

          {isAdmin ? (
            <>
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
            </>
          ) : null}
        </div>
      )}
    </>
  );
};

export default AdminFee;
