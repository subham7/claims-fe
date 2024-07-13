import { readContractFunction, writeContractFunction } from "utils/helper";
import { useAccount, useChainId, useWalletClient } from "wagmi";
import { claimContractABI } from "abis/claimContract.js";
import { claimFactoryABI } from "abis/claimFactory.js";
import { CHAIN_CONFIG } from "utils/constants";
import { disburseContractABI } from "abis/disburseContract";
import { decodeAbiParameters, parseAbiParameters } from "viem";
import { encodeFunctionData } from "viem";

const useDropsContractMethods = () => {
  const walletClient = useWalletClient();
  const { address: walletAddress } = useAccount();
  const chain = useChainId();
  const networkId = "0x" + chain?.toString(16);

  const claimFactoryAddress = CHAIN_CONFIG[networkId].claimFactoryAddress;

  const addMoreTokens = async (claimAddress, noOfTokens, merkleRoot) => {
    try {
      const res = await writeContractFunction({
        address: claimAddress,
        abi: claimContractABI,
        functionName: "depositTokens",
        args: [noOfTokens, merkleRoot],
        account: walletAddress,
        networkId,
        walletClient,
      });
      return res;
    } catch (error) {
      throw error;
    }
  };

  const claimContract = async (
    claimSettings,
    totalNoOfWallets,
    blockNumber,
    whitelistNetwork,
  ) => {
    console.log(claimSettings);
    try {
      const res = await writeContractFunction({
        address: claimFactoryAddress,
        abi: claimFactoryABI,
        functionName: "deployClaimContract",
        args: [claimSettings, totalNoOfWallets, blockNumber, whitelistNetwork],
        account: walletAddress,
        networkId,
        walletClient,
      });
      return res;
    } catch (error) {
      throw error;
    }
  };

  const claimSettings = async (claimAddress) => {
    const response = await readContractFunction({
      address: claimAddress,
      abi: claimContractABI,
      functionName: "claimSettings",
      args: [],
      account: walletAddress,
      networkId,
    });

    return response
      ? {
          name: response[0],
          creatorAddress: response[1],
          walletAddress: response[2],
          airdropToken: response[3],
          daoToken: response[4],
          tokenGatingValue: response[5],
          startTime: Number(response[6]),
          endTime: Number(response[7]),
          cooldownTime: Number(response[8]),
          hasAllowanceMechanism: response[9],
          isEnabled: response[10],
          merkleRoot: response[11],
          permission: response[12].toString(),
          claimAmountDetails: {
            maxClaimable: Number(response[13].maxClaimable),
            totalClaimAmount: Number(response[13].totalClaimAmount),
          },
        }
      : {};
  };

  const claimBalance = async (claimAddress) => {
    const response = await readContractFunction({
      address: claimAddress,
      abi: claimContractABI,
      functionName: "claimBalance",
      args: [],
      account: walletAddress,
      networkId,
    });

    return Number(response ?? 0);
  };

  const claimAmount = async (claimAddress, walletAddress) => {
    const response = await readContractFunction({
      address: claimAddress,
      abi: claimContractABI,
      functionName: "claimAmount",
      args: [walletAddress],
      account: walletAddress,
      networkId,
    });

    return Number(response ?? 0);
  };

  const toggleClaim = async (claimAddress) => {
    try {
      const res = await writeContractFunction({
        address: claimAddress,
        abi: claimContractABI,
        functionName: "toggleClaim",
        account: walletAddress,
        args: [],
        networkId,
        walletClient,
      });
      return res;
    } catch (error) {
      throw error;
    }
  };

  const rollbackTokens = async (claimAddress, amount, rollbackAddress) => {
    try {
      const res = await writeContractFunction({
        address: claimAddress,
        abi: claimContractABI,
        functionName: "rollbackTokens",
        args: [amount, rollbackAddress],
        account: walletAddress,
        networkId,
        walletClient,
      });
      return res;
    } catch (error) {
      throw error;
    }
  };

  const modifyStartAndEndTime = async (claimAddress, startTime, endTime) => {
    try {
      const res = await writeContractFunction({
        address: claimAddress,
        abi: claimContractABI,
        functionName: "changeStartAndEndTime",
        args: [startTime, endTime],
        account: walletAddress,
        networkId,
        walletClient,
      });
      return res;
    } catch (error) {
      throw error;
    }
  };

  function convertProofToUint256Array(proof) {
    const cleanProof = proof.replace(/^0x/, "");
    const segmentLength = 64;
    const uint256Array = [];

    for (let i = 0; i < 8; i++) {
      const segment = cleanProof.slice(
        i * segmentLength,
        (i + 1) * segmentLength,
      );
      uint256Array.push(BigInt(`0x${segment}`));
    }

    return uint256Array;
  }

  const claim = async (
    claimAddress,
    amount,
    reciever,
    merkleProof,
    encodedData,
    erc1155tokenId = 0,
    signal,
    merkle_root,
    nullifier_hash,
    proof,
  ) => {
    const parsedProof = decodeAbiParameters(
      parseAbiParameters("uint256[8]"),
      proof,
    )[0];
    debugger;
    // console.log(signal, merkle_root, nullifier_hash, proof);
    const encodedData1 = encodeFunctionData({
      abi: claimContractABI,
      functionName: "claim",
      args: [
        amount,
        reciever,
        merkleProof,
        encodedData,
        erc1155tokenId,
        signal,
        BigInt(merkle_root),
        BigInt(nullifier_hash),
        parsedProof,
      ],
    });

    console.log(encodedData1);

    try {
      const res = await writeContractFunction({
        address: claimAddress,
        abi: claimContractABI,
        functionName: "claim",
        args: [
          amount,
          reciever,
          merkleProof,
          encodedData,
          erc1155tokenId,
          signal,
          BigInt(merkle_root),
          BigInt(nullifier_hash),
          parsedProof,
        ],
        account: walletAddress,
        networkId,
        walletClient,
      });
      return res;
    } catch (error) {
      console.log(error);
      throw error;
    }
  };

  const disburse = async (isNative, tokenAddress, walletList, amountList) => {
    try {
      const res = await writeContractFunction({
        address: CHAIN_CONFIG[networkId].disburseContractAddress,
        abi: disburseContractABI,
        functionName: isNative ? "disburseNative" : "disburseERC20",
        args: [tokenAddress, walletList, amountList],
        account: walletAddress,
        networkId,
        walletClient,
      });
      return res;
    } catch (error) {
      throw error;
    }
  };

  return {
    claimAmount,
    claim,
    rollbackTokens,
    toggleClaim,
    claimBalance,
    claimSettings,
    claimContract,
    addMoreTokens,
    modifyStartAndEndTime,
    disburse,
  };
};

export default useDropsContractMethods;
