import axios from "axios";
import { NETWORK_RPC_URL } from "utils/constants";
import { COVALENT_API } from "../index";

export const getTokensFromWallet = async (address, networkId) => {
  try {
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
      url: NETWORK_RPC_URL[networkId],
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

      const balances = response["result"];

      // Remove tokens with zero balance
      const nonZeroBalances = await balances.tokenBalances.filter((token) => {
        return token.tokenBalance !== "0";
      });

      let i = 1;

      for (let token of nonZeroBalances) {
        // Get balance of token
        let balance = token.tokenBalance;
        let address = token.contractAddress;

        // options for making a request to get the token metadata
        const options = {
          method: "POST",
          url: NETWORK_RPC_URL[networkId],
          headers: {
            accept: "application/json",
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

        // Print name, balance, and symbol of token

        tokenData.push({
          tokenName: tokenName,
          tokenBalance: tokenBalance,
          tokenSymbol: tokenSymbol,
          tokenAddress: address,
        });
      }

      return tokenData;
    };

    const newData = await main();
    return newData;
  } catch (error) {
    console.log(error);
  }
};

export const getBalanceOfToken = async (
  walletAddress,
  tokenAddress,
  networkId,
) => {
  try {
    const main = async () => {
      //fetching token balance

      // options for making a request to get the token metadata
      const options = {
        method: "POST",
        url: NETWORK_RPC_URL[networkId],
        headers: {
          accept: "application/json",
          "content-type": "application/json",
        },
        data: {
          id: 1,
          jsonrpc: "2.0",
          method: "alchemy_getTokenBalances",
          params: [`${walletAddress}`, [`${tokenAddress}`]],
        },
      };

      const tokenDecimal = await getTokensDecimalFromAddress(
        `${tokenAddress}`,
        networkId,
      );

      const metadata = await axios.request(options);
      let balance = metadata.data.result.tokenBalances[0].tokenBalance;

      // Compute token balance in human-readable format
      balance = balance / Math.pow(10, tokenDecimal);
      return balance;
    };

    const newData = await main();
    return newData;
  } catch (error) {
    console.log(error);
  }
};

export const getTokensDecimalFromAddress = async (address, networkId) => {
  try {
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
      url: NETWORK_RPC_URL[networkId],
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
      tokenDecimal = response.result.decimals;
      return tokenDecimal;
    };
    const result = await main();

    return tokenDecimal;
  } catch (error) {
    console.log(error);
  }
};

export const getTokenMetadata = async (address, networkId) => {
  try {
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
      url: NETWORK_RPC_URL[networkId],
      headers: {
        "Content-Type": "application/json",
      },
      data: data,
    };

    const main = async () => {
      //fetching token balance
      let response = await axios(config);
      response = response["data"];
      return response;
    };
    const result = await main();

    return result;
  } catch (error) {
    console.log(error);
  }
};

export const getTokensList = async (networkName, walletAddress) => {
  try {
    let headers = new Headers();
    headers.set("Authorization", `Bearer ${COVALENT_API}`);
    const res = await fetch(
      `https://api.covalenthq.com/v1/${networkName}/address/${walletAddress}/balances_v2/`,
      {
        method: "GET",
        headers: headers,
      },
    );
    const data = await res.json();
    return data;
  } catch (error) {
    console.log(error);
  }
};
