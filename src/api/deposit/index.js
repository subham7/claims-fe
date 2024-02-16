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

export const editMembersFormData = async (data) => {
  try {
    const response = await axios.post(`${MAIN_API_URL}document/user`, data);
    return response.data;
  } catch (error) {
    console.log(error);
  }
};

export const hasUserSigned = async (docIdentifier, walletAddress) => {
  try {
    if (docIdentifier) {
      const response = await axios.get(
        `${MAIN_API_URL}document/${docIdentifier}/user/${walletAddress}`,
      );
      return response.data;
    }
  } catch (error) {
    console.log(error);
  }
};
