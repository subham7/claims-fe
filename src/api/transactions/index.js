import { MAIN_API_URL } from "api";

export const getTransactionsByNetworkId = async (
  safeAddress,
  networkId,
  limit = 10,
  offset = 0,
) => {
  try {
    const res = await fetch(
      `${MAIN_API_URL}external/safe/transactions?safeAddress=${safeAddress}&networkId=${networkId}&limit=${limit}&offset=${offset}`,
    );

    const data = await res.json();
    return data;
  } catch (error) {
    console.log(error);
  }
};
