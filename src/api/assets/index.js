import axios from "axios";
import { MAIN_API_URL } from "../index";
import { getJwtToken } from "../../utils/auth";

export async function getAssetsByDaoAddress(daoAddress, networkId) {
  try {
    return await axios.get(
      MAIN_API_URL + `assets/dao/${daoAddress}?networkId=${networkId}`,
      {
        headers: {
          Authorization: "Bearer " + getJwtToken(),
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
  try {
    return await axios.get(
      MAIN_API_URL +
        `assets/metadata?address=${tokenAddress}&networkId=${networkId}`,
      {
        headers: {
          Authorization: "Bearer " + getJwtToken(),
          "Content-Type": "application/json",
        },
      },
    );
  } catch (error) {
    console.log(error);
  }
}

export async function getNFTsByDaoAddress(daoAddress, networkId) {
  try {
    return await axios.get(
      MAIN_API_URL + `assets/dao/${daoAddress}/nft?networkId=${networkId}`,
      {
        headers: {
          Authorization: "Bearer " + getJwtToken(),
          "Content-Type": "application/json",
        },
      },
    );
  } catch (error) {
    console.log(error);
  }
}

export async function retrieveNftListing(chain, contractAddress, tokenId) {
  try {
    return await axios.get(
      `https://api.opensea.io/v2/orders/${chain}/seaport/listings?asset_contract_address=${contractAddress}&token_ids=${tokenId}&order_by=created_date&order_direction=desc`,
      {
        headers: {
          accept: "application/json",
          "X-API-KEY": "168c1d23e73c46318518d8f9eedc89dd",
        },
      },
    );
  } catch (error) {
    console.log(error);
  }
}

export async function fulfillOrder(offer, fulfiller, consideration) {
  const options = {
    method: "POST",
    headers: {
      "X-API-KEY": "168c1d23e73c46318518d8f9eedc89dd",
      "content-type": "application/json",
    },
    body: JSON.stringify({
      offer: offer,
      fulfiller: fulfiller,
      consideration: consideration,
    }),
  };

  const res = await fetch(
    "https://api.opensea.io/v2/offers/fulfillment_data",
    options,
  );
  return res.json();
}

export async function uploadNFT(formData) {
  // upload nft to corresponding DAO address
  return await axios.post(MAIN_API_URL + `club/file`, formData, {
    headers: {
      Authorization: "Bearer " + getJwtToken(),
      "Content-Type": "application/json",
    },
  });
}

export async function getUploadedNFT(daoAddress) {
  // get uploaded nft to corresponding DAO address
  return await axios.get(MAIN_API_URL + `club/${daoAddress}/file `, {
    headers: {
      Authorization: "Bearer " + getJwtToken(),
      "Content-Type": "application/json",
    },
  });
}
