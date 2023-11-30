import { Switch } from "@mui/material";
import { Button } from "@components/ui";
import React, { useCallback, useEffect, useState } from "react";
import { TokenGatingStyle } from "./TokenGatingStyles";
import { MdDelete } from "react-icons/md";
import TokenGatingModal from "./TokenGatingModal";
import { useDispatch, useSelector } from "react-redux";
import SingleToken from "./SingleToken";
import {
  convertFromWeiGovernance,
  convertToWeiGovernance,
} from "../../utils/globalFunctions";
import useAppContractMethods from "../../hooks/useAppContractMethods";
import useCommonContractMethods from "hooks/useCommonContractMehods";
import BackdropLoader from "@components/common/BackdropLoader";
import { setAlertData } from "redux/reducers/alert";

const TokenGating = ({ daoAddress }) => {
  const [showTokenGatingModal, setShowTokenGatingModal] = useState(false);
  const [checked, setChecked] = useState(false);
  const [fetchedDetails, setFetchedDetails] = useState({
    tokenA: "",
    tokenB: "",
    tokenAAmt: 0,
    tokenBAmt: 0,
    operator: 0,
    comparator: 0,
  });
  const [displayTokenDetails, setDisplayTokenDetails] = useState({
    tokenASymbol: "",
    tokenBSymbol: "",
    tokenADecimal: 0,
    tokenBDecimal: 0,
  });
  const [tokensList, setTokensList] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showEditOptions, setShowEditOptions] = useState(true);

  const isAdminUser = useSelector((state) => {
    return state.gnosis.adminUser;
  });

  const classes = TokenGatingStyle();
  const dispatch = useDispatch();

  const { getTokenGatingDetails, setupTokenGating, disableTokenGating } =
    useAppContractMethods({
      daoAddress,
    });

  const { getTokenSymbol, getDecimals } = useCommonContractMethods();

  const addTokensHandler = () => {
    setShowTokenGatingModal(true);
  };

  const chooseTokens = (currentToken) => {
    setTokensList([...tokensList, currentToken]);
  };

  const tokenGatingHandler = async () => {
    try {
      setLoading(true);
      await setupTokenGating(
        tokensList[0].tokenAddress,
        tokensList[1]?.tokenAddress
          ? tokensList[1]?.tokenAddress
          : tokensList[0]?.tokenAddress,
        checked ? 1 : 0, // Operator for token checks (0 for AND and 1 for OR)
        0, // 0 for Greater, 1 for Below and 2 for Equal,
        [
          tokensList[0].tokenDecimal === 0
            ? tokensList[0].tokenAmount
            : convertToWeiGovernance(
                tokensList[0].tokenAmount,
                tokensList[0].tokenDecimal,
              ),

          // only if second token added
          tokensList[1]?.tokenAmount > 0
            ? tokensList[1]?.tokenAmount && tokensList[1]?.tokenDecimal === 0
              ? tokensList[1]?.tokenAmount
              : convertToWeiGovernance(
                  tokensList[1]?.tokenAmount,
                  tokensList[1]?.tokenDecimal,
                )
            : tokensList[0]?.tokenDecimal === 0
            ? tokensList[0]?.tokenAmount
            : convertToWeiGovernance(
                tokensList[0]?.tokenAmount,
                tokensList[0]?.tokenDecimal,
              ),
        ], // Minimum user balance of tokenA & tokenB
      );
      fetchTokenGatingDetails();
      setLoading(false);
      setShowEditOptions(false);
      dispatch(
        setAlertData({
          open: true,
          message: "Token Gating Successfull",
          severity: "success",
        }),
      );
    } catch (error) {
      console.log(error);
      setLoading(false);
      dispatch(
        setAlertData({
          open: true,
          message: "Token Gating failed",
          severity: "success",
        }),
      );
    }
  };

  const fetchTokenGatingDetails = useCallback(async () => {
    try {
      setLoading(true);
      const tokenGatingDetails = await getTokenGatingDetails();

      setFetchedDetails({
        tokenA: tokenGatingDetails[0]?.tokenA,
        tokenB: tokenGatingDetails[0]?.tokenB,
        tokenAAmt: tokenGatingDetails[0]?.value[0],
        tokenBAmt: tokenGatingDetails[0]?.value[1],
        operator: tokenGatingDetails[0]?.operator,
        comparator: tokenGatingDetails[0]?.comparator,
      });

      const tokenASymbol = await getTokenSymbol(tokenGatingDetails[0].tokenA);
      const tokenBSymbol = await getTokenSymbol(tokenGatingDetails[0]?.tokenB);

      let tokenADecimal, tokenBDecimal;

      try {
        tokenADecimal = await getDecimals(tokenGatingDetails[0]?.tokenA);
      } catch (error) {
        console.log(error);
      }

      try {
        tokenBDecimal = await getDecimals(tokenGatingDetails[0]?.tokenB);
      } catch (error) {
        console.log(error);
      }

      setDisplayTokenDetails({
        tokenASymbol: tokenASymbol,
        tokenBSymbol: tokenBSymbol,
        tokenADecimal: tokenADecimal ? tokenADecimal : 0,
        tokenBDecimal: tokenBDecimal ? tokenBDecimal : 0,
      });
      setLoading(false);
    } catch (error) {
      console.log(error);
      setLoading(false);
    }
  }, [daoAddress]);

  useEffect(() => {
    fetchTokenGatingDetails();
  }, [fetchTokenGatingDetails]);

  return (
    <div className={classes.container}>
      <div className={classes.heading}>
        <p className={classes.title}>Token Gating</p>

        {isAdminUser && fetchedDetails?.tokenA?.length ? (
          <div
            onClick={async () => {
              try {
                setLoading(true);
                await disableTokenGating();
                await fetchTokenGatingDetails();
                setFetchedDetails({
                  tokenA: "",
                  tokenB: "",
                  tokenAAmt: 0,
                  tokenBAmt: 0,
                  operator: 0,
                  comparator: 0,
                });
                setLoading(false);
              } catch (error) {
                setLoading(false);
              }
            }}
            className={classes.icon}>
            <MdDelete size={20} />
          </div>
        ) : null}
      </div>

      <div className={classes.conditions}>
        <div className={classes.tokensList}>
          {!fetchedDetails?.tokenA?.length || tokensList.length ? (
            <>
              {tokensList?.length ? (
                tokensList?.map((token) => (
                  <>
                    <SingleToken
                      key={token.tokenAddress}
                      tokenAmount={token.tokenAmount}
                      tokenSymbol={token.tokenSymbol}
                      tokenAddress={token.tokenAddress}
                    />
                  </>
                ))
              ) : (
                <p className={classes.conditionTxt}>No conditions added</p>
              )}
            </>
          ) : (
            <>
              {fetchedDetails.tokenA === fetchedDetails.tokenB &&
              fetchedDetails.tokenAAmt === fetchedDetails.tokenBAmt ? (
                <>
                  {" "}
                  <SingleToken
                    tokenAddress={fetchedDetails.tokenA}
                    tokenSymbol={displayTokenDetails.tokenASymbol}
                    tokenAmount={
                      displayTokenDetails?.tokenADecimal === 0
                        ? fetchedDetails.tokenAAmt
                        : convertFromWeiGovernance(
                            fetchedDetails.tokenAAmt,
                            displayTokenDetails.tokenADecimal,
                          )
                    }
                  />
                </>
              ) : (
                <>
                  <SingleToken
                    tokenAddress={fetchedDetails.tokenA}
                    tokenSymbol={displayTokenDetails.tokenASymbol}
                    tokenAmount={
                      displayTokenDetails.tokenADecimal
                        ? convertFromWeiGovernance(
                            fetchedDetails.tokenAAmt,
                            displayTokenDetails.tokenADecimal,
                          )
                        : fetchedDetails.tokenAAmt
                    }
                  />
                  <SingleToken
                    tokenAddress={fetchedDetails.tokenB}
                    tokenSymbol={displayTokenDetails.tokenBSymbol}
                    tokenAmount={
                      displayTokenDetails.tokenBDecimal
                        ? convertFromWeiGovernance(
                            fetchedDetails.tokenBAmt,
                            displayTokenDetails.tokenBDecimal,
                          )
                        : convertFromWeiGovernance(
                            fetchedDetails.tokenBAmt,
                            displayTokenDetails.tokenADecimal,
                          )
                    }
                  />
                </>
              )}
            </>
          )}
        </div>

        {isAdminUser &&
        (fetchedDetails.tokenA === "" || fetchedDetails.tokenA === undefined) &&
        showEditOptions ? (
          <button
            className={classes.addBtn}
            disabled={fetchedDetails?.tokenA || tokensList.length >= 2}
            onClick={addTokensHandler}>
            +
          </button>
        ) : (
          ""
        )}
      </div>

      {isAdminUser &&
      (fetchedDetails.tokenA === "" || fetchedDetails.tokenA === undefined) &&
      showEditOptions ? (
        <div className={classes.switchContainer}>
          <div className={classes.match}>
            <p>Match</p>
            <Switch
              checked={
                fetchedDetails &&
                !tokensList.length &&
                fetchedDetails.operator == 0
                  ? false
                  : fetchedDetails.operator == 1
                  ? true
                  : checked
              }
              onChange={(e) => {
                setChecked(e.target.checked);
              }}
              checkedIcon={
                <div
                  style={{
                    background: "#2D55FF",
                    height: "25px",
                    width: "25px",
                    borderRadius: "100px",
                  }}></div>
              }
            />
            <p>any condition(s)</p>
          </div>
          <Button disabled={!tokensList.length} onClick={tokenGatingHandler}>
            Save changes
          </Button>
        </div>
      ) : (
        ""
      )}

      {showTokenGatingModal && (
        <TokenGatingModal
          closeModal={() => {
            setShowTokenGatingModal(false);
          }}
          chooseTokens={chooseTokens}
        />
      )}

      <BackdropLoader isOpen={loading} />
    </div>
  );
};

export default TokenGating;
