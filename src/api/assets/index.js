import axios from "axios";
import {MAIN_API_URL} from "../index";
import {getJwtToken} from "../../utils/auth";

export async function getAssets(clubId) {
  // fetch treasury balance, tokens and nfts associated with a particular club
  return await axios.get(
    MAIN_API_URL + `assets/${clubId}`,
  {
    headers: {
      'Authorization': 'Bearer ' + getJwtToken(),
      'Content-Type': 'application/json'
    }
  }
  )
}