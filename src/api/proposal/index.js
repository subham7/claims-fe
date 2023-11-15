import axios from "axios";
import { MAIN_API_URL } from "../index";
import { getJwtToken } from "../../utils/auth";

export async function createProposal(data, networkId) {
  // create proposal API
  return await axios.post(MAIN_API_URL + `proposal`, data, {
    headers: {
      Authorization: "Bearer " + getJwtToken(),
      "Content-Type": "application/json",
    },
  });
}

export async function createCancelProposal(data, networkId) {
  // create proposal API
  return await axios.post(
    MAIN_API_URL + `proposal/create/cancel?networkId=${networkId}`,
    data,
    {
      headers: {
        Authorization: "Bearer " + getJwtToken(),
        "Content-Type": "application/json",
      },
    },
  );
}

export async function getProposal(clubId, filter) {
  // get proposals by club id API
  if (filter) {
    // if a filter value is passed, then the api with filter will be used
    return await axios.get(MAIN_API_URL + `proposal/club/${clubId}`, {
      params: {
        status: `\"${filter}\"`,
      },
      headers: {
        Authorization: "Bearer " + getJwtToken(),
        "Content-Type": "application/json",
      },
    });
  } else {
    return await axios.get(MAIN_API_URL + `proposal/club/${clubId}`, {
      headers: {
        Authorization: "Bearer " + getJwtToken(),
        "Content-Type": "application/json",
      },
    });
  }
}

export async function getProposalDetail(proposalId) {
  // get proposal detail by proposal id
  return await axios.get(MAIN_API_URL + `proposal/${proposalId}`, {
    headers: {
      Authorization: "Bearer " + getJwtToken(),
      "Content-Type": "application/json",
    },
  });
}

export async function castVote(data, networkId) {
  // cast proposal vote API
  return await axios.post(
    MAIN_API_URL + `proposal/vote2?networkId=${networkId}`,
    data,
    {
      headers: {
        Authorization: "Bearer " + getJwtToken(),
        "Content-Type": "application/json",
      },
    },
  );
}

export async function patchProposalExecuted(proposalId) {
  // update proposal status API
  return await axios.patch(
    MAIN_API_URL + "proposal/executed",
    { proposalId: proposalId },
    {
      headers: {
        Authorization: "Bearer " + getJwtToken(),
        "Content-Type": "application/json",
      },
    },
  );
}

export async function getProposalTxHash(proposalId) {
  // get proposal detail by proposal id
  return await axios.get(MAIN_API_URL + `proposal/hash/${proposalId}`, {
    headers: {
      Authorization: "Bearer " + getJwtToken(),
      "Content-Type": "application/json",
    },
  });
}

export async function createProposalTxHash(data) {
  // create proposal API
  return await axios.post(MAIN_API_URL + "proposal/hash", data, {
    headers: {
      Authorization: "Bearer " + getJwtToken(),
      "Content-Type": "application/json",
    },
  });
}

export async function getProposalByDaoAddress(daoAddress) {
  try {
    return await axios.get(MAIN_API_URL + `proposal/station/${daoAddress}`, {});
  } catch (error) {
    console.log(error);
  }
}
