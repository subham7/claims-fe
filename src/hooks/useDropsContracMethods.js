import { useSelector } from "react-redux";
import { writeContractFunction } from "utils/helper";
import { useAccount, useNetwork } from "wagmi";
import { claimContractABI } from "abis/claimContract.js";
import { claimFactoryABI } from "abis/claimFactory.js";
import { CHAIN_CONFIG } from "utils/constants";

const useDropsContractMethods = () => {
  const { address: walletAddress } = useAccount();
  const { chain } = useNetwork();
  const networkId = "0x" + chain?.id.toString(16);

  const contractInstances = useSelector((state) => {
    return state.contractInstances.contractInstances;
  });

  const claimFactoryAddress = CHAIN_CONFIG[networkId].claimFactoryAddress;

  const { claimContractCall } = contractInstances;

  const addMoreTokens = async (claimAddress, noOfTokens, merkleRoot) => {
    try {
      const res = await writeContractFunction({
        address: claimAddress,
        abi: claimContractABI,
        functionName: "depositTokens",
        args: [noOfTokens, merkleRoot],
        account: walletAddress,
        networkId,
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
    try {
      const res = await writeContractFunction({
        address: claimFactoryAddress,
        abi: claimFactoryABI,
        functionName: "deployClaimContract",
        args: [claimSettings, totalNoOfWallets, blockNumber, whitelistNetwork],
        account: walletAddress,
        networkId,
      });
      return res;
    } catch (error) {
      throw error;
    }
  };

  const claimSettings = async () => {
    return await claimContractCall?.methods?.claimSettings().call();
  };

  const claimBalance = async () => {
    return await claimContractCall?.methods.claimBalance().call();
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
      });
      return res;
    } catch (error) {
      throw error;
    }
  };

  const claim = async (
    claimAddress,
    amount,
    reciever,
    merkleProof,
    encodedData,
  ) => {
    try {
      const res = await writeContractFunction({
        address: claimAddress,
        abi: claimContractABI,
        functionName: "claim",
        args: [amount, reciever, merkleProof, encodedData],
        account: walletAddress,
        networkId,
      });
      return res;
    } catch (error) {
      throw error;
    }
  };

  const hasClaimed = async (walletAddress) => {
    return await claimContractCall?.methods.hasClaimed(walletAddress).call();
  };

  const claimAmount = async (walletAddress) => {
    return await claimContractCall?.methods.claimAmount(walletAddress).call();
  };

  const checkAmount = async (walletAddress) => {
    return await claimContractCall?.methods.checkAmount(walletAddress).call();
  };

  return {
    claimAmount,
    claim,
    checkAmount,
    hasClaimed,
    rollbackTokens,
    toggleClaim,
    claimBalance,
    claimSettings,
    claimContract,
    addMoreTokens,
    modifyStartAndEndTime,
  };
};

export default useDropsContractMethods;
