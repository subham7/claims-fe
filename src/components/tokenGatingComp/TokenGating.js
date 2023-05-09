import {
  Alert,
  Backdrop,
  CircularProgress,
  Grid,
  Switch,
  Typography,
} from "@mui/material";
import React, { useCallback, useEffect, useState } from "react";
import { TokenGatingStyle } from "./TokenGatingStyles";
import { MdEdit } from "react-icons/md";
import TokenGatingModal from "./TokenGatingModal";
import { useSelector } from "react-redux";
import FactoryContractABI from "../../abis/newArch/factoryContract.json";
import ERC20ABI from "../../abis/usdcTokenContract.json";

import SingleToken from "./SingleToken";
import { SmartContract } from "../../api/contract";
import Web3 from "web3";
import { useConnectWallet } from "@web3-onboard/react";
import { NEW_FACTORY_ADDRESS } from "../../api";
import { useRouter } from "next/router";
import {
  convertFromWeiGovernance,
  convertToWeiGovernance,
} from "../../utils/globalFunctions";
import ClubFetch from "../../utils/clubFetch";

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

  let walletAddress;
  const router = useRouter();
  const classes = TokenGatingStyle();
  const { clubId: daoAddress } = router.query;

  if (typeof window !== undefined) {
    walletAddress = Web3.utils.toChecksumAddress(wallet?.accounts[0].address);
  }

  const GNOSIS_TRANSACTION_URL = useSelector((state) => {
    return state.gnosis.transactionUrl;
  });

  const USDC_CONTRACT_ADDRESS = useSelector((state) => {
    return state.gnosis.usdcContractAddress;
  });

  const addTokensHandler = () => {
    setShowTokenGatingModal(true);
  };

  const chooseTokens = (currentToken) => {
    console.log("Current TOkens", currentToken);
    setTokensList([...tokensList, currentToken]);
  };

  const tokenGatingHandler = async () => {
    try {
      setLoading(true);
      const factoryContract = new SmartContract(
        FactoryContractABI,
        NEW_FACTORY_ADDRESS,
        walletAddress,
        USDC_CONTRACT_ADDRESS,
        GNOSIS_TRANSACTION_URL,
      );

      console.log("Factory Contract", factoryContract);

      console.log(tokensList[0].tokenAddress);

      console.log("Checked", checked ? 1 : 0);

      const res = await factoryContract.setupTokenGating(
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
        Web3.utils.toChecksumAddress(daoAddress),
      );
      console.log(res);
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
      const factoryContract = new SmartContract(
        FactoryContractABI,
        NEW_FACTORY_ADDRESS,
        walletAddress,
        USDC_CONTRACT_ADDRESS,
        GNOSIS_TRANSACTION_URL,
      );

      console.log("Factory Contract", factoryContract);

      const tokenGatingDetails = await factoryContract.getTokenGatingDetails(
        daoAddress,
      );
      console.log("TOken Gating details", tokenGatingDetails[0]);
      setFetchedDetails({
        tokenA: tokenGatingDetails[0]?.tokenA,
        tokenB: tokenGatingDetails[0]?.tokenB,
        tokenAAmt: tokenGatingDetails[0]?.value[0],
        tokenBAmt: tokenGatingDetails[0]?.value[1],
        operator: tokenGatingDetails[0]?.operator,
        comparator: tokenGatingDetails[0]?.comparator,
      });

      const tokenAContract = new SmartContract(
        ERC20ABI,
        tokenGatingDetails[0].tokenA,
        walletAddress,
        USDC_CONTRACT_ADDRESS,
        GNOSIS_TRANSACTION_URL,
      );

      const tokenBContract = new SmartContract(
        ERC20ABI,
        tokenGatingDetails[0].tokenB,
        walletAddress,
        USDC_CONTRACT_ADDRESS,
        GNOSIS_TRANSACTION_URL,
      );

      const tokenASymbol = await tokenAContract.symbol();
      const tokenBSymbol = await tokenBContract.symbol();
      const tokenADecimal = await tokenAContract.decimals();
      const tokenBDecimal = await tokenBContract.decimals();

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
  }, [
    walletAddress,
    USDC_CONTRACT_ADDRESS,
    GNOSIS_TRANSACTION_URL,
    daoAddress,
  ]);

  useEffect(() => {
    fetchTokenGatingDetials();
  }, [fetchTokenGatingDetials]);

  console.log("FETCHED DEIAls", fetchedDetails);

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
                    {console.log("Tokennnnn", tokensList)}
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
            onClick={addTokensHandler}
          >
            +
          </button>
        )}
      </div>

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
              console.log(e.target.checked);
              setChecked(e.target.checked);
            }}
            checkedIcon={
              <div
                style={{
                  background: "#C64988",
                  height: "25px",
                  width: "25px",
                  borderRadius: "100px",
                }}
              ></div>
            }
          />
          <p>any</p>
        </div>

        <p>condition(s)</p>
      </div>

      {isAdminUser ? (
        <button
          className={classes.saveBtn}
          disabled={!tokensList.length}
          onClick={tokenGatingHandler}
        >
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
          }}
        >
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
          }}
        >
          Token Gating Failed
        </Alert>
      )}
    </div>
  );
};

export default TokenGating;
