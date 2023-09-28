import { MAIN_API_URL } from "api";
import axios from "axios";

export const editDepositConfig = async (data, daoAddress) => {
  try {
    const response = await axios.patch(
      `${MAIN_API_URL}/club/${daoAddress}/deposit-config`,

      data,
    );
    return response.data;
  } catch (error) {
    console.log(error);
  }
};
