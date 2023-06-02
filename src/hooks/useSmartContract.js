import { useEffect } from "react";
import ERC721TokenABI from "../abis/nft.json";
import ERC20DaoABI from "../abis/newArch/erc20Dao.json";
import ERC721DaoABI from "../abis/newArch/erc721Dao.json";
import FactoryContractABI from "../abis/newArch/factoryContract.json";
import ClaimContractABI from "../abis/singleClaimContract.json";
import ClaimFactoryABI from "../abis/claimContractFactory.json";
import { useRouter } from "next/router";
import Web3 from "web3";
import { RPC_URL } from "../api";
import { useDispatch, useSelector } from "react-redux";
import { setContractInstances } from "../redux/reducers/contractInstances";

const useSmartContract = () => {
  const router = useRouter();
  const { jid: daoAddress, clubId, claimAddress } = router.query;
  const dispatch = useDispatch();

  const FACTORY_CONTRACT_ADDRESS = useSelector(
    (state) => state.gnosis.factoryContractAddress,
  );

  let contractInstances = useSelector((state) => {
    return state.contractInstances.contractInstances;
  });

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
      if (daoAddress || clubId) {
        const erc721TokenContractCall = new web3Call.eth.Contract(
          ERC721TokenABI.abi,
          daoAddress || clubId,
        );

        const erc20DaoContractCall = new web3Call.eth.Contract(
          ERC20DaoABI.abi,
          daoAddress || clubId,
        );

        const erc721DaoContractCall = new web3Call.eth.Contract(
          ERC721DaoABI.abi,
          daoAddress || clubId,
        );

        const erc20DaoContractSend = new web3Send.eth.Contract(
          ERC20DaoABI.abi,
          daoAddress || clubId,
        );

        const erc721DaoContractSend = new web3Send.eth.Contract(
          ERC721DaoABI.abi,
          daoAddress || clubId,
        );

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

  const initializeClaimContracts = async () => {
    const web3Call = new Web3(RPC_URL);
    const web3Send = new Web3(window?.ethereum);

    try {
      if (claimAddress) {
        const claimFactoryContractCall = new web3Call.eth.Contract(
          ClaimFactoryABI.abi,
          claimAddress,
        );

        const claimFactoryContractSend = new web3Send.eth.Contract(
          ClaimFactoryABI.abi,
          claimAddress,
        );

        const claimContractCall = new web3Call.eth.Contract(
          ClaimContractABI.abi,
          claimAddress,
        );

        const claimContractSend = new web3Send.eth.Contract(
          ClaimContractABI.abi,
          claimAddress,
        );

        contractInstances = {
          ...contractInstances,
          claimFactoryContractCall,
          claimFactoryContractSend,
          claimContractCall,
          claimContractSend,
        };
      }

      dispatch(setContractInstances(contractInstances));
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    initializeFactoryContracts();
  }, [FACTORY_CONTRACT_ADDRESS]);

  useEffect(() => {
    initializeStationContracts();
  }, [daoAddress, clubId]);

  useEffect(() => {
    initializeClaimContracts();
  }, [claimAddress]);
};

export default useSmartContract;
