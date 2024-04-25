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

const TokenGatingList = ({
  daoAddress,
  setLoading,
  setIsTokenGated,
  routeNetworkId,
}) => {
  const [tokenGatedDetails, setTokenGatedDetails] = useState([]);
  const [operator, setOperator] = useState(0);
  const [addNewTokenDetails, setAddNewTokenDetails] = useState([
    {
      address: "",
      amount: 0,
    },
  ]);
  const [showErrorText, setShowErrorText] = useState(false);

  const isAdmin = useSelector((state) => {
    return state.gnosis.adminUser;
  });

  const { setupTokenGating, getTokenGatingDetails, disableTokenGating } =
    useAppContractMethods({
      daoAddress,
      routeNetworkId,
    });
  const { getDecimals, getTokenSymbol } = useCommonContractMethods({
    daoAddress,
  });

  const dispatch = useDispatch();

  const dispatchAlert = (message, severity) => {
    dispatch(setAlertData(generateAlertData(message, severity)));
  };

  const fetchGatedData = async (tokenData) => {
    const promises = tokenData.tokens.map(async (address, index) => {
      let decimal;

      try {
        decimal = await getDecimals(address);
      } catch (error) {
        decimal = null;
      }

      const value = tokenData.value[index].toString();
      const convertedAmount = decimal
        ? convertFromWeiGovernance(value, decimal)
        : value.toString();

      return {
        address,
        amount: convertedAmount.toString(),
        decimal: decimal ?? null,
      };
    });

    return Promise.all(promises);
  };

  const fetchData = async (tokensData) => {
    const promises = tokensData.map(async (token) => {
      let symbol, decimal;

      try {
        symbol = await getTokenSymbol(token.address);
      } catch (error) {
        console.log(error);
      }

      try {
        decimal = await getDecimals(token.address);
      } catch (error) {
        decimal = null;
      }

      return {
        ...token,
        symbol,
        decimal,
        convertedAmount: decimal
          ? convertToWeiGovernance(token.amount, decimal)
          : token.amount,
      };
    });
    return Promise.all(promises);
  };

  const tokenGatingHandler = async () => {
    try {
      setLoading(true);

      const data = await fetchData([
        ...addNewTokenDetails,
        ...tokenGatedDetails,
      ]);
      const invalidToken = data.find((token) => !token.symbol);

      if (invalidToken) {
        setShowErrorText(true);
        setLoading(false);
        return;
      } else {
        setShowErrorText(false);
      }

      const amounts = data.map((token) => token.convertedAmount);
      const addresses = data.map((token) => token.address);

      await setupTokenGating({
        addresses: addresses,
        amounts: amounts,
        operator: operator,
      });
      fetchTokenGatingDetails();
      setLoading(false);
      dispatchAlert("Token gated successfully", "success");
      setAddNewTokenDetails([
        {
          address: "",
          amount: 0,
        },
      ]);
      setIsTokenGated(true);
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
      setAddNewTokenDetails([
        {
          address: "",
          amount: 0,
        },
      ]);
      dispatchAlert("Token gating removed successfully", "success");
      setLoading(false);
      setIsTokenGated(false);
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

      const data = await fetchGatedData(details);
      setTokenGatedDetails(data);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    fetchTokenGatingDetails();
  }, [daoAddress]);

  return (
    <div
      style={{
        display: "flex",
      }}>
      <div className={classes.treasurySignerContainer}>
        {tokenGatedDetails?.length
          ? tokenGatedDetails.map((item, index) => (
              <div
                key={index}
                style={{ margin: "4px 0" }}
                className={classes.copyTextContainer}>
                <input
                  value={item.address}
                  placeholder="Contract address"
                  className={classNames(classes.input, classes.address)}
                  disabled
                />
                <input
                  type="number"
                  value={item.amount}
                  placeholder="0"
                  disabled
                  className={classNames(classes.input, classes.percentage)}
                />
              </div>
            ))
          : null}

        {isAdmin &&
          addNewTokenDetails.map((data, key) => (
            <div
              key={key}
              style={{ margin: "4px 0" }}
              className={classes.copyTextContainer}>
              <input
                onChange={(e) => {
                  const address = e.target.value;
                  const list = [...addNewTokenDetails];
                  list[key].address = address;
                  setAddNewTokenDetails(list);
                }}
                value={addNewTokenDetails[key].address}
                disabled={!isAdmin}
                placeholder="Contract address"
                className={classNames(classes.input, classes.address)}
              />
              <input
                type="number"
                onChange={(e) => {
                  const amount = e.target.value;
                  const list = [...addNewTokenDetails];
                  list[key].amount = amount;
                  setAddNewTokenDetails(list);
                }}
                value={addNewTokenDetails[key].amount}
                placeholder="0"
                disabled={!isAdmin}
                className={classNames(classes.input, classes.percentage)}
              />

              {addNewTokenDetails.length > 1 || tokenGatedDetails.length ? (
                <RxCross2
                  onClick={() => {
                    const list = [...addNewTokenDetails];
                    list.splice(key, 1);
                    setAddNewTokenDetails(list);
                  }}
                  className={classNames(classes.icon)}
                />
              ) : null}
            </div>
          ))}

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

        {/* {isAdmin && showAddButton && tokenGatedDetails.length ? ( */}

        {isAdmin ? (
          <div className={classes.copyTextContainer}>
            <button
              onClick={() => {
                setAddNewTokenDetails([
                  ...addNewTokenDetails,
                  {
                    address: "",
                    amount: "",
                  },
                ]);
              }}>
              Add +{" "}
            </button>
            <button className={classes.saveButton} onClick={tokenGatingHandler}>
              Save
            </button>

            {tokenGatedDetails.length >= 1 ? (
              <button
                onClick={removeTokenGatingHandler}
                className={classes.remove}>
                Remove Tokengating
              </button>
            ) : null}
          </div>
        ) : null}
      </div>

      <div>
        <select
          disabled={!isAdmin}
          onChange={(e) => {
            setOperator(e.target.value);
          }}
          style={{
            width: "100px",
            marginTop: "4px",
            marginLeft: "12px",
          }}
          className={classes.input}>
          <option selected value={0}>
            AND
          </option>
          <option value={1}>OR</option>
        </select>
      </div>
    </div>
  );
};

export default TokenGatingList;
