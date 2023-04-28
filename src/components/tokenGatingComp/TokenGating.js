import { Grid, Switch, Typography } from "@mui/material";
import React, { useEffect, useState } from "react";
import { TokenGatingStyle } from "./TokenGatingStyles";
import { MdEdit } from "react-icons/md";
import TokenGatingModal from "./TokenGatingModal";
import { useSelector } from "react-redux";
import SingleToken from "./SingleToken";

const tokens = [
  {
    tokenSymbol: "USDC",
    tokenAmount: 100,
    tokenAddress: "0x00000",
  },
  {
    tokenSymbol: "USDT",
    tokenAmount: 120,
    tokenAddress: "0x000900",
  },
];

const TokenGating = () => {
  const classes = TokenGatingStyle();

  const [showTokenGatingModal, setShowTokenGatingModal] = useState(false);

  const addTokensHandler = () => {
    setShowTokenGatingModal(true);
  };

  return (
    <div className={classes.container}>
      <div className={classes.heading}>
        <p className={classes.title}>Token Gating</p>
        <div className={classes.icon}>
          <MdEdit size={20} />
        </div>
      </div>

      <div className={classes.conditions}>
        <div className={classes.tokensList}>
          {tokens?.length ? (
            tokens.map((token) => (
              <SingleToken
                key={token.tokenAddress}
                tokenAmount={token.tokenAmount}
                tokenSymbol={token.tokenSymbol}
                tokenAddress={token.tokenAddress}
              />
            ))
          ) : (
            <p className={classes.conditionTxt}>No conditions added</p>
          )}
        </div>

        <button className={classes.addBtn} onClick={addTokensHandler}>
          +
        </button>
      </div>

      <div className={classes.switchContainer}>
        <div className={classes.match}>
          <p>Match</p>
          <Switch size={"large"} />
          <p>any</p>
        </div>

        <p>condition(s)</p>
      </div>

      <button className={classes.saveBtn}>Save changes</button>

      {showTokenGatingModal && (
        <TokenGatingModal
          closeModal={() => {
            setShowTokenGatingModal(false);
          }}
        />
      )}
    </div>
  );
};

export default TokenGating;
