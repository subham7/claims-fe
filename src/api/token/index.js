import axios from "axios";
import { COVALENT_API } from "../index";

const MANTA_API_URL = process.env.NEXT_PUBLIC_MANTA_API_URL;

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

export const getTokensListOfManta = async (walletAddress) => {
  try {
    return await axios.get(
      `${MANTA_API_URL}?module=account&action=tokenlist&address=${walletAddress}`,
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
