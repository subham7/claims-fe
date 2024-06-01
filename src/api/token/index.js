import axios from "axios";
import { COVALENT_API, MAIN_API_URL, NFT_SCAN_KEY } from "../index";

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
      `https://api.routescan.io/v2/network/testnet/evm/80085/etherscan/api?module=account&action=addresstokenbalance&address=${walletAddress}`,
    );
  } catch (error) {
    console.log(error);
  }
};

export const getTokensListBlast = async (walletAddress) => {
  try {
    return await axios.get(
      `https://api.routescan.io/v2/network/testnet/evm/168587773/etherscan/api?module=account&action=addresstokenbalance&address=${walletAddress}`,
    );
  } catch (error) {
    console.log(error);
  }
};

export const getTokensListBlastMainnet = async (walletAddress) => {
  try {
    return await axios.get(
      `https://api.routescan.io/v2/network/mainnet/evm/81457/etherscan/api?module=account&action=addresstokenbalance&address=${walletAddress}`,
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

export const getErc1155TokenId = async (walletAddress, contractAddress) => {
  try {
    let headers = new Headers();
    headers.set("X-API-KEY", NFT_SCAN_KEY);

    const res = await fetch(
      `https://baseapi.nftscan.com/api/v2/account/own/${walletAddress}?erc_type=erc1155&show_attribute=false&contract_address=${contractAddress}`,
      {
        method: "GET",
        headers: headers,
      },
    );

    const data = await res.json();
    return data.data.content[0].token_id;
  } catch (error) {
    console.log(error);
  }
};
