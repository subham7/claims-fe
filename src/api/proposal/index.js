import axios from "axios";
import { MAIN_API_URL } from "../index";
import { getJwtToken } from "../../utils/auth";

export async function createProposal(isGovernanceActive, data) {
  // create proposal API
  if (isGovernanceActive || data?.type === "survey") {
    return await axios.post(MAIN_API_URL + `proposal`, data, {
      headers: {
        Authorization: "Bearer " + getJwtToken(),
        "Content-Type": "application/json",
      },
    });
  } else {
    return await axios.post(MAIN_API_URL + `proposal/admin`, data, {
      headers: {
        Authorization: "Bearer " + getJwtToken(),
        "Content-Type": "application/json",
      },
    });
  }
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

export async function getProposalDetail(proposalId) {
  // get proposal detail by proposal id
  return await axios.get(MAIN_API_URL + `proposal/${proposalId}`, {
    headers: {
      Authorization: "Bearer " + getJwtToken(),
      "Content-Type": "application/json",
    },
  });
}

export async function castVote(data) {
  // cast proposal vote API
  return await axios.post(MAIN_API_URL + `proposal/vote`, data, {
    headers: {
      Authorization: "Bearer " + getJwtToken(),
      "Content-Type": "application/json",
    },
  });
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
    return await axios.get(MAIN_API_URL + `proposal/station/${daoAddress}`);
  } catch (error) {
    console.log(error);
  }
}

export async function getPaginatedProposalList(
  daoAddress,
  limit = 10,
  offset,
  status = "passed",
) {
  try {
    return await axios.get(
      MAIN_API_URL +
        `proposal/station/${daoAddress}?limit=${limit}&offset=${offset}&status=["${status}"]`,
    );
  } catch (error) {
    console.log(error);
  }
}

export async function getIndividualProposalList({
  daoAddress,
  status = "passed",
  executionId,
}) {
  try {
    return await axios.get(
      MAIN_API_URL +
        `proposal/station/${daoAddress}?limit=100&offset=0&status=["${status}"]&executionId=${executionId}`,
    );
  } catch (error) {
    console.log(error);
  }
}

export const getLatesExecutableProposal = async (daoAddress) => {
  try {
    return await axios.get(
      MAIN_API_URL + `proposal/station/latest/${daoAddress}`,
    );
  } catch (error) {
    console.log(error);
  }
};
