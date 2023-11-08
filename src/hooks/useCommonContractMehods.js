import { erc20TokenABI } from "abis/usdcTokenContract.js";
import { convertToWeiGovernance } from "utils/globalFunctions";
import { useAccount, useNetwork } from "wagmi";
import { readContractFunction, writeContractFunction } from "utils/helper";
import { encodePacked } from "viem";

const useCommonContractMethods = () => {
  const { address: walletAddress } = useAccount();
  const { chain } = useNetwork();
  const networkId = "0x" + chain?.id.toString(16);

  const getTokenSymbol = async (contractAddress) => {
    if (contractAddress) {
      const response = await readContractFunction({
        address: contractAddress,
        abi: erc20TokenABI,
        functionName: "symbol",
        args: [],
        networkId,
      });

      return response;
    } else {
      return "";
    }
  };

  const getTokenName = async (contractAddress) => {
    if (contractAddress) {
      const response = await readContractFunction({
        address: contractAddress,
        abi: erc20TokenABI,
        functionName: "name",
        args: [],
        networkId,
      });

      return response;
    } else {
      return "";
    }
  };

  const getDecimals = async (contractAddress) => {
    if (contractAddress) {
      const response = await readContractFunction({
        address: contractAddress,
        abi: erc20TokenABI,
        functionName: "decimals",
        args: [],
        networkId,
      });

      return response;
    } else {
      return "";
    }
  };

  const getBalance = async (contractAddress, safeAddress = "") => {
    if (contractAddress) {
      const response = await readContractFunction({
        address: contractAddress,
        abi: erc20TokenABI,
        functionName: "balanceOf",
        args: [safeAddress ? safeAddress : walletAddress],
        networkId,
      });

      return Number(response);
    } else {
      return 0;
    }
  };

  const approveDeposit = async (
    contractAddress,
    approvalContract,
    amount,
    usdcConvertDecimal,
  ) => {
    if (contractAddress) {
      const value =
        amount > 0
          ? convertToWeiGovernance(amount, usdcConvertDecimal)?.toString()
          : 1000000;

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
    const types = ["address", "uint256"];
    const values = [address, amount];
    const encodedData = encodePacked(types, values);
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
