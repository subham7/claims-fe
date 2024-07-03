import axios from "axios";
import { CHAIN_CONFIG } from "utils/constants";

export const fetchSafeAdmins = async ({ networkId, gnosisAddress }) => {
  try {
    const data = await axios.get(
      `${CHAIN_CONFIG[networkId].gnosisTxUrl}api/v1/safes/${gnosisAddress}`,
    );

    return data.data?.owners ?? [];
  } catch (error) {
    console.log(error);
  }
};
