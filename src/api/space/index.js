import axios from "axios";
import { SPACE_API_URL } from "../index";

export const createSpace = async (data) => {
  try {
    const res = await axios.post(`${SPACE_API_URL}api/space`, data, {
      headers: {
        accept: "application/json",
        "Content-Type": "application/json",
      },
    });
    return res.data;
  } catch (error) {
    console.log(error);
  }
};

export const getSpace = async (spaceId) => {
  try {
    const res = await axios.get(`${SPACE_API_URL}api/space/${spaceId}`, {
      headers: {
        accept: "application/json",
      },
    });
    return res.data;
  } catch (error) {
    console.log(error);
  }
};
