import { useEffect } from "react";
import ClaimContractABI from "../abis/newArch/claimContract.json";
import ClaimFactoryABI from "../abis/newArch/claimFactory.json";
import Web3 from "web3";
import { getRpcUrl, RPC_URL } from "../api";
import { useDispatch, useSelector } from "react-redux";
import { setContractInstances } from "../redux/reducers/contractInstances";
import { useNetwork } from "wagmi";
import { CLAIM_FACTORY_ADDRESS } from "utils/constants";

const useClaimSmartContracts = (claimAddress) => {
  const { chain } = useNetwork();
  const networkId = Web3.utils.numberToHex(chain?.id);
  const dispatch = useDispatch();

  let contractInstances = useSelector((state) => {
    return state.contractInstances.contractInstances;
  });

  const claimFactoryAddress = CLAIM_FACTORY_ADDRESS[networkId];

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
        claimAddress,
      );
      const claimContractSend = web3Send
        ? new web3Send.eth.Contract(ClaimContractABI.abi, claimAddress)
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
