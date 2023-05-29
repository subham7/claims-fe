import { useConnectWallet } from "@web3-onboard/react";
import { useCallback, useEffect, useState } from "react";
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

  const [contractInstance, setContractInstance] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const initalizeContract = useCallback(() => {
    try {
      const smartContract = new SmartContract(
        abiFile,
        contractAddress,
        walletAddress,
        USDC_CONTRACT_ADDRESS,
        GNOSIS_TRANSACTION_URL,
        useMetamask,
      );
      setContractInstance(smartContract);
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

  const callContractFunction = useCallback(
    async (functionName, ...args) => {
      try {
        setIsLoading(true);
        if (!contractInstance) {
          throw new Error("SmartContract not initialized!");
        }

        const result = await contractInstance[functionName](...args);
        return result;
      } catch (error) {
        setError(error.message);
        return null;
      } finally {
        setIsLoading(false);
      }
    },
    [contractInstance],
  );

  useEffect(() => {
    initalizeContract();
  }, [initalizeContract]);

  return { isLoading, error, callContractFunction };
};

export default useSmartContract;
