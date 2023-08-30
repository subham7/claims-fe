import { useEffect } from "react";
import { claimContractABI } from "abis/claimContract.js";
import { claimFactoryABI } from "abis/claimFactory.js";
import Web3 from "web3";
import { useDispatch, useSelector } from "react-redux";
import { setContractInstances } from "../redux/reducers/contractInstances";
import { useNetwork } from "wagmi";
import { CHAIN_CONFIG } from "utils/constants";

const useClaimSmartContracts = (claimAddress) => {
  const { chain } = useNetwork();
  const networkId = "0x" + chain?.id.toString(16);

  const dispatch = useDispatch();

  let contractInstances = useSelector((state) => {
    return state.contractInstances.contractInstances;
  });

  const claimFactoryAddress = CHAIN_CONFIG[networkId].claimFactoryAddress;

  const initializeClaimFactoryContracts = async () => {
    const web3Call = new Web3(CHAIN_CONFIG[networkId]?.appRpcUrl);

    try {
      if (claimFactoryAddress) {
        const claimFactoryContractCall = new web3Call.eth.Contract(
          claimFactoryABI,
          claimFactoryAddress,
        );

        contractInstances = {
          ...contractInstances,
          claimFactoryContractCall,
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
        claimContractABI,
        claimAddress,
      );

      contractInstances = {
        ...contractInstances,
        claimContractCall,
      };
      dispatch(setContractInstances(contractInstances));
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    if (networkId) {
      initializeClaimFactoryContracts();
    }
  }, [networkId, claimFactoryAddress]);

  useEffect(() => {
    if (claimAddress) {
      initializeClaimContracts();
    }
  }, [claimAddress]);
};

export default useClaimSmartContracts;
