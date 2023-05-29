import { useConnectWallet } from "@web3-onboard/react";
import { useCallback, useEffect, useRef, useState } from "react";
import { SmartContract } from "../api/contract";

const useSmartContract = (
  abiFile,
  contractAddress,
  USDC_CONTRACT_ADDRESS,
  GNOSIS_TRANSACTION_URL,
  useMetamask,
) => {
  const [{ wallet }] = useConnectWallet();
  const walletAddress = wallet?.accounts[0]?.address;

  const contractInstanceRef = useRef(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const initializeContract = useCallback(() => {
    try {
      if (!contractInstanceRef.current) {
        contractInstanceRef.current = new SmartContract(
          abiFile,
          contractAddress,
          walletAddress,
          USDC_CONTRACT_ADDRESS,
          GNOSIS_TRANSACTION_URL,
          useMetamask,
        );
      }
    } catch (error) {
      setError(error.message);
    }
  }, [
    abiFile,
    contractAddress,
    GNOSIS_TRANSACTION_URL,
    USDC_CONTRACT_ADDRESS,
    useMetamask,
    walletAddress,
  ]);

  const callContractFunction = useCallback(async (functionName, ...args) => {
    try {
      setIsLoading(true);
      if (!contractInstanceRef.current) {
        throw new Error("SmartContract not initialized!");
      }

      const result = await contractInstanceRef.current[functionName](...args);
      return result;
    } catch (error) {
      setError(error.message);
      return null;
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    initializeContract();
  }, [initializeContract]);

  return { isLoading, error, callContractFunction };
};

export default useSmartContract;
