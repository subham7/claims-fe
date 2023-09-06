import { getProposal } from "../api/proposal";
import SafeApiKit from "@safe-global/api-kit";
import Safe, { Web3Adapter } from "@safe-global/protocol-kit";
import { createCancelProposal, getProposalTxHash } from "api/proposal";
import Web3 from "web3";
import { getIncreaseGasPrice } from "./helper";

export const fetchProposals = async (clubId, type) => {
  let proposalData;
  if (type === "all") proposalData = await getProposal(clubId);
  else proposalData = await getProposal(clubId, type);

  if (proposalData.status !== 200) {
    return null;
  } else return proposalData.data;
};

export const createRejectSafeTx = async ({
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
      proposalData: {
        createdBy: walletAddress,
        commands: [
          {
            proposalId: pid,
          },
        ],
        daoAddress,
      },
      txHash: safeTxHash,
    };

    await createCancelProposal(cancelPayload, network);

    return true;
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
      proposalTxHash.data[0].txHash,
    );

    const safeSdk = await Safe.create({
      ethAdapter: ethAdapter,
      safeAddress: Web3.utils.toChecksumAddress(gnosisAddress),
    });

    const options = {
      gasPrice: await getIncreaseGasPrice(),
    };

    await safeSdk.executeTransaction(safetx, options);

    return true;
  } catch (e) {
    console.error(e);
  }
};

export const signRejectTx = async ({
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
      proposalTxHash.data[0].txHash,
    );

    const safeSdk = await Safe.create({
      ethAdapter: ethAdapter,
      safeAddress: Web3.utils.toChecksumAddress(gnosisAddress),
    });

    const safeTransaction = await safeSdk.createRejectionTransaction(
      safetx.nonce,
    );

    const senderSignature = await safeSdk.signTypedData(safeTransaction, "v4");

    await safeService.confirmTransaction(
      safetx.safeTxHash,
      senderSignature.data,
    );

    return true;
  } catch (e) {
    console.error(e);
  }
};
