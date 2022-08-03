import axios from "axios";
import {MAIN_API_URL} from "../index";

export async function createProposal(data) {
  // create proposal API
  return await axios.post(MAIN_API_URL + 'proposal', data)
}

export async function getProposal(clubId, filter) {
  // get proposals by club id API
  if (filter) {
    // if a filter value is passed, then the api with filter will be used
    return await axios.get(MAIN_API_URL + `proposal/club/${clubId}`, { params: { status:`\"${filter}\"`}})
  }
  else {
    return await axios.get(MAIN_API_URL + `proposal/club/${clubId}`)
  }
}

export async function getProposalDetail(proposalId) {
  // get proposal detail by proposal id
  return await axios.get(MAIN_API_URL + `proposal/${proposalId}`)
}

export async function castVote(data) {
  // cast proposal vote API
  return await axios.post(MAIN_API_URL + `proposal/vote`, data)
}

export async function patchProposalStatus(proposalId) {
  // update proposal status API
  return await axios.patch(MAIN_API_URL + "proposal/result", { "proposalId" : proposalId})
}

export async function patchProposalExecuted(proposalId) {
  // update proposal status API
  return await axios.patch(MAIN_API_URL + "proposal/executed", { "proposalId" : proposalId})
}