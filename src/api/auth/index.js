import axios from "axios";
import { MAIN_API_URL, SPACE_API_URL } from "../index";

export const authToken = async (data) => {
  try {
    const res = await axios.post(`${SPACE_API_URL}api/v1/auth`, data, {
      headers: {
        accept: "application/json",
        "Content-Type": "application/json",
      },
    });
    return res.data;
  } catch (error) {
    console.log(error);
    return false;
  }
};

export async function loginToken(userAddress) {
  try {
    // authenticate user and retrieve JWT token for api access

    return await axios.post(MAIN_API_URL + "auth/login", {
      userAddress: userAddress,
    });
  } catch (error) {
    console.log(error);
  }
}

export async function refreshToken(refreshToken, accessToken) {
  try {
    // authenticate and fetch users new token
    const data = JSON.stringify({
      refreshToken: refreshToken,
    });
    return await axios.post(MAIN_API_URL + "auth/refresh-tokens", data, {
      headers: {
        Authorization: "Bearer " + accessToken,
        "Content-Type": "application/json",
      },
    });
  } catch (error) {
    console.log(error);
  }
}
