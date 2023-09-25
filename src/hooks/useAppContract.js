import { useEffect } from "react";
import { erc20DaoABI } from "abis/erc20Dao.js";
import { erc721DaoABI } from "abis/erc721Dao.js";
import Web3 from "web3";
import { useDispatch, useSelector } from "react-redux";
import { setContractInstances } from "../redux/reducers/contractInstances";
import { useNetwork } from "wagmi";
import { CHAIN_CONFIG } from "utils/constants";

const useAppContract = (daoAddress) => {
  const { chain } = useNetwork();
  const networkId = "0x" + chain?.id.toString(16);
  const dispatch = useDispatch();

  let contractInstances = useSelector((state) => {
    return state.contractInstances.contractInstances;
  });

  const initializeStationContracts = async () => {
    const web3Call = new Web3(CHAIN_CONFIG[networkId]?.appRpcUrl);

    try {
      if (daoAddress) {
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
        };
      }

      dispatch(setContractInstances(contractInstances));
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    if (networkId) {
      initializeStationContracts();
    }
  }, [daoAddress, networkId]);
};

export default useAppContract;
