import SafeApiKit from "@safe-global/api-kit";
import Safe, { Web3Adapter } from "@safe-global/protocol-kit";
import { createCancelProposal, getProposalTxHash } from "api/proposal";
import Web3 from "web3";

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

    return proposeTxn;
  } catch (e) {
    console.error(e);
  }
};

export const signRejectTx = async ({ pid, gnosisTransactionUrl }) => {
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
    const tx = await safeService.getTransaction(proposalTxHash.data[0].txHash);

    const safeTransactionData = [
      {
        to: tx.dataDecoded.parameters[0].valueDecoded[0].to,
        data: tx.dataDecoded.parameters[0].valueDecoded[0].data,
        value: tx.dataDecoded.parameters[0].valueDecoded[0].value,
        nonce: tx.nonce, // Optional
      },
      {
        to: tx.dataDecoded.parameters[0].valueDecoded[1].to,
        data: tx.dataDecoded.parameters[0].valueDecoded[1].data,
        value: tx.dataDecoded.parameters[0].valueDecoded[1].value,
        nonce: tx.nonce, // Optional
      },
    ];

    const safeTxHash = tx.safeTxHash;

    let safeTransaction;

    safeTransaction = await safeSdk.createTransaction({
      safeTransactionData,
    });

    const senderSignature = await safeSdk.signTypedData(safeTransaction, "v4");

    await safeService.confirmTransaction(safeTxHash, senderSignature.data);
    return true;
  } catch (e) {
    console.error(e);
    return false;
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

    await safeSdk.executeTransaction(safetx);

    return true;
  } catch (e) {
    console.error(e);
  }
};
