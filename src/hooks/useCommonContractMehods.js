import Web3 from "web3";
import { erc20TokenABI } from "abis/usdcTokenContract.js";
import { convertToWeiGovernance } from "utils/globalFunctions";
import { useAccount, useNetwork } from "wagmi";
import { CHAIN_CONFIG } from "utils/constants";
import { readContractFunction, writeContractFunction } from "utils/helper";

const useCommonContractMethods = () => {
  const { address: walletAddress } = useAccount();
  const { chain } = useNetwork();
  const networkId = "0x" + chain?.id.toString(16);

  const web3Call = new Web3(CHAIN_CONFIG[networkId]?.appRpcUrl);

  const getTokenSymbol = async (contractAddress) => {
    const response = await readContractFunction({
      address: contractAddress,
      abi: erc20TokenABI,
      functionName: "symbol",
      args: [],
      networkId,
    });

    return response;
  };

  const getTokenName = async (contractAddress) => {
    const response = await readContractFunction({
      address: contractAddress,
      abi: erc20TokenABI,
      functionName: "name",
      args: [],
      networkId,
    });

    return response;
  };

  const getDecimals = async (contractAddress) => {
    const response = await readContractFunction({
      address: contractAddress,
      abi: erc20TokenABI,
      functionName: "decimals",
      args: [],
      networkId,
    });

    return response;
  };

  const getBalance = async (contractAddress, safeAddress = "") => {
    const response = await readContractFunction({
      address: contractAddress,
      abi: erc20TokenABI,
      functionName: "balanceOf",
      args: [safeAddress ? safeAddress : walletAddress],
      networkId,
    });

    return Number(response);
  };

  const approveDeposit = async (
    contractAddress,
    approvalContract,
    amount,
    usdcConvertDecimal,
  ) => {
    if (contractAddress) {
      const value = convertToWeiGovernance(
        amount,
        usdcConvertDecimal,
      )?.toString();

      const currentAllowance = await readContractFunction({
        address: contractAddress,
        abi: erc20TokenABI,
        functionName: "allowance",
        args: [walletAddress, approvalContract],
        networkId,
      });

      if (Number(currentAllowance) >= Number(value)) {
        return;
      } else {
        try {
          const res = await writeContractFunction({
            address: contractAddress,
            abi: erc20TokenABI,
            functionName: "approve",
            args: [approvalContract, value],
            account: walletAddress,
            networkId,
          });
          return res;
        } catch (error) {
          throw error;
        }
      }
    }
  };

  const encode = (address, amount) => {
    // Define the types and values for encoding
    const types = ["address", "uint256"];
    const values = [address, amount];

    // Encode the address and amount together
    const encodedData = web3Call.eth.abi.encodeParameters(types, values);

    return encodedData;
  };

  return {
    getDecimals,
    getBalance,
    getTokenSymbol,
    getTokenName,
    approveDeposit,
    encode,
  };
};

export default useCommonContractMethods;
