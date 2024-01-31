import axios from "axios";
import { COVALENT_API, MAIN_API_URL } from "../index";

const MANTA_API_URL = process.env.NEXT_PUBLIC_MANTA_API_URL;
export const NFT_STORAGE_TOKEN = process.env.NEXT_PUBLIC_NFT_STORAGE_TOKEN;

export const getTokensList = async (networkName, walletAddress) => {
  try {
    let headers = new Headers();
    headers.set("Authorization", `Bearer ${COVALENT_API}`);
    const res = await fetch(
      MAIN_API_URL +
        `external/covalent/tokenList?networkName=${networkName}&walletAddress=${walletAddress}`,
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

export const getTokensListOfManta = async (walletAddress) => {
  try {
    return await axios.get(
      `${MANTA_API_URL}?module=account&action=tokenlist&address=${walletAddress}`,
    );
  } catch (error) {
    console.log(error);
  }
};

export const getTokensListBeraChain = async (walletAddress) => {
  try {
    return await axios.get(
      // `https://api.routescan.io/v2/network/testnet/evm/80085/etherscan/api?module=account&action=addresstokenbalance&address=${"0x77949783f407a6206883f93302800554d492e953"}`,
      `https://api.routescan.io/v2/network/testnet/evm/80085/etherscan/api?module=account&action=addresstokenbalance&address=${walletAddress}`,
    );
  } catch (error) {
    console.log(error);
  }
};

export const getTotalNumberOfTokenHolders = async (
  networkName,
  tokenAddress,
) => {
  try {
    let headers = new Headers();
    headers.set("Authorization", `Bearer ${COVALENT_API}`);
    const res = await fetch(
      `https://api.covalenthq.com/v1/${networkName}/tokens/${tokenAddress}/token_holders_v2/`,
      {
        method: "GET",
        headers: headers,
      },
    );
    const data = await res.json();
    return data.data.pagination.total_count;
  } catch (error) {
    console.log(error);
  }
};
