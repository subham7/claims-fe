import axios from "axios";
import {MAIN_API_URL} from "../index";

export async function getAssets(clubId) {
  // fetch treasury balance, tokens and nfts associated with a particular club
  return await axios.get(MAIN_API_URL + `assets/${clubId}`)
}