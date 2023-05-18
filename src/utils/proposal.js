import { getProposal } from "../api/proposal";

export const fetchProposals = async (clubId, type) => {
  console.log(clubId);
  let proposalData;
  if (type === "all") proposalData = await getProposal(clubId);
  else proposalData = await getProposal(clubId, type);
  console.log(proposalData);

  if (proposalData.status !== 200) {
    return null;
  }
 
  else return proposalData.data;

};
