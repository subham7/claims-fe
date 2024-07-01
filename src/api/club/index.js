import axios from "axios";
import { MAIN_API_URL } from "../index";
import { getJwtToken } from "../../utils/auth";
import { AWS_API_URL } from "utils/constants";

export const getClubsData = async (daoAddress) => {
  try {
    const clubs = encodeURIComponent(`${daoAddress}`);
    const response = await axios.get(
      `${MAIN_API_URL}club/details/?daoAddress=${clubs}`,
    );
    return response.data;
  } catch (error) {
    console.log(error);
  }
};

export const getClubData = async (daoAddress) => {
  try {
    const response = await axios.get(`${MAIN_API_URL}club/${daoAddress}`);
    return response.data;
  } catch (error) {
    console.log(error);
  }
};

export async function getClubListForWallet(wallet, networkId) {
  return await axios.get(
    MAIN_API_URL + `user/${wallet}/clubs?networkId=${networkId}`,
    {
      headers: {
        Authorization: "Bearer " + getJwtToken(),
        "Content-Type": "application/json",
      },
    },
  );
}

export async function getUserData(wallet) {
  return await axios.get(MAIN_API_URL + `user/${wallet}`, {
    headers: {
      Authorization: "Bearer " + getJwtToken(),
      "Content-Type": "application/json",
    },
  });
}

export async function createOrUpdateUser(data) {
  // fetch club details using clubId
  return await axios.post(MAIN_API_URL + `user/`, data, {
    headers: {
      Authorization: "Bearer " + getJwtToken(),
      "Content-Type": "application/json",
    },
  });
}

export async function getClubInfo(daoAddress) {
  // fetch club details using clubId
  return await axios.get(MAIN_API_URL + `club/social/${daoAddress}`, {
    headers: {
      Authorization: "Bearer " + getJwtToken(),
      "Content-Type": "application/json",
    },
  });
}

export async function editInfo(data) {
  // fetch club details using clubId
  return await axios.post(MAIN_API_URL + `club/social`, data, {
    headers: {
      Authorization: "Bearer " + getJwtToken(),
      "Content-Type": "application/json",
    },
  });
}

export async function fetchClubOwners(safeAddress, transactionUrl) {
  return await axios.get(transactionUrl + `/api/v1/safes/${safeAddress}`);
}

export async function fetchClubByDaoAddress(daoAddress) {
  // fetch club using DAO Address / clubId
  const resolved = {
    data: null,
    error: null,
  };
  return await fetch(MAIN_API_URL + `club/${daoAddress}`, {
    // mode: "no-cors",
    method: "GET",
    headers: {
      Authorization: "Bearer " + getJwtToken(),
      "Content-Type": "application/json",
      // "Access-Control-Allow-Origin": "localhost:3000",
    },
  })
    .then((response) => response.json())
    .then((data) => {
      resolved.data = data;
      return resolved;
    })
    .catch((error) => {
      resolved.error = error;
      return resolved;
    });
}

export const uploadToAWS = async (fileName, reader) => {
  try {
    const response = await axios.post(
      `${AWS_API_URL}/upload?filename=${fileName}`,
      new Blob([reader.result]),
    );

    return response.data;
  } catch (error) {
    console.log(error);
  }
};

export const createStation = async (data) => {
  try {
    const res = await axios.post(`${MAIN_API_URL}club/create`, data);
    return res.status;
  } catch (error) {
    console.log(error);
  }
};

export const addWalletAddressToTrack = async (data, daoAddress) => {
  try {
    const res = await axios.post(
      `${MAIN_API_URL}club/${daoAddress}/hot-wallets`,
      data,
    );
    return res.data;
  } catch (error) {
    console.log(error);
  }
};

export const removeWalletAddressToTrack = async (data, daoAddress) => {
  try {
    const res = await axios.delete(
      `${MAIN_API_URL}club/${daoAddress}/hot-wallets`,
      {
        data,
      },
    );
    return res.data;
  } catch (error) {
    console.log(error);
  }
};

export const getTotalTreasuryAmount = async (daoAddress) => {
  try {
    const res = await axios.get(
      `${MAIN_API_URL}club/${daoAddress}/hot-wallets/balance`,
    );
    return res.data;
  } catch (error) {
    console.log(error);
  }
};

export const createKYC = async (data) => {
  try {
    const res = await axios.post(`${MAIN_API_URL}kyc`, data, {
      headers: {
        Authorization: "Bearer " + getJwtToken(),
        "Content-Type": "application/json",
      },
    });
    return res.data;
  } catch (error) {
    console.log(error);
  }
};

export const updateKYC = async (data) => {
  try {
    const res = await axios.post(`${MAIN_API_URL}kyc/update`, data, {
      headers: {
        Authorization: "Bearer " + getJwtToken(),
        "Content-Type": "application/json",
      },
    });
    return res.data;
  } catch (error) {
    console.log(error);
  }
};

export const getKYCToken = async (daoAddress) => {
  try {
    const res = await axios.get(
      `${MAIN_API_URL}kyc/access-token/station/${daoAddress}`,
    );
    return res.data;
  } catch (error) {
    console.log(error);
  }
};
