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
import { useDispatch } from "react-redux";

const TokenGatingList = ({ daoAddress, setLoading }) => {
  const [showAddButton, setShowAddButton] = useState(true);
  const [showSaveButton, setShowSaveButton] = useState(false);
  const [tokenGatedDetails, setTokenGatedDetails] = useState([]);
  const [tokenGatingDetails, setTokenGatingDetails] = useState({
    address: "",
    amount: 0,
  });

  const { setupTokenGating, getTokenGatingDetails } = useAppContractMethods({
    daoAddress,
  });
  const { getDecimals } = useCommonContractMethods({
    daoAddress,
  });

  const dispatch = useDispatch();

  const dispatchAlert = (message, severity) => {
    dispatch(setAlertData(generateAlertData(message, severity)));
  };

  const tokenGatingHandler = async () => {
    try {
      setLoading(true);
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
        [convertedAmount, convertedAmount],
      );
      fetchTokenGatingDetails();
      setLoading(false);
      dispatchAlert("Deadline updated successfully", "success");
    } catch (error) {
      console.error(error);
      setLoading(false);
      if (error.code === 4001) {
        dispatchAlert("Metamask Signature denied", "error");
      } else {
        dispatchAlert("Deadline updation failed", "error");
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
                  convertFromWeiGovernance(item.value, item.decimal),
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
              className={classNames(classes.input, classes.percentage)}
            />

            <RxCross2
              onClick={() => {
                setShowAddButton(true);
                setShowSaveButton(false);
              }}
              className={classNames(classes.icon)}
            />
          </div>
        ) : null}

        {showAddButton && tokenGatedDetails.length ? (
          <button
            onClick={() => {
              setShowAddButton(false);
              setShowSaveButton(true);
            }}>
            Add +{" "}
          </button>
        ) : null}

        {showSaveButton || !tokenGatedDetails.length ? (
          <button onClick={tokenGatingHandler}>Save</button>
        ) : null}
      </div>
    </div>
  );
};

export default TokenGatingList;
