import { MAIN_API_URL } from "..";

export const createClaim = async (jsonData) => {
  try {
    const res = await fetch(`${MAIN_API_URL}/claim`, {
      method: "POST",
      body: jsonData,
      headers: {
        "Content-Type": "application/json",
      },
    });

    const data = await res.json();
    console.log(data);
    return data;
  } catch (err) {
    console.log(err);
  }
};

export const getClaimsByUserAddress = async (userAddress) => {
  try {
    const res = await fetch(`${MAIN_API_URL}/claim/user/${userAddress}`);
    const data = await res.json();
    return data;
  } catch (err) {
    console.log(err);
  }
};
