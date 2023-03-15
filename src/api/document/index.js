import axios from "axios";
import { MAIN_API_URL } from "../index";

export const createDocument = async (data) => {
  // storing admin's document details
  return await axios.post(MAIN_API_URL + "document", data);
};

// get Documents by ClubID
export const getDocumentsByClubId = async (clubId) => {
  // return await axios.get(`${MAIN_API_URL}/club/${clubId}` )
  try {
    const res = await fetch(`${MAIN_API_URL}/document/club/${clubId}`);
    const data = await res.json();
    return data;
  } catch (err) {
    console.log(err);
  }
};
