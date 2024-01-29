import axios from "axios";

export const getClipBalanceInShares = async (address) => {
  try {
    const data = await axios.get(
      `https://activity-ss2me.ondigitalocean.app/stationx/${address}/balance?chain=linea`,
    );
    console.log("xxx", data);
    return data;
  } catch (error) {
    console.log(error);
  }
};
