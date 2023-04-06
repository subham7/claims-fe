import axios from "axios";
import { GOERLI_RPC_URL } from "../index";

export const getTokensFromWallet = async (address) => {
  const data = JSON.stringify({
    jsonrpc: "2.0",
    method: "alchemy_getTokenBalances",
    headers: {
      "Content-Type": "application/json",
    },
    params: [`${address}`],
    id: 42,
  });

  const config = {
    method: "post",
    url: GOERLI_RPC_URL,
    headers: {
      "Content-Type": "application/json",
    },
    data: data,
  };

  let tokenName, tokenBalance, tokenSymbol;
  const tokenData = [];

  const main = async () => {
    //fetching token balance
    let response = await axios(config);
    response = response["data"];

    // tokens.map(token => console.log(token.contractAddress))
    // Getting balances
    const balances = response["result"];

    // Remove tokens with zero balance
    const nonZeroBalances = await balances.tokenBalances.filter((token) => {
      return token.tokenBalance !== "0";
    });

    console.log(`Token balances of ${address}: \n`);

    let i = 1;

    for (let token of nonZeroBalances) {
      // Get balance of token
      let balance = token.tokenBalance;
      let address = token.contractAddress;

      // options for making a request to get the token metadata
      const options = {
        method: "POST",
        url: GOERLI_RPC_URL,
        headers: {
          "accept": "application/json",
          "content-type": "application/json",
        },
        data: {
          id: 1,
          jsonrpc: "2.0",
          method: "alchemy_getTokenMetadata",
          params: [token.contractAddress],
        },
      };

      const metadata = await axios.request(options);

      // Compute token balance in human-readable format
      balance = balance / Math.pow(10, metadata["data"]["result"].decimals);
      tokenBalance = balance.toFixed(2);

      tokenName = metadata["data"]["result"].name;
      tokenSymbol = metadata["data"]["result"].symbol;
      // console.log(metadata["data"])
      // Print name, balance, and symbol of token

      tokenData.push({
        tokenName: tokenName,
        tokenBalance: tokenBalance,
        tokenSymbol: tokenSymbol,
        tokenAddress: address,
      });

      //   console.log(`${i++}. ${tokenName}: ${tokenBalance} ${tokenSymbol}`);
    }

    return tokenData;
  };

  const newData = await main();
  return newData;
};

export const getBalanceOfToken = async (walletAddress, tokenAddress) => {
  const main = async () => {
    //fetching token balance

    // options for making a request to get the token metadata
    const options = {
      method: "POST",
      url: GOERLI_RPC_URL,
      headers: {
        "accept": "application/json",
        "content-type": "application/json",
      },
      data: {
        id: 1,
        jsonrpc: "2.0",
        method: "alchemy_getTokenBalances",
        params: [`${walletAddress}`, [`${tokenAddress}`]],
      },
    };

    const tokenDecimal = await getTokensDecimalFromAddress(`${tokenAddress}`);

    const metadata = await axios.request(options);
    let balance = metadata.data.result.tokenBalances[0].tokenBalance;

    // Compute token balance in human-readable format
    balance = balance / Math.pow(10, tokenDecimal);
    return balance;
  };

  const newData = await main();
  return newData;
};

export const getTokensDecimalFromAddress = async (address) => {
  const data = JSON.stringify({
    jsonrpc: "2.0",
    method: "alchemy_getTokenMetadata",
    headers: {
      "Content-Type": "application/json",
    },
    params: [`${address}`],
    id: 1,
  });

  const config = {
    method: "post",
    url: GOERLI_RPC_URL,
    headers: {
      "Content-Type": "application/json",
    },
    data: data,
  };
  let tokenDecimal;

  const main = async () => {
    //fetching token balance
    let response = await axios(config);
    response = response["data"];
    console.log(response);
    tokenDecimal = response.result.decimals;
    return tokenDecimal;
    //   console.log(`${i++}. ${tokenName}: ${tokenBalance} ${tokenSymbol}`);
  };
  const result = await main();

  return tokenDecimal;
};

export const getTokenMetadata = async (address) => {
  const data = JSON.stringify({
    jsonrpc: "2.0",
    method: "alchemy_getTokenMetadata",
    headers: {
      "Content-Type": "application/json",
    },
    params: [`${address}`],
    id: 42,
  });

  const config = {
    method: "post",
    url: GOERLI_RPC_URL,
    headers: {
      "Content-Type": "application/json",
    },
    data: data,
  };

  const main = async () => {
    //fetching token balance
    let response = await axios(config);
    response = response["data"];
    console.log(response);
    return response;
    //   console.log(`${i++}. ${tokenName}: ${tokenBalance} ${tokenSymbol}`);
  };
  const result = await main();

  return result;
};
