import axios from "axios";
import { MAIN_API_URL } from "../index";
import { getJwtToken } from "../../utils/auth";

export async function createClub(data) {
  // create new club API
  return await axios.post(MAIN_API_URL + "club/create", data, {
    headers: {
      "Authorization": "Bearer " + getJwtToken(),
      "Content-Type": "application/json",
    },
  });
}

export async function fetchClub(clubID) {
  // fetch club details using clubId
  return await axios.get(MAIN_API_URL + `club?clubId=${clubID}`, {
    headers: {
      "Authorization": "Bearer " + getJwtToken(),
      "Content-Type": "application/json",
    },
  });
}

export async function fetchClubbyDaoAddress(daoAddress) {
  // fetch club using DAO Address / clubId
  const resolved = {
    data: null,
    error: null,
  };
  return await fetch(MAIN_API_URL + `club/${daoAddress}`, {
    method: "GET",
    headers: {
      "Authorization": "Bearer " + getJwtToken(),
      "Content-Type": "application/json",
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
