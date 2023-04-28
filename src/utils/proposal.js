import { getProposal } from "../api/proposal";

export const fetchProposals = async (clubId, type) => {
  console.log(clubId);
  const proposalData = await getProposal(clubId, type);
  console.log(proposalData);

  if (proposalData.status !== 200) {
    return null;
  }
  //   proposalData.then(async (result) => {
  //     if (result.status != 200) {
  //       console.log("error");
  //       return null;
  //     } else {
  //       console.log(result.data);

  //   console.log("gnosisAddress", gnosisAddress);

  //   Promise.all(
  //     result.data.map(async (proposal) => {
  //       const proposalTxHash = await getProposalTxHash(proposal.proposalId);
  //       if (proposalTxHash.data[0]) {
  //         proposal["safeTxHash"] = proposalTxHash?.data[0].txHash;
  //       }
  //     }),
  //   );
  else return proposalData.data;
  // }
  //   });
};
