import axios from "axios";
import { SPACE_API_URL } from "../index";

export const createSpace = async (data) => {
  try {
    const res = await axios.post(`${SPACE_API_URL}api/v1/space`, data, {
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
    const res = await axios.get(`${SPACE_API_URL}api/v1/space/${spaceId}`, {
      headers: {
        accept: "application/json",
      },
    });
    return res.data;
  } catch (error) {
    console.log(error);
  }
};

export const getSpaceByManager = async (address) => {
  try {
    const res = await axios.get(
      `${SPACE_API_URL}api/v1/space/manager/${address}`,
      {
        headers: {
          accept: "application/json",
        },
      },
    );
    return res.data;
  } catch (error) {
    console.log(error);
  }
};

export const updateSpace = async (spaceId, data) => {
  try {
    const res = await axios.patch(
      `${SPACE_API_URL}api/v1/space/${spaceId}`,
      data,
      {
        headers: {
          accept: "application/json",
          "Content-Type": "application/json",
        },
      },
    );
    return res.data;
  } catch (error) {
    console.log(error);
  }
};
