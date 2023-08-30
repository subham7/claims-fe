import { useEffect } from "react";
import ERC721TokenABI from "../abis/nft.json";
import ERC20DaoABI from "../abis/erc20Dao.json";
import ERC721DaoABI from "../abis/erc721Dao.json";
import FactoryContractABI from "../abis/factoryContract.json";
import Web3 from "web3";
import { useDispatch, useSelector } from "react-redux";
import { setContractInstances } from "../redux/reducers/contractInstances";
import { useNetwork } from "wagmi";
import { CHAIN_CONFIG } from "utils/constants";

const useAppContract = (daoAddress) => {
  const { chain } = useNetwork();
  const networkId = "0x" + chain?.id.toString(16);
  const dispatch = useDispatch();

  const FACTORY_CONTRACT_ADDRESS = useSelector(
    (state) => state.gnosis.factoryContractAddress,
  );

  let contractInstances = useSelector((state) => {
    return state.contractInstances.contractInstances;
  });

  const initializeFactoryContracts = async () => {
    const web3Call = new Web3(CHAIN_CONFIG[networkId]?.appRpcUrl);

    try {
      if (FACTORY_CONTRACT_ADDRESS) {
        const factoryContractCall = new web3Call.eth.Contract(
          FactoryContractABI.abi,
          FACTORY_CONTRACT_ADDRESS,
        );

        contractInstances = {
          ...contractInstances,
          factoryContractCall,
        };
      }

      dispatch(setContractInstances(contractInstances));
    } catch (error) {
      console.log(error);
    }
  };

  const initializeStationContracts = async () => {
    const web3Call = new Web3(CHAIN_CONFIG[networkId]?.appRpcUrl);
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

  useEffect(() => {
    if (networkId) {
      initializeFactoryContracts();
    }
  }, [FACTORY_CONTRACT_ADDRESS, networkId]);

  useEffect(() => {
    if (networkId) {
      initializeStationContracts();
    }
  }, [daoAddress, networkId]);
};

export default useAppContract;
