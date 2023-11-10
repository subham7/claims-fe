import axios from "axios";
import { MAIN_API_URL } from "../index";
import { getJwtToken } from "../../utils/auth";

export async function fetchConfig() {
  try {
    return await axios.get(MAIN_API_URL + `config`, {
      headers: {
        Authorization: "Bearer " + getJwtToken(),
        "Content-Type": "application/json",
      },
    });
  } catch (error) {
    console.log(error);
  }
}
