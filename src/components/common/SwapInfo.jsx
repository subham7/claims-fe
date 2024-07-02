import React from "react";
import { AiFillInfoCircle } from "react-icons/ai";
import { Button } from "@mui/material";
import classes from "../claims/Claim.module.scss";

const NETWORK_DATA = {
  "0x89": {
    depositType: "USDC.e",
    url: "https://quickswap.exchange/#/swap?swapIndex=0&currency0=0x3c499c542cEF5E3811e1192ce70d8cC03d5c3359&currency1=0x2791Bca1f2de4661ED88A30C99A7a9449Aa84174",
  },
  "0xa4b1": {
    depositType: "USDC",
    url: "https://app.uniswap.org/swap?inputCurrency=0xff970a61a04b1ca14834a43f5de4533ebddb5cc8&outputCurrency=0xaf88d065e77c8cc2239327c5edb3a432268e5831",
  },
};

const SwapInfo = ({ networkId }) => {
  const networkInfo = NETWORK_DATA[networkId] || {};

  return (
    <div className={classes.infoContainer}>
      <AiFillInfoCircle size={20} />
      This station only accepts {networkInfo.depositType || "N/A"} as deposits
      <br />
      <Button
        style={{
          backgroundColor: "white",
          color: "black",
          textTransform: "none",
        }}
        variant="contained"
        onClick={() =>
          networkInfo.url && window.open(networkInfo.url, "_blank")
        }>
        Get {networkInfo.depositType}
      </Button>
    </div>
  );
};

export default SwapInfo;
