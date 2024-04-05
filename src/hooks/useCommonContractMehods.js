import { erc20TokenABI } from "abis/usdcTokenContract.js";
import { convertToWeiGovernance } from "utils/globalFunctions";
import { useAccount, useNetwork, useWalletClient } from "wagmi";
import {
  isNative,
  readContractFunction,
  writeContractFunction,
} from "utils/helper";
import { CHAIN_CONFIG, ZERO_ADDRESS } from "utils/constants";
import { getPublicClient } from "utils/viemConfig";
import Web3 from "web3";

const useCommonContractMethods = (params) => {
  const walletClient = useWalletClient();
  const { address: walletAddress } = useAccount();
  const { chain } = useNetwork();
  const networkId = params?.routeNetworkId ?? "0x" + chain?.id.toString(16);

  const getTokenSymbol = async (contractAddress) => {
    try {
      if (contractAddress) {
        const symbol = localStorage.getItem(
          `stationx-${contractAddress}-${networkId}-symbol`,
        );
        if (symbol !== "undefined" && symbol) {
          return symbol;
        } else if (isNative(contractAddress, networkId)) {
          localStorage.setItem(
            `stationx-${contractAddress}-${networkId}-name`,
            CHAIN_CONFIG[networkId].nativeCurrency.symbol,
          );
          return CHAIN_CONFIG[networkId].nativeCurrency.symbol;
        } else if (contractAddress === ZERO_ADDRESS) {
          return "";
        } else if (contractAddress) {
          const response = await readContractFunction({
            address: contractAddress,
            abi: erc20TokenABI,
            functionName: "symbol",
            args: [],
            networkId,
          });
          localStorage.setItem(
            `stationx-${contractAddress}-${networkId}-name`,
            response,
          );
          return response;
        } else {
          return "";
        }
      }
      return "";
    } catch (error) {
      console.error(error);
      return "";
    }
  };

  const getTokenName = async (contractAddress) => {
    try {
      const name = localStorage.getItem(
        `stationx-${contractAddress}-${networkId}--name`,
      );
      if (name !== "undefined") {
        return name;
      } else if (isNative(contractAddress, networkId)) {
        localStorage.setItem(
          `stationx-${contractAddress}-${networkId}-name`,
          CHAIN_CONFIG[networkId].nativeCurrency.name,
        );
        return CHAIN_CONFIG[networkId].nativeCurrency.name;
      } else if (contractAddress) {
        const response = await readContractFunction({
          address: contractAddress,
          abi: erc20TokenABI,
          functionName: "name",
          args: [],
          networkId,
        });
        localStorage.setItem(
          `stationx-${contractAddress}-${networkId}-name`,
          response,
        );
        return response;
      } else {
        return "";
      }
    } catch (error) {
      console.error(error);
      return "";
    }
  };

  const getDecimals = async (contractAddress) => {
    try {
      const decimals = localStorage.getItem(
        `stationx-${contractAddress}-${networkId}-decimals`,
      );
      if (!isNaN(Number(decimals))) {
        return Number(decimals);
      } else if (isNative(contractAddress, networkId)) {
        localStorage.setItem(
          `stationx-${contractAddress}-${networkId}-decimals`,
          18,
        );
        return 18;
      } else if (contractAddress === ZERO_ADDRESS) {
        return 1;
      } else if (contractAddress) {
        const response = await readContractFunction({
          address: contractAddress,
          abi: erc20TokenABI,
          functionName: "decimals",
          args: [],
          networkId,
        });
        localStorage.setItem(
          `stationx-${contractAddress}-${networkId}-decimals`,
          response,
        );
        return response;
      } else {
        return 1;
      }
    } catch (error) {
      console.error(error);
      return 1;
    }
  };

  const getBalance = async (contractAddress, safeAddress = "") => {
    try {
      if (contractAddress) {
        if (isNative(contractAddress, networkId)) {
          const response = await getPublicClient(networkId).getBalance({
            address: safeAddress ? safeAddress : walletAddress,
          });
          return Number(response);
        } else {
          const response = await readContractFunction({
            address: contractAddress,
            abi: erc20TokenABI,
            functionName: "balanceOf",
            args: [safeAddress ? safeAddress : walletAddress],
            networkId,
          });

          return Number(response);
        }
      } else {
        return 0;
      }
    } catch (error) {
      console.error(error);
      return 0;
    }
  };

  const checkCurrentAllowance = async (contractAddress, approvalContract) => {
    try {
      if (contractAddress) {
        const currentAllowance = await readContractFunction({
          address: contractAddress,
          abi: erc20TokenABI,
          functionName: "allowance",
          args: [walletAddress, approvalContract],
          networkId,
        });

        return currentAllowance;
      }
    } catch (error) {
      console.error(error);
      throw error;
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
            walletClient,
          });
          return res;
        } catch (error) {
          console.error(error);
          throw error;
        }
      }
    }
  };

  const encode = (address, amount) => {
    try {
      const web3Call = new Web3(CHAIN_CONFIG[networkId]?.appRpcUrl);

      const types = ["address", "uint256"];
      const values = [address, amount];
      // Encode the address and amount together
      const encodedData = web3Call.eth.abi.encodeParameters(types, values);
      return encodedData;
    } catch (error) {
      console.error(error);
    }
  };

  return {
    getDecimals,
    getBalance,
    getTokenSymbol,
    getTokenName,
    approveDeposit,
    encode,
    checkCurrentAllowance,
  };
};

export default useCommonContractMethods;
