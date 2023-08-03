import SafeApiKit from "@safe-global/api-kit";
import Safe, { Web3Adapter } from "@safe-global/protocol-kit";
import { createCancelProposal, getProposalTxHash } from "api/proposal";
import Web3 from "web3";

export const rejectSafeTx = async ({
  pid,
  gnosisTransactionUrl,
  gnosisAddress,
  daoAddress,
  network,
  walletAddress,
}) => {
  try {
    const web3 = new Web3(window.ethereum);
    const ethAdapter = new Web3Adapter({
      web3: web3,
      signerAddress: Web3.utils.toChecksumAddress(walletAddress),
    });

    const txServiceUrl = gnosisTransactionUrl;

    const safeService = new SafeApiKit({
      txServiceUrl,
      ethAdapter,
    });

    const proposalTxHash = await getProposalTxHash(pid);

    const safetx = await safeService.getTransaction(
      proposalTxHash.data[0].txHash,
    );

    const safeSdk = await Safe.create({
      ethAdapter: ethAdapter,
      safeAddress: Web3.utils.toChecksumAddress(gnosisAddress),
    });

    const rejectionTransaction = await safeSdk.createRejectionTransaction(
      safetx.nonce,
    );

    const safeTxHash = await safeSdk.getTransactionHash(rejectionTransaction);

    const proposeTxn = await safeService.proposeTransaction({
      safeAddress: Web3.utils.toChecksumAddress(gnosisAddress),
      safeTransactionData: rejectionTransaction.data,
      safeTxHash: safeTxHash,
      senderAddress: Web3.utils.toChecksumAddress(walletAddress),
    });

    const senderSignature = await safeSdk.signTypedData(
      rejectionTransaction,
      "v4",
    );

    await safeService.confirmTransaction(safeTxHash, senderSignature.data);

    const cancelPayload = {
      name: "Cancel Proposal",
      description: "",
      createdBy: walletAddress,
      clubId: daoAddress,
      votingDuration: 0,
      votingOptions: [{ text: "Yes" }, { text: "No" }, { text: "Abstain" }],
      commands: [
        {
          proposalId: pid,
        },
      ],
      type: "cancel",
      tokenType: "",
      daoAddress: daoAddress,
    };

    await createCancelProposal(cancelPayload, network, safeTxHash);

    return proposeTxn;
  } catch (e) {
    console.error(e);
  }
};

export const executeRejectTx = async ({
  pid,
  walletAddress,
  gnosisTransactionUrl,
  gnosisAddress,
}) => {
  try {
    const web3 = new Web3(window.ethereum);
    const ethAdapter = new Web3Adapter({
      web3: web3,
      signerAddress: Web3.utils.toChecksumAddress(walletAddress),
    });

    const txServiceUrl = gnosisTransactionUrl;

    const safeService = new SafeApiKit({
      txServiceUrl,
      ethAdapter,
    });

    const proposalTxHash = await getProposalTxHash(pid);

    const safetx = await safeService.getTransaction(
      "0xbd51bbe2d93270ee5b84568317ce499c3631f37c34cada2e379a0e890c3401a8", //proposalTxHash.data[0].txHash,
    );

    const safeSdk = await Safe.create({
      ethAdapter: ethAdapter,
      safeAddress: Web3.utils.toChecksumAddress(gnosisAddress),
    });

    await safeSdk.executeTransaction(safetx);

    return true;
  } catch (e) {
    console.error(e);
  }
};
