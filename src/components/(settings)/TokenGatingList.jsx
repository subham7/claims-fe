import React, { useEffect, useState } from "react";
import classes from "@components/(settings)/Settings.module.scss";
import { RxCross2 } from "react-icons/rx";
import useAppContractMethods from "hooks/useAppContractMethods";
import classNames from "classnames";
import useCommonContractMethods from "hooks/useCommonContractMehods";
import {
  convertFromWeiGovernance,
  convertToWeiGovernance,
  generateAlertData,
} from "utils/globalFunctions";
import { setAlertData } from "redux/reducers/alert";
import { useDispatch, useSelector } from "react-redux";
import { Typography } from "@mui/material";

const TokenGatingList = ({ daoAddress, setLoading }) => {
  const [showAddButton, setShowAddButton] = useState(true);
  const [showSaveButton, setShowSaveButton] = useState(false);
  const [tokenGatedDetails, setTokenGatedDetails] = useState([]);
  const [tokenGatingDetails, setTokenGatingDetails] = useState({
    address: "",
    amount: 0,
  });
  const [showErrorText, setShowErrorText] = useState(false);

  const isAdmin = useSelector((state) => {
    return state.gnosis.adminUser;
  });

  const { setupTokenGating, getTokenGatingDetails, disableTokenGating } =
    useAppContractMethods({
      daoAddress,
    });
  const { getDecimals, getTokenSymbol } = useCommonContractMethods({
    daoAddress,
  });

  const dispatch = useDispatch();

  const dispatchAlert = (message, severity) => {
    dispatch(setAlertData(generateAlertData(message, severity)));
  };

  const tokenGatingHandler = async () => {
    try {
      setLoading(true);

      const symbol = await getTokenSymbol(tokenGatingDetails.address);

      if (!symbol) {
        setShowErrorText(true);
        setLoading(false);
        return;
      } else {
        setShowErrorText(false);
      }

      const decimals = await getDecimals(tokenGatingDetails.address);

      const convertedAmount = convertToWeiGovernance(
        tokenGatingDetails.amount,
        decimals,
      );

      await setupTokenGating(
        tokenGatingDetails.address,
        tokenGatingDetails.address,
        0,
        0,
        [
          decimals ? convertedAmount : tokenGatingDetails.amount,
          decimals ? convertedAmount : tokenGatingDetails.amount,
        ],
      );
      fetchTokenGatingDetails();
      setLoading(false);
      dispatchAlert("Token gated successfully", "success");
      setTokenGatingDetails({
        address: "",
        amount: 0,
      });
      setShowAddButton(true);
      setShowSaveButton(false);
    } catch (error) {
      console.error(error);
      setLoading(false);
      if (error.code === 4001) {
        dispatchAlert("Metamask Signature denied", "error");
      } else {
        dispatchAlert("Tokengating failed!", "error");
      }
    }
  };

  const removeTokenGatingHandler = async () => {
    try {
      setLoading(true);
      await disableTokenGating();
      fetchTokenGatingDetails();
      dispatchAlert("Token gating removed successfully", "success");
      setLoading(false);
    } catch (error) {
      setLoading(false);
      if (error.code === 4001) {
        dispatchAlert("Metamask Signature denied", "error");
      } else {
        dispatchAlert("Tokengating removal failed!", "error");
      }
    }
  };

  const fetchTokenGatingDetails = async () => {
    try {
      const details = await getTokenGatingDetails();

      const transformedDetails = [];
      for (const detail of details) {
        const decimal = await getDecimals(detail.tokenA);
        transformedDetails.push({
          tokenAAddress: detail.tokenA,
          value: detail.value[0].toString(),
          decimal,
        });
      }

      setTokenGatedDetails(transformedDetails);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    fetchTokenGatingDetails();
  }, [daoAddress]);

  return (
    <div className={classes.treasurySignerContainer}>
      {tokenGatedDetails?.length
        ? tokenGatedDetails.map((item, index) => (
            <div
              key={index}
              style={{ margin: "4px 0" }}
              className={classes.copyTextContainer}>
              <input
                value={item.tokenAAddress}
                placeholder="Contract address"
                className={classNames(classes.input, classes.address)}
                disabled
              />
              <input
                type="number"
                value={Number(
                  item.decimal
                    ? convertFromWeiGovernance(item.value, item.decimal)
                    : item.value,
                )}
                placeholder="0"
                disabled
                className={classNames(classes.input, classes.percentage)}
              />
            </div>
          ))
        : null}

      <div>
        {!showAddButton || !tokenGatedDetails.length ? (
          <div
            style={{ margin: "4px 0" }}
            className={classes.copyTextContainer}>
            <input
              onChange={(e) => {
                setTokenGatingDetails({
                  ...tokenGatingDetails,
                  address: e.target.value,
                });
              }}
              disabled={!isAdmin}
              value={tokenGatingDetails.address}
              placeholder="Contract address"
              className={classNames(classes.input, classes.address)}
            />
            <input
              type="number"
              value={tokenGatingDetails.amount}
              onChange={(e) => {
                setTokenGatingDetails({
                  ...tokenGatingDetails,
                  amount: e.target.value,
                });
              }}
              placeholder="0"
              disabled={!isAdmin}
              className={classNames(classes.input, classes.percentage)}
            />

            {tokenGatedDetails.length ? (
              <RxCross2
                onClick={() => {
                  setShowAddButton(true);
                  setShowSaveButton(false);
                  setShowErrorText(false);
                  setTokenGatingDetails({
                    amount: 0,
                    address: "",
                  });
                }}
                className={classNames(classes.icon)}
              />
            ) : null}
          </div>
        ) : null}

        {showErrorText && (
          <Typography
            variant="inherit"
            fontSize={12}
            color={"red"}
            ml={1}
            mt={0.5}>
            Not a valid token address
          </Typography>
        )}

        {isAdmin && showAddButton && tokenGatedDetails.length ? (
          <div className={classes.copyTextContainer}>
            <button
              onClick={() => {
                setShowAddButton(false);
                setShowSaveButton(true);
              }}>
              Add +{" "}
            </button>
            <button
              onClick={removeTokenGatingHandler}
              className={classes.remove}>
              Remove Tokengating
            </button>
          </div>
        ) : null}

        {isAdmin && (showSaveButton || !tokenGatedDetails.length) ? (
          <button onClick={tokenGatingHandler}>Save</button>
        ) : null}
      </div>
    </div>
  );
};

export default TokenGatingList;
