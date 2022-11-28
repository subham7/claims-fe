import axios from "axios";
import { MAIN_API_URL } from "../index";
import { getJwtToken } from "../../utils/auth";

// fetch treasury balance, tokens and nfts associated with a particular club
export async function getAssets(clubId) {
  return await axios.get(MAIN_API_URL + `assets/${clubId}`, {
    headers: {
      "Authorization": "Bearer " + getJwtToken(),
      "Content-Type": "application/json",
    },
  });
}

// fetch token metadata(if exists) using token address
export async function fetchTokenMetaData(tokenAddress, networkId) {
  return await axios.get(
    MAIN_API_URL +
      `assets/metadata?address=${tokenAddress}&networkId=${networkId}`,
    {
      headers: {
        "Authorization": "Bearer " + getJwtToken(),
        "Content-Type": "application/json",
      },
    },
  );
}
