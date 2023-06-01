import { useConnectWallet } from "@web3-onboard/react";
import { useSelector } from "react-redux";
import Web3 from "web3";
import { RPC_URL } from "../api";
import { getIncreaseGasPrice } from "../utils/helper";
import ERC20TokenABI from "../abis/usdcTokenContract.json";
import ERC721TokenABI from "../abis/nft.json";
import { convertToWei } from "../utils/globalFunctions";

const useSmartContractMethods = () => {
  const [{ wallet }] = useConnectWallet();
  const walletAddress = wallet?.accounts[0]?.address;
  const web3Call = new Web3(RPC_URL);

  let web3Send;
  if (typeof window !== "undefined") {
    web3Send = new Web3(window.ethereum);
  }

  const contractInstances = useSelector((state) => {
    return state.contractInstances.contractInstances;
  });

  const {
    factoryContractCall,
    factoryContractSend,
    erc20TokenContractCall,
    erc20TokenContractSend,
    erc20DaoContractCall,
    erc20DaoContractSend,
    erc721TokenContractCall,
    erc721DaoContractCall,
    erc721DaoContractSend,
    claimContractCall,
    claimContractSend,
    claimFactoryContractCall,
    claimFactoryContractSend,
  } = contractInstances;

  const getDaoDetails = async (daoAddress) => {
    return await factoryContractCall?.methods?.getDAOdetails(daoAddress).call();
  };

  const getERC20DAOdetails = async () => {
    return await erc20DaoContractCall?.methods?.getERC20DAOdetails().call();
  };

  const getERC721DAOdetails = async () => {
    return await erc721DaoContractCall?.methods?.getERC721DAOdetails().call();
  };

  const getERC20Balance = async () => {
    return await erc20DaoContractCall?.methods?.balanceOf(walletAddress).call();
  };

  const getERC721Balance = async () => {
    return await erc721DaoContractCall?.methods
      ?.balanceOf(walletAddress)
      .call();
  };

  const getERC20TotalSupply = async () => {
    return await erc20DaoContractCall?.methods?.totalSupply().call();
  };

  const buyGovernanceTokenERC721DAO = async (
    userAddress,
    daoAddress,
    tokenUriOfNFT,
    numOfTokens,
    merkleProof,
  ) => {
    return await factoryContractSend?.methods
      .buyGovernanceTokenERC721DAO(
        userAddress,
        daoAddress,
        tokenUriOfNFT,
        numOfTokens,
        merkleProof,
      )
      .send({
        from: walletAddress,
        gasPrice: await getIncreaseGasPrice(),
      });
  };

  const buyGovernanceTokenERC20DAO = async (
    userAddress,
    daoAddress,
    numOfTokens,
    merkleProof,
  ) => {
    return await factoryContractSend?.methods
      ?.buyGovernanceTokenERC20DAO(
        userAddress,
        daoAddress,
        numOfTokens,
        merkleProof,
      )
      .send({
        from: walletAddress,
        gasPrice: await getIncreaseGasPrice(),
      });
  };

  const getNftOwnersCount = async () => {
    return await erc721DaoContractCall?.methods?._tokenIdTracker().call();
  };

  const updateOwnerFee = async (ownerFeePerDeposit, daoAddress) => {
    return await factoryContractSend.methods
      .updateOwnerFee(ownerFeePerDeposit, daoAddress)
      .send({
        from: walletAddress,
        gasPrice: await getIncreaseGasPrice(),
      });
  };

  const updateDepositTime = async (depositTime, daoAddress) => {
    return await factoryContractSend.methods
      .updateDepositTime(depositTime, daoAddress)
      .send({
        from: walletAddress,
        gasPrice: await getIncreaseGasPrice(),
      });
  };

  const setupTokenGating = async (
    tokenA,
    tokenB,
    operator,
    comparator,
    value,
    daoAddress,
  ) => {
    return await factoryContractSend?.methods
      ?.setupTokenGating(
        tokenA,
        tokenB,
        operator,
        comparator,
        value,
        daoAddress,
      )
      .send({
        from: walletAddress,
        gasPrice: await getIncreaseGasPrice(),
      });
  };

  const getTokenGatingDetails = async (daoAddress) => {
    return await factoryContractCall?.methods
      ?.getTokenGatingDetails(daoAddress)
      .call();
  };

  const getDecimals = async (contractAddress) => {
    const erc20TokenContractCall = new web3Call.eth.Contract(
      ERC20TokenABI.abi,
      contractAddress,
    );
    return await erc20TokenContractCall.methods.decimals().call();
  };

  const getERC721Symbol = async (contractAddress) => {
    const erc721TokenContractCall = new web3Call.eth.Contract(
      ERC721TokenABI.abi,
      contractAddress,
    );
    return await erc721TokenContractCall?.methods?.symbol().call();
  };

  const getBalance = async (contractAddress) => {
    const erc20TokenContractCall = new web3Call.eth.Contract(
      ERC20TokenABI.abi,
      contractAddress,
    );
    return await erc20TokenContractCall?.methods
      ?.balanceOf(walletAddress)
      .call();
  };

  const getTokenSymbol = async (contractAddress) => {
    const erc20TokenContractCall = new web3Call.eth.Contract(
      ERC20TokenABI.abi,
      contractAddress,
    );
    return await erc20TokenContractCall?.methods?.symbol().call();
  };

  const getTokenName = async (contractAddress) => {
    const erc20TokenContractCall = new web3Call.eth.Contract(
      ERC20TokenABI.abi,
      contractAddress,
    );
    return await erc20TokenContractCall?.methods?.name().call();
  };

  const approveDeposit = async (
    contractAddress,
    approvalContract,
    amount,
    usdcConvertDecimal,
  ) => {
    const erc20TokenContractSend = new web3Send.eth.Contract(
      ERC20TokenABI.abi,
      contractAddress,
    );
    const value = convertToWei(amount, usdcConvertDecimal).toString();
    return await erc20TokenContractSend?.methods
      ?.approve(approvalContract, value)
      .send({
        from: walletAddress,
        gasPrice: await getIncreaseGasPrice(),
      });
  };

  return {
    buyGovernanceTokenERC721DAO,
    buyGovernanceTokenERC20DAO,
    getDecimals,
    getDaoDetails,
    getERC20DAOdetails,
    getERC721DAOdetails,
    getERC20Balance,
    getERC721Balance,
    getERC721Symbol,
    getNftOwnersCount,
    getERC20TotalSupply,
    getBalance,
    getTokenSymbol,
    getTokenName,
    approveDeposit,
    updateOwnerFee,
    updateDepositTime,
    setupTokenGating,
    getTokenGatingDetails,
  };
};

export default useSmartContractMethods;
