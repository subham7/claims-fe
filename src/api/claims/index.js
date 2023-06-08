import { MAIN_API_URL } from "..";

export const createClaim = async (jsonData) => {
  try {
    const res = await fetch(`${MAIN_API_URL}claim`, {
      method: "POST",
      body: jsonData,
      headers: {
        "Content-Type": "application/json",
      },
    });

    const data = await res.json();
    return data;
  } catch (err) {
    console.log(err);
  }
};

export const getClaimsByUserAddress = async (userAddress, networkId) => {
  try {
    const res = await fetch(
      `${MAIN_API_URL}claim/user/${userAddress}?networkId=${networkId}`,
    );
    const data = await res.json();
    return data;
  } catch (err) {
    console.log(err);
  }
};

export const getClaimAmountForUser = async (
  userAddress,
  claimContractAddress,
) => {
  try {
    const res = await fetch(
      `${MAIN_API_URL}claim/${claimContractAddress}/user/${userAddress}/balance`,
    );
    const data = await res.json();
    return data;
  } catch (err) {
    console.log(err);
  }
};
