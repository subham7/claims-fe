import { Alert, Backdrop, CircularProgress, Switch } from "@mui/material";
import React, { useCallback, useEffect, useState } from "react";
import { TokenGatingStyle } from "./TokenGatingStyles";
import { MdEdit } from "react-icons/md";
import TokenGatingModal from "./TokenGatingModal";
import { useSelector } from "react-redux";
import SingleToken from "./SingleToken";
import { useConnectWallet } from "@web3-onboard/react";
import { useRouter } from "next/router";
import {
  convertFromWeiGovernance,
  convertToWeiGovernance,
} from "../../utils/globalFunctions";
import useSmartContractMethods from "../../hooks/useSmartContractMethods";

const TokenGating = () => {
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
  const [isTokenGatingSuccessfull, setIsTokenGatingSuccessfull] =
    useState(false);
  const [showMessage, setShowMessage] = useState(false);

  const [{ wallet }] = useConnectWallet();

  const isAdminUser = useSelector((state) => {
    return state.gnosis.adminUser;
  });

  const router = useRouter();
  const classes = TokenGatingStyle();
  const { clubId: daoAddress } = router.query;

  const walletAddress = wallet?.accounts[0].address;

  const GNOSIS_TRANSACTION_URL = useSelector((state) => {
    return state.gnosis.transactionUrl;
  });

  const USDC_CONTRACT_ADDRESS = useSelector((state) => {
    return state.gnosis.usdcContractAddress;
  });

  const {
    getTokenGatingDetails,
    setupTokenGating,
    getTokenSymbol,
    getDecimals,
  } = useSmartContractMethods();

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
          convertToWeiGovernance(
            tokensList[0].tokenAmount,
            tokensList[0].tokenDecimal,
          ),
          convertToWeiGovernance(
            tokensList[1]?.tokenAmount
              ? tokensList[1]?.tokenAmount
              : tokensList[0]?.tokenAmount,
            tokensList[1]?.tokenDecimal
              ? tokensList[1]?.tokenDecimal
              : tokensList[0].tokenDecimal,
          ),
        ], // Minimum user balance of tokenA & tokenB
        daoAddress,
      );
      setLoading(false);
      setIsTokenGatingSuccessfull(true);
      showMessageHandler();
    } catch (error) {
      console.log(error);
      setLoading(false);
      setIsTokenGatingSuccessfull(false);
      showMessageHandler();
    }
  };

  const showMessageHandler = () => {
    setShowMessage(true);
    setTimeout(() => {
      setShowMessage(false);
    }, 4000);
  };

  const fetchTokenGatingDetials = useCallback(async () => {
    try {
      setLoading(true);
      const tokenGatingDetails = await getTokenGatingDetails(daoAddress);
      setFetchedDetails({
        tokenA: tokenGatingDetails[0]?.tokenA,
        tokenB: tokenGatingDetails[0]?.tokenB,
        tokenAAmt: tokenGatingDetails[0]?.value[0],
        tokenBAmt: tokenGatingDetails[0]?.value[1],
        operator: tokenGatingDetails[0]?.operator,
        comparator: tokenGatingDetails[0]?.comparator,
      });

      const tokenASymbol = await getTokenSymbol(tokenGatingDetails[0].tokenA);
      const tokenBSymbol = await getTokenSymbol(tokenGatingDetails[0].tokenB);
      const tokenADecimal = await getDecimals(tokenGatingDetails[0].tokenA);
      const tokenBDecimal = await getDecimals(tokenGatingDetails[0].tokenB);

      setDisplayTokenDetails({
        tokenASymbol: tokenASymbol,
        tokenBSymbol: tokenBSymbol,
        tokenADecimal: tokenADecimal,
        tokenBDecimal: tokenBDecimal,
      });
      setLoading(false);
    } catch (error) {
      console.log(error);
      setLoading(false);
    }
  }, [daoAddress]);

  useEffect(() => {
    fetchTokenGatingDetials();
  }, [fetchTokenGatingDetials]);

  return (
    <div className={classes.container}>
      <div className={classes.heading}>
        <p className={classes.title}>Token Gating</p>

        {isAdminUser && (
          <div className={classes.icon}>
            <MdEdit size={20} />
          </div>
        )}
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
                    tokenAmount={convertFromWeiGovernance(
                      fetchedDetails.tokenAAmt,
                      displayTokenDetails.tokenADecimal,
                    )}
                  />
                </>
              ) : (
                <>
                  <SingleToken
                    tokenAddress={fetchedDetails.tokenA}
                    tokenSymbol={displayTokenDetails.tokenASymbol}
                    tokenAmount={convertFromWeiGovernance(
                      fetchedDetails.tokenAAmt,
                      displayTokenDetails.tokenADecimal,
                    )}
                  />
                  <SingleToken
                    tokenAddress={fetchedDetails.tokenB}
                    tokenSymbol={displayTokenDetails.tokenBSymbol}
                    tokenAmount={convertFromWeiGovernance(
                      fetchedDetails.tokenBAmt,
                      displayTokenDetails.tokenBDecimal,
                    )}
                  />
                </>
              )}
            </>
          )}
        </div>

        {isAdminUser && (
          <button
            className={classes.addBtn}
            disabled={fetchedDetails?.tokenA || tokensList.length >= 2}
            onClick={addTokensHandler}>
            +
          </button>
        )}
      </div>

      {isAdminUser && (
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
                    background: "#C64988",
                    height: "25px",
                    width: "25px",
                    borderRadius: "100px",
                  }}></div>
              }
            />
            <p>any</p>
          </div>

          <p>condition(s)</p>
        </div>
      )}

      {isAdminUser ? (
        <button
          className={classes.saveBtn}
          disabled={!tokensList.length}
          onClick={tokenGatingHandler}>
          Save changes
        </button>
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

      <Backdrop sx={{ color: "#fff", zIndex: 1000 }} open={loading}>
        <CircularProgress color="inherit" />
      </Backdrop>

      {showMessage && isTokenGatingSuccessfull && (
        <Alert
          severity="success"
          sx={{
            width: "250px",
            position: "fixed",
            bottom: "30px",
            right: "20px",
            borderRadius: "8px",
          }}>
          Token Gating Successfull
        </Alert>
      )}

      {showMessage && !isTokenGatingSuccessfull && (
        <Alert
          severity="error"
          sx={{
            width: "250px",
            position: "fixed",
            bottom: "30px",
            right: "20px",
            borderRadius: "8px",
          }}>
          Token Gating Failed
        </Alert>
      )}
    </div>
  );
};

export default TokenGating;
