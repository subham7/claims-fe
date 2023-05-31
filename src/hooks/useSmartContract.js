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
  const {
    contractAddress,
    daoTokenAddress,
    claimsAirdropTokenAddress,
    tokenAAddress,
    tokenBAddress,
  } = props;

  const [{ wallet }] = useConnectWallet();
  const router = useRouter();
  const { jid: daoAddress, clubId, claimAddress } = router.query;

  const walletAddress = wallet?.accounts[0]?.address;

  const [error, setError] = useState(null);
  const [erc20TokenContractCall, setErc20TokenContractCall] = useState(null);
  const [erc20TokenContractSend, setErc20TokenContractSend] = useState(null);
  const [erc20DaoContract, setErc20DaoContract] = useState(null);
  const [erc20DaoContractSend, setErc20DaoContractSend] = useState(null);
  const [erc721DaoContractSend, setErc721DaoContractSend] = useState(null);
  const [factoryContractCall, setFactoryContractCall] = useState(null);
  const [factoryContractSend, setFactoryContractSend] = useState(null);
  const [erc721TokenContract, setErc721TokenContract] = useState(null);
  const [erc721DaoContract, setErc721DaoContract] = useState(null);
  const [claimContractCall, setClaimContractCall] = useState(null);
  const [claimContractSend, setClaimContractSend] = useState(null);
  const [daoTokenContract, setDaoTokenContract] = useState(null);
  const [erc20ClaimsContract, setErc20ClaimsContract] = useState(null);
  const [tokenAContract, setTokenAContract] = useState(null);
  const [tokenBContract, setTokenBContract] = useState(null);

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
      const factoryContractInstanceCall = new SmartContract(
        FactoryContractABI,
        FACTORY_CONTRACT_ADDRESS,
        walletAddress,
        USDC_CONTRACT_ADDRESS,
        GNOSIS_TRANSACTION_URL,
      );
      setFactoryContractCall(factoryContractInstanceCall);

      const factoryContractInstanceSend = new SmartContract(
        FactoryContractABI,
        FACTORY_CONTRACT_ADDRESS,
        walletAddress,
        USDC_CONTRACT_ADDRESS,
        GNOSIS_TRANSACTION_URL,
        true,
      );
      setFactoryContractSend(factoryContractInstanceSend);

      if (contractAddress) {
        const erc20TokenContractInstanceCall = new SmartContract(
          ERC20TokenABI,
          contractAddress,
          walletAddress,
          USDC_CONTRACT_ADDRESS,
          GNOSIS_TRANSACTION_URL,
        );
        setErc20TokenContractCall(erc20TokenContractInstanceCall);

        const erc20TokenContractInstanceSend = new SmartContract(
          ERC20TokenABI,
          contractAddress,
          walletAddress,
          USDC_CONTRACT_ADDRESS,
          GNOSIS_TRANSACTION_URL,
          true,
        );
        setErc20TokenContractSend(erc20TokenContractInstanceSend);
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

        const erc20DaoContractInstanceSend = new SmartContract(
          ERC20DaoABI,
          daoAddress ? daoAddress : clubId,
          walletAddress,
          USDC_CONTRACT_ADDRESS,
          GNOSIS_TRANSACTION_URL,
          true,
        );
        setErc20DaoContractSend(erc20DaoContractInstanceSend);

        const erc721DaoContractInstanceSend = new SmartContract(
          ERC721DaoABI,
          daoAddress ? daoAddress : clubId,
          walletAddress,
          USDC_CONTRACT_ADDRESS,
          GNOSIS_TRANSACTION_URL,
          true,
        );

        setErc721DaoContractSend(erc721DaoContractInstanceSend);
      }

      if (claimAddress) {
        const claimContractInstanceCall = new SmartContract(
          ClaimContractABI,
          claimAddress,
          walletAddress,
          undefined,
          undefined,
        );
        setClaimContractCall(claimContractInstanceCall);

        const claimContractInstanceSend = new SmartContract(
          ClaimContractABI,
          claimAddress,
          walletAddress,
          undefined,
          undefined,
        );
        setClaimContractSend(claimContractInstanceSend);

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

        if (tokenAAddress || tokenBAddress) {
          const tokenAContractInstance = new SmartContract(
            ERC20TokenABI,
            tokenAAddress,
            walletAddress,
            USDC_CONTRACT_ADDRESS,
            GNOSIS_TRANSACTION_URL,
          );
          setTokenAContract(tokenAContractInstance);

          const tokenBContractInstance = new SmartContract(
            ERC20TokenABI,
            tokenBAddress,
            walletAddress,
            USDC_CONTRACT_ADDRESS,
            GNOSIS_TRANSACTION_URL,
          );
          setTokenBContract(tokenBContractInstance);
        }
      }
    } catch (error) {
      setError(error.message);
    }
  };
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
    erc20TokenContractCall,
    erc20TokenContractSend,
    erc721TokenContract,
    factoryContractCall,
    factoryContractSend,
    erc20DaoContract,
    erc721DaoContract,
    claimContractSend,
    claimContractCall,
    daoTokenContract,
    erc20ClaimsContract,
    erc20DaoContractSend,
    erc721DaoContractSend,
    tokenAContract,
    tokenBContract,
  };
};

export default useSmartContract;
