import { useEffect } from "react";
import { erc721TokenABI } from "abis/nft.js";
import { erc20DaoABI } from "abis/erc20Dao.js";
import { erc721DaoABI } from "abis/erc721Dao.js";
import { factoryContractABI } from "abis/factoryContract.js";
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
          factoryContractABI,
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

    try {
      if (daoAddress) {
        const erc721TokenContractCall = new web3Call.eth.Contract(
          erc721TokenABI,
          daoAddress,
        );

        const erc20DaoContractCall = new web3Call.eth.Contract(
          erc20DaoABI,
          daoAddress,
        );

        const erc721DaoContractCall = new web3Call.eth.Contract(
          erc721DaoABI,
          daoAddress,
        );

        contractInstances = {
          ...contractInstances,
          erc20DaoContractCall,
          erc721DaoContractCall,
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
  }, [FACTORY_CONTRACT_ADDRESS, networkId, walletAddress]);

  useEffect(() => {
    if (networkId) {
      initializeStationContracts();
    }
  }, [daoAddress, networkId, walletAddress]);
};

export default useAppContract;
