import axios from "axios";
import { MAIN_API_URL } from "../index";
import { getJwtToken } from "../../utils/auth";

export async function fetchConfig() {
	return await axios.get(MAIN_API_URL + `config`, {
		headers: {
			"Authorization": "Bearer " + getJwtToken(),
			"Content-Type": "application/json",
		},
	});
}

export async function fetchConfigById(networkId) {
	return await axios.get(MAIN_API_URL + `config/${networkId}`, {
		headers: {
			"Authorization": "Bearer " + getJwtToken(),
			"Content-Type": "application/json",
		},
	});
}
