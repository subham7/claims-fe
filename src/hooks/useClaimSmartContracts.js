import { useEffect } from "react";
import ClaimContractABI from "../abis/newArch/claimContract.json";
import ClaimFactoryABI from "../abis/newArch/claimFactory.json";
import Web3 from "web3";
import { useDispatch, useSelector } from "react-redux";
import { setContractInstances } from "../redux/reducers/contractInstances";
import { useAccount, useNetwork } from "wagmi";
import { CHAIN_CONFIG } from "utils/constants";

const useClaimSmartContracts = (claimAddress) => {
  const { address: walletAddress } = useAccount();
  const { chain } = useNetwork();
  const networkId = "0x" + chain?.id.toString(16);

  const dispatch = useDispatch();

  let contractInstances = useSelector((state) => {
    return state.contractInstances.contractInstances;
  });

  const claimFactoryAddress = CHAIN_CONFIG[networkId].claimFactoryAddress;

  const initializeClaimFactoryContracts = async () => {
    const web3Call = new Web3(CHAIN_CONFIG[networkId]?.appRpcUrl);
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
    const web3Call = new Web3(CHAIN_CONFIG[networkId]?.appRpcUrl);
    const web3Send = new Web3(window?.ethereum);

    try {
      const claimContractCall = new web3Call.eth.Contract(
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
    if (claimFactoryAddress && networkId) {
      initializeClaimFactoryContracts();
    }
  }, [networkId, claimFactoryAddress, walletAddress]);

  useEffect(() => {
    if (claimAddress && networkId) {
      initializeClaimContracts();
    }
  }, [claimAddress, networkId, walletAddress]);
};

export default useClaimSmartContracts;
