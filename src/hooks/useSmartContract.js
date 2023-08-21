import { useEffect } from "react";
import ERC721TokenABI from "../abis/nft.json";
import ERC20DaoABI from "../abis/newArch/erc20Dao.json";
import ERC721DaoABI from "../abis/newArch/erc721Dao.json";
import FactoryContractABI from "../abis/newArch/factoryContract.json";
import ClaimContractABI from "../abis/newArch/claimContract.json";
import ClaimFactoryABI from "../abis/newArch/claimFactory.json";
import { useRouter } from "next/router";
import Web3 from "web3";
import {
  CLAIM_FACTORY_ADDRESS_GOERLI,
  CLAIM_FACTORY_ADDRESS_POLYGON,
  getRpcUrl,
  RPC_URL,
} from "../api";
import { useDispatch, useSelector } from "react-redux";
import { setContractInstances } from "../redux/reducers/contractInstances";
import { useNetwork } from "wagmi";

const useSmartContract = ({ daoAddress }) => {
  const router = useRouter();
  const { claimAddress, claimInsight } = router.query;
  const { chain } = useNetwork();
  const networkId = Web3.utils.numberToHex(chain?.id);
  const dispatch = useDispatch();

  const FACTORY_CONTRACT_ADDRESS = useSelector(
    (state) => state.gnosis.factoryContractAddress,
  );

  let contractInstances = useSelector((state) => {
    return state.contractInstances.contractInstances;
  });

  const claimFactoryAddress =
    networkId === "0x5"
      ? CLAIM_FACTORY_ADDRESS_GOERLI
      : networkId === "0x89"
      ? CLAIM_FACTORY_ADDRESS_POLYGON
      : "";

  const initializeFactoryContracts = async () => {
    const web3Call = new Web3(RPC_URL);
    const web3Send = new Web3(window?.ethereum);

    try {
      if (FACTORY_CONTRACT_ADDRESS) {
        const factoryContractCall = new web3Call.eth.Contract(
          FactoryContractABI.abi,
          FACTORY_CONTRACT_ADDRESS,
        );

        const factoryContractSend = web3Send
          ? new web3Send.eth.Contract(
              FactoryContractABI.abi,
              FACTORY_CONTRACT_ADDRESS,
            )
          : {};

        contractInstances = {
          ...contractInstances,
          factoryContractCall,
          factoryContractSend,
        };
      }

      dispatch(setContractInstances(contractInstances));
    } catch (error) {
      console.log(error);
    }
  };

  const initializeStationContracts = async () => {
    const web3Call = new Web3(RPC_URL);
    const web3Send = new Web3(window?.ethereum);

    try {
      if (daoAddress) {
        const erc721TokenContractCall = new web3Call.eth.Contract(
          ERC721TokenABI.abi,
          daoAddress,
        );

        const erc20DaoContractCall = new web3Call.eth.Contract(
          ERC20DaoABI.abi,
          daoAddress,
        );

        const erc721DaoContractCall = new web3Call.eth.Contract(
          ERC721DaoABI.abi,
          daoAddress,
        );

        const erc20DaoContractSend = web3Send
          ? new web3Send.eth.Contract(ERC20DaoABI.abi, daoAddress)
          : {};

        const erc721DaoContractSend = web3Send
          ? new web3Send.eth.Contract(ERC721DaoABI.abi, daoAddress)
          : {};

        contractInstances = {
          ...contractInstances,
          erc20DaoContractCall,
          erc20DaoContractSend,
          erc721DaoContractCall,
          erc721DaoContractSend,
          erc721TokenContractCall,
        };
      }

      dispatch(setContractInstances(contractInstances));
    } catch (error) {
      console.log(error);
    }
  };

  const initializeClaimFactoryContracts = async () => {
    const web3Call = new Web3(RPC_URL);
    const web3Send = new Web3(window?.ethereum);

    try {
      if (claimFactoryAddress) {
        const claimFactoryContractCall = new web3Call.eth.Contract(
          ClaimFactoryABI.abi,
          claimFactoryAddress,
        );

        const claimFactoryContractSend = web3Send
          ? new web3Send.eth.Contract(ClaimFactoryABI.abi, claimFactoryAddress)
          : {};

        contractInstances = {
          ...contractInstances,
          claimFactoryContractCall,
          claimFactoryContractSend,
        };

        dispatch(setContractInstances(contractInstances));
      }
    } catch (error) {
      console.log(error);
    }
  };

  const initializeClaimContracts = () => {
    const web3Send = new Web3(window?.ethereum);
    try {
      const claimContractCall = new web3Send.eth.Contract(
        ClaimContractABI.abi,
        claimAddress ? claimAddress : claimInsight,
      );
      const claimContractSend = web3Send
        ? new web3Send.eth.Contract(
            ClaimContractABI.abi,
            claimAddress ? claimAddress : claimInsight,
          )
        : {};
      contractInstances = {
        ...contractInstances,
        claimContractSend,
        claimContractCall,
      };
      dispatch(setContractInstances(contractInstances));
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    if (networkId) {
      getRpcUrl(networkId);
      initializeFactoryContracts();
    }
  }, [FACTORY_CONTRACT_ADDRESS, networkId]);

  useEffect(() => {
    if (networkId) {
      getRpcUrl(networkId);
      initializeStationContracts();
    }
  }, [daoAddress, networkId]);

  useEffect(() => {
    if (networkId) {
      getRpcUrl(networkId);
      initializeClaimFactoryContracts();
    }
  }, [networkId, claimFactoryAddress]);

  useEffect(() => {
    if (claimAddress || claimInsight) {
      initializeClaimContracts();
    }
  }, [claimAddress, claimInsight]);
};

export default useSmartContract;
