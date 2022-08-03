import axios from "axios";
import {MAIN_API_URL} from "../index";

export async function getTokens(gnosisAddress) {
  // fetch tokens associated with the gnosis wallet
  return await axios.get(MAIN_API_URL + "gnosis/getTokens", { params : { gnosisAddress: `${gnosisAddress}`}})
}

export async function getNfts(gnosisAddress) {
  // fetch nfts associated with the gnosis wallet
  return await axios.get(MAIN_API_URL + `gnosis/getNFT?gnosisAddress=${gnosisAddress}`)
}

export async function getBalance(gnosisAddress) {
  // fetch gnosis wallet's treasury balance
  return await axios.get(MAIN_API_URL + `gnosis/getAssets?gnosisAddress=${gnosisAddress}`)
}

