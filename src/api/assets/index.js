import axios from "axios";
import { MAIN_API_URL } from "../index";
import { getJwtToken } from "../../utils/auth";

export async function getAssetsByDaoAddress(daoAddress, networkId) {
  try {
    if (daoAddress && networkId) {
      return await axios.get(
        MAIN_API_URL + `assets/dao/${daoAddress}?networkId=${networkId}`,
        {
          headers: {
            Authorization: "Bearer " + getJwtToken(),
            "Content-Type": "application/json",
          },
        },
      );
    }
    return {};
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
    if (daoAddress && networkId) {
      return await axios.get(
        MAIN_API_URL + `assets/dao/${daoAddress}/nft?networkId=${networkId}`,
        {
          headers: {
            Authorization: "Bearer " + getJwtToken(),
            "Content-Type": "application/json",
          },
        },
      );
    }
    return {};
  } catch (error) {
    console.log(error);
  }
}

export async function retrieveNftListing(chain, contractAddress, tokenId) {
  try {
    return await axios.get(
      MAIN_API_URL +
        `external/opensea/nftListing/?chain=${chain}&contractAddress=${contractAddress}&tokenId=${tokenId}`,
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
    MAIN_API_URL + "external/opensea/fulfillOrder/",
    options,
  );
  return res.json();
}

export async function uploadNFT(daoAddress, imageLink) {
  // upload nft to corresponding DAO address
  return await axios.post(
    MAIN_API_URL + `club/file`,
    {
      daoAddress,
      imageUrl: imageLink,
    },
    {
      headers: {
        Authorization: "Bearer " + getJwtToken(),
        "Content-Type": "application/json",
      },
    },
  );
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

export async function getAssetsOfWallet(address) {
  try {
    return await axios.get(MAIN_API_URL + `club/hot-wallets/${address}`, {
      headers: {
        Authorization: "Bearer " + getJwtToken(),
        "Content-Type": "application/json",
      },
    });
  } catch (error) {
    console.log(error);
  }
}

export async function getNFTsByWallet(address) {
  try {
    return await axios.get(MAIN_API_URL + `club/hot-wallets/nft/${address}`, {
      headers: {
        Authorization: "Bearer " + getJwtToken(),
        "Content-Type": "application/json",
      },
    });
  } catch (error) {
    console.log(error);
  }
}

export const getPriceRate = async (currencySymbol) => {
  try {
    return await axios.get(
      `https://api.coinbase.com/v2/exchange-rates?currency=${currencySymbol}`,
    );
  } catch (error) {
    console.log(error);
  }
};
