import axios from "axios";
import {MAIN_API_URL} from "../index";

export async function createClub(data) {
  // create new club API
  return await axios.post(MAIN_API_URL + 'club/create', data)
}

export async function fetchClub(clubID) {
  // fetch club details using clubId
  return await axios.get(MAIN_API_URL + `club?clubId=${clubID}`)
}

export async function fetchClubbyDaoAddress(daoAddress) {
  // fetch club using DAO Address / clubId
  const resolved = {
    data: null,
    error: null,
  }
  return await fetch(MAIN_API_URL + `club/${daoAddress}`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
    },
  })
    .then(response => response.json())
    .then(data => {
      resolved.data = data
      return resolved
    })
    .catch((error) => {
      resolved.error = error
      return resolved
    });
}