import axios from "axios";
import { MAIN_API_URL } from "../index";
import { getJwtToken } from "../../utils/auth";
import { CHAIN_CONFIG } from "utils/constants";

export async function createProposal(data, networkId) {
  // create proposal API
  return await axios.post(
    MAIN_API_URL + `proposal/create?networkId=${networkId}`,
    data,
    {
      headers: {
        Authorization: "Bearer " + getJwtToken(),
        "Content-Type": "application/json",
      },
    },
  );
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

export async function getSwapInfo(swapParams, networkId) {
  const API_URL = `https://api.1inch.dev/swap/v5.2/${CHAIN_CONFIG[networkId].chainId}/swap`;
  // const PARAMS = {
  //   src: "0xEeeeeEeeeEeEeeEeEeEeeEEEeeeeEeeeeeeeEEeE",
  //   dst: "0xc2132d05d31c914a87c6611c10748aeb04b58e8f",
  //   amount: "10000000000000000",
  //   from: "0x2791Bca1f2de4661ED88A30C99A7a9449Aa84174",
  //   slippage: 1,
  // };

  const HEADERS = {
    accept: "application/json",
    Authorization: "Bearer YoMsRNILWOzs3XQug5pJ7XbgUPUjsWCm",
  };

  axios
    .get(API_URL, { headers: HEADERS, params: swapParams })
    .then((response) => {
      console.log(response.data);
    })
    .catch((error) => {
      console.error("Error:", error);
    });
}
//   try {
//     console.log(swapParams);
//     // return await axios.get(
//     //   `https://api.1inch.dev/swap/v5.2/${networkId}/swap?fromTokenAddress=${swapParams.fromTokenAddress}&toTokenAddress=${swapParams.toTokenAddress}&amount=${swapParams.amount}&fromAddress=${swapParams.fromAddress}&destReceiver=${swapParams.destReceiver}&slippage=${swapParams.slippage}&disableEstimate=${swapParams.disableEstimate}/`,
//     //   {
//     //     headers: {
//     //       Authorization: "Bearer YoMsRNILWOzs3XQug5pJ7XbgUPUjsWCm",
//     //       accept: "application/json",
//     //     },
//     //   },
//     // );
//     return await axios.get(
//       `https://api.1inch.dev/swap/v5.2/${CHAIN_CONFIG[networkId].chainId}/swap?src=${swapParams.src}&dst=${swapParams.dst}&amount=${swapParams.amount}&from=${swapParams.from}&slippage=${swapParams.slippage}&disableEstimate=${swapParams.disableEstimate}&allowPartialFill=${swapParams.allowPartialFill}/`,
//       {
//         headers: {
//           Authorization: "Bearer YoMsRNILWOzs3XQug5pJ7XbgUPUjsWCm",
//           "Content-Type": "application/json",
//         },
//       },
//     );
//   } catch (error) {
//     console.log(error);
//   }
// }
