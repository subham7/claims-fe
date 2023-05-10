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

export async function getAssetsByDaoAddress(daoAddress, networkId) {
  try {
    return await axios.get(
      MAIN_API_URL + `assets/dao/${daoAddress}?networkId=${networkId}`,
      {
        headers: {
          "Authorization": "Bearer " + getJwtToken(),
          "Content-Type": "application/json",
        },
      },
    );
  } catch (error) {
    console.log(error);
  }
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

export async function getNFTs(clubId) {
  return await axios.get(MAIN_API_URL + `assets/${clubId}/nft`, {
    headers: {
      "Authorization": "Bearer " + getJwtToken(),
      "Content-Type": "application/json",
    },
  });
}

export async function getNFTsByDaoAddress(daoAddress, networkId) {
  return await axios.get(
    MAIN_API_URL + `assets/dao/${daoAddress}/nft?networkId=${networkId}`,
    {
      headers: {
        "Authorization": "Bearer " + getJwtToken(),
        "Content-Type": "application/json",
      },
    },
  );
}
