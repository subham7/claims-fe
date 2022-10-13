import axios from "axios";
import {MAIN_API_URL} from "../index";

export async function loginToken(userAddress) {
  // authenticate user and retrieve JWT token for api access
  return await axios.post(MAIN_API_URL + 'auth/login', {userAddress: userAddress})
}

export async function refreshToken(refreshToken, accessToken) {
  console.log("Refresh", refreshToken)
  console.log("Access", accessToken)
  // authenticate and fetch users new token
  const data = JSON.stringify(
    {
      "refreshToken": refreshToken
    }
  )
  console.log("data", data)
  return await axios.post(
    MAIN_API_URL + 'auth/refresh-tokens',
    data,
    {
      headers: {
        'Authorization': 'Bearer ' + accessToken,
        'Content-Type': 'application/json'
      }
    }
  )
}
