import axios from "axios";
import { MAIN_API_URL } from "../index";
import { getJwtToken } from "../../utils/auth";
import { AWS_API_URL } from "utils/constants";

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

export async function fetchClubbyDaoAddress(daoAddress) {
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

export async function createClubData(data) {
  try {
    const response = await fetch(`https://api.stationx.network/v1/club/data`, {
      method: "POST",
      body: JSON.stringify(data),
      headers: {
        "Content-Type": "application/json",
      },
    });
    const result = await response.json();
    return result;
  } catch (error) {
    console.log(error);
    return error;
  }
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
