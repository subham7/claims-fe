import { MAIN_API_URL } from "../index";
import Web3 from "web3";
import axios from "axios";
import { getJwtToken } from "../../utils/auth";

export async function createUser(data) {
  // create user API

  return await axios.post(MAIN_API_URL + "user", data, {
    headers: {
      "Authorization": "Bearer " + getJwtToken(),
      "Content-Type": "application/json",
    },
  });
}

export async function fetchClubByUserAddress(userId) {
  // fetch club by user address API
  const web3 = new Web3(window.web3);
  const walletAddress = web3.utils.toChecksumAddress(userId);
  return await axios.get(MAIN_API_URL + `user/${walletAddress}`, {
    headers: {
      "Authorization": "Bearer " + getJwtToken(),
      "Content-Type": "application/json",
    },
  });
}

export async function getMembersDetails(clubId) {
  // fetch members of club
  return await axios.get(MAIN_API_URL + `user/club/${clubId}`, {
    headers: {
      "Authorization": "Bearer " + getJwtToken(),
      "Content-Type": "application/json",
    },
  });
}

export async function patchUserBalance(data) {
  // update user amount status
  return await axios.patch(MAIN_API_URL + "user/balance", data, {
    headers: {
      "Authorization": "Bearer " + getJwtToken(),
      "Content-Type": "application/json",
    },
  });
}

export async function checkUserByClub(walletAddress, clubId) {
  // api to check whether user exists in a club by user address
  return await axios.get(
    MAIN_API_URL + `user/${walletAddress}/club/${clubId}/check`,
    {
      headers: {
        "Authorization": "Bearer " + getJwtToken(),
        "Content-Type": "application/json",
      },
    },
  );
}
