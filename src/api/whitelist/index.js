import { MAIN_API_URL } from "api";

export const getWhiteListMerkleRoot = async (networkId, jsonData) => {
  try {
    const res = await fetch(
      `${MAIN_API_URL}snapshot/create/whitelist?networkId=${networkId}`,
      {
        method: "POST",
        body: JSON.stringify(jsonData),
        headers: {
          "Content-Type": "application/json",
        },
      },
    );

    const data = await res.json();
    return data;
  } catch (err) {
    console.log(err);
  }
};

export const getWhitelistMerkleProof = async (daoAddress, userAddress) => {
  try {
    const res = await fetch(
      `${MAIN_API_URL}snapshot/whitelist/station/${daoAddress}/user/${userAddress}`,
    );

    const data = await res.json();
    return data;
  } catch (error) {
    console.log(error);
  }
};
