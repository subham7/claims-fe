import { useSelector } from "react-redux";
import { getIncreaseGasPrice } from "utils/helper";
import { publicClient, walletClient } from "utils/viemConfig";
import { useAccount, useNetwork } from "wagmi";
import ClaimContractABI from "abis/claimContract.json";
import ClaimFactoryABI from "abis/claimFactory.json";
import { BLOCK_CONFIRMATIONS, CHAIN_CONFIG } from "utils/constants";

const useDropsContractMethods = () => {
  const { address: walletAddress } = useAccount();
  const { chain } = useNetwork();
  const networkId = "0x" + chain?.id.toString(16);

  const contractInstances = useSelector((state) => {
    return state.contractInstances.contractInstances;
  });

  const claimFactoryAddress = CHAIN_CONFIG[networkId].claimFactoryAddress;

  const { claimContractCall } = contractInstances;

  const addMoreTokens = async (claimAddress, noOfTokens) => {
    try {
      const { request } = await publicClient.simulateContract({
        address: claimAddress,
        abi: ClaimContractABI.abi,
        functionName: "depositTokens",
        args: [noOfTokens],
        account: walletAddress,
        gasPrice: await getIncreaseGasPrice(),
      });

      const txHash = await walletClient.writeContract(request);
      await publicClient.waitForTransactionReceipt({
        hash: txHash,
        confirmations: BLOCK_CONFIRMATIONS,
      });

      return true;
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
      const { request } = await publicClient.simulateContract({
        address: claimFactoryAddress,
        abi: ClaimFactoryABI.abi,
        functionName: "deployClaimContract",
        args: [claimSettings, totalNoOfWallets, blockNumber, whitelistNetwork],
        account: walletAddress,
        gasPrice: await getIncreaseGasPrice(),
      });

      const txHash = await walletClient.writeContract(request);
      await publicClient.waitForTransactionReceipt({
        hash: txHash,
        confirmations: BLOCK_CONFIRMATIONS,
      });

      return true;
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
      const { request } = await publicClient.simulateContract({
        address: claimAddress,
        abi: ClaimContractABI.abi,
        functionName: "toggleClaim",
        account: walletAddress,
        gasPrice: await getIncreaseGasPrice(),
      });

      const txHash = await walletClient.writeContract(request);
      await publicClient.waitForTransactionReceipt({
        hash: txHash,
        confirmations: BLOCK_CONFIRMATIONS,
      });

      return true;
    } catch (error) {
      throw error;
    }
  };

  const rollbackTokens = async (claimAddress, amount, rollbackAddress) => {
    try {
      const { request } = await publicClient.simulateContract({
        address: claimAddress,
        abi: ClaimContractABI.abi,
        functionName: "rollbackTokens",
        args: [amount, rollbackAddress],
        account: walletAddress,
        gasPrice: await getIncreaseGasPrice(),
      });

      const txHash = await walletClient.writeContract(request);
      await publicClient.waitForTransactionReceipt({
        hash: txHash,
        confirmations: BLOCK_CONFIRMATIONS,
      });

      return true;
    } catch (error) {
      throw error;
    }
  };

  const modifyStartAndEndTime = async (claimAddress, startTime, endTime) => {
    try {
      const { request } = await publicClient.simulateContract({
        address: claimAddress,
        abi: ClaimContractABI.abi,
        functionName: "changeStartAndEndTime",
        args: [startTime, endTime],
        account: walletAddress,
        gasPrice: await getIncreaseGasPrice(),
      });

      const txHash = await walletClient.writeContract(request);
      await publicClient.waitForTransactionReceipt({
        hash: txHash,
        confirmations: BLOCK_CONFIRMATIONS,
      });

      return true;
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
      const { request } = await publicClient.simulateContract({
        address: claimAddress,
        abi: ClaimContractABI.abi,
        functionName: "claim",
        args: [amount, reciever, merkleProof, encodedData],
        account: walletAddress,
        gasPrice: await getIncreaseGasPrice(),
      });

      const txHash = await walletClient.writeContract(request);
      await publicClient.waitForTransactionReceipt({
        hash: txHash,
        confirmations: BLOCK_CONFIRMATIONS,
      });

      return true;
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
