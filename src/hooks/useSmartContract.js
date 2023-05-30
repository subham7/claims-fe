import { useConnectWallet } from "@web3-onboard/react";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { SmartContract } from "../api/contract";
import ERC20TokenABI from "../abis/usdcTokenContract.json";
import ERC721TokenABI from "../abis/nft.json";
import ERC20DaoABI from "../abis/newArch/erc20Dao.json";
import ERC721DaoABI from "../abis/newArch/erc721Dao.json";
import FactoryContractABI from "../abis/newArch/factoryContract.json";
import ClaimContractABI from "../abis/singleClaimContract.json";
import { useRouter } from "next/router";

const useSmartContract = (props = {}) => {
  const { contractAddress, daoTokenAddress, claimsAirdropTokenAddress } = props;

  const [{ wallet }] = useConnectWallet();
  const router = useRouter();
  const { pid: daoAddress, clubId, claimAddress } = router.query;

  const walletAddress = wallet?.accounts[0]?.address;

  // const contractInstanceRef = useRef(null);

  // const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [erc20TokenContract_CALL, setErc20TokenContract_CALL] = useState(null);
  const [erc20TokenContract_SEND, setErc20TokenContract_SEND] = useState(null);
  const [erc20DaoContract, setErc20DaoContract] = useState(null);
  const [factoryContract_CALL, setFactoryContract_CALL] = useState(null);
  const [factoryContract_SEND, setFactoryContract_SEND] = useState(null);
  const [erc721TokenContract, setErc721TokenContract] = useState(null);
  const [erc721DaoContract, setErc721DaoContract] = useState(null);
  const [claimContract_CALL, setClaimContract_CALL] = useState(null);
  const [claimContract_SEND, setClaimContract_SEND] = useState(null);
  const [daoTokenContract, setDaoTokenContract] = useState(null);
  const [erc20ClaimsContract, setErc20ClaimsContract] = useState(null);

  const GNOSIS_TRANSACTION_URL = useSelector((state) => {
    return state.gnosis.transactionUrl;
  });

  const USDC_CONTRACT_ADDRESS = useSelector((state) => {
    return state.gnosis.usdcContractAddress;
  });

  const FACTORY_CONTRACT_ADDRESS = useSelector((state) => {
    return state.gnosis.factoryContractAddress;
  });

  const initializeContract = () => {
    try {
      const factoryContractInstance_CALL = new SmartContract(
        FactoryContractABI,
        FACTORY_CONTRACT_ADDRESS,
        walletAddress,
        USDC_CONTRACT_ADDRESS,
        GNOSIS_TRANSACTION_URL,
      );
      setFactoryContract_CALL(factoryContractInstance_CALL);

      const factoryContractInstance_SEND = new SmartContract(
        FactoryContractABI,
        FACTORY_CONTRACT_ADDRESS,
        walletAddress,
        USDC_CONTRACT_ADDRESS,
        GNOSIS_TRANSACTION_URL,
        true,
      );
      setFactoryContract_SEND(factoryContractInstance_SEND);

      if (contractAddress) {
        const erc20TokenContractInstance_CALL = new SmartContract(
          ERC20TokenABI,
          contractAddress,
          walletAddress,
          USDC_CONTRACT_ADDRESS,
          GNOSIS_TRANSACTION_URL,
        );
        setErc20TokenContract_CALL(erc20TokenContractInstance_CALL);

        const erc20TokenContractInstance_SEND = new SmartContract(
          ERC20TokenABI,
          contractAddress,
          walletAddress,
          USDC_CONTRACT_ADDRESS,
          GNOSIS_TRANSACTION_URL,
          true,
        );
        setErc20TokenContract_SEND(erc20TokenContractInstance_SEND);
      }

      if (daoAddress ? daoAddress : clubId) {
        const erc721TokenContractInstance = new SmartContract(
          ERC721TokenABI,
          daoAddress ? daoAddress : clubId,
          walletAddress,
          USDC_CONTRACT_ADDRESS,
          GNOSIS_TRANSACTION_URL,
        );
        setErc721TokenContract(erc721TokenContractInstance);

        const erc20DaoContractInstance = new SmartContract(
          ERC20DaoABI,
          daoAddress ? daoAddress : clubId,
          walletAddress,
          USDC_CONTRACT_ADDRESS,
          GNOSIS_TRANSACTION_URL,
        );
        setErc20DaoContract(erc20DaoContractInstance);

        const erc721DaoContractInstance = new SmartContract(
          ERC721DaoABI,
          daoAddress ? daoAddress : clubId,
          walletAddress,
          USDC_CONTRACT_ADDRESS,
          GNOSIS_TRANSACTION_URL,
        );
        setErc721DaoContract(erc721DaoContractInstance);
      }

      if (claimAddress) {
        const claimContractInstance_CALL = new SmartContract(
          ClaimContractABI,
          claimAddress,
          walletAddress,
          undefined,
          undefined,
        );
        setClaimContract_CALL(claimContractInstance_CALL);

        const claimContractInstance_SEND = new SmartContract(
          ClaimContractABI,
          claimAddress,
          walletAddress,
          undefined,
          undefined,
        );
        setClaimContract_SEND(claimContractInstance_SEND);

        if (daoTokenAddress) {
          const daoTokenContractInstance = new SmartContract(
            ERC20TokenABI,
            daoTokenAddress,
            walletAddress,
            undefined,
            undefined,
          );
          setDaoTokenContract(daoTokenContractInstance);
        }

        if (claimsAirdropTokenAddress) {
          const erc20ClaimsContractInstance = new SmartContract(
            ERC20TokenABI,
            claimsAirdropTokenAddress,
            walletAddress,
            undefined,
            undefined,
          );
          setErc20ClaimsContract(erc20ClaimsContractInstance);
        }
      }
    } catch (error) {
      setError(error.message);
    }
  };

  // const callContractFunction = useCallback(async (functionName, ...args) => {
  //   try {
  //     setIsLoading(true);
  //     if (!contractInstanceRef.current) {
  //       throw new Error("SmartContract not initialized!");
  //     }

  //     const result = await contractInstanceRef.current[functionName](...args);
  //     return result;
  //   } catch (error) {
  //     setError(error.message);
  //     return null;
  //   } finally {
  //     setIsLoading(false);
  //   }
  // }, []);

  useEffect(() => {
    if (
      walletAddress &&
      USDC_CONTRACT_ADDRESS &&
      GNOSIS_TRANSACTION_URL &&
      FACTORY_CONTRACT_ADDRESS
    )
      initializeContract();
  }, [
    FACTORY_CONTRACT_ADDRESS,
    walletAddress,
    USDC_CONTRACT_ADDRESS,
    GNOSIS_TRANSACTION_URL,
    contractAddress,
  ]);

  return {
    error,
    erc20TokenContract_CALL,
    erc20TokenContract_SEND,
    erc721TokenContract,
    factoryContract_CALL,
    factoryContract_SEND,
    erc20DaoContract,
    erc721DaoContract,
    claimContract_SEND,
    claimContract_CALL,
    daoTokenContract,
    erc20ClaimsContract,
  };
};

export default useSmartContract;
