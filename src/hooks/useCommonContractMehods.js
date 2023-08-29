import Web3 from "web3";
import { getIncreaseGasPrice } from "../utils/helper";
import ERC20TokenABI from "../abis/usdcTokenContract.json";
import ERC721TokenABI from "../abis/nft.json";
import { convertToWeiGovernance } from "../utils/globalFunctions";
import { useAccount, useNetwork } from "wagmi";
import { CHAIN_CONFIG } from "utils/constants";

const useCommonContractMethods = () => {
  const { address: walletAddress } = useAccount();
  const { chain } = useNetwork();
  const networkId = "0x" + chain?.id.toString(16);

  const web3Call = new Web3(CHAIN_CONFIG[networkId]?.appRpcUrl);

  let web3Send;
  if (typeof window !== "undefined") {
    web3Send = new Web3(window.ethereum);
  }

  const getDecimals = async (contractAddress) => {
    if (contractAddress) {
      const erc20TokenContractCall = new web3Call.eth.Contract(
        ERC20TokenABI.abi,
        Web3.utils.toChecksumAddress(contractAddress),
      );
      return await erc20TokenContractCall.methods.decimals().call();
    }
  };

  const getERC721Symbol = async (contractAddress) => {
    if (contractAddress) {
      const erc721TokenContractCall = new web3Call.eth.Contract(
        ERC721TokenABI.abi,
        contractAddress,
      );
      return await erc721TokenContractCall?.methods?.symbol().call();
    }
  };

  const getBalance = async (contractAddress) => {
    if (contractAddress) {
      const erc20TokenContractCall = new web3Call.eth.Contract(
        ERC20TokenABI.abi,
        contractAddress,
      );
      return await erc20TokenContractCall?.methods
        ?.balanceOf(walletAddress)
        .call();
    }
  };

  const getTokenSymbol = async (contractAddress) => {
    if (contractAddress) {
      const erc20TokenContractCall = new web3Call.eth.Contract(
        ERC20TokenABI.abi,
        contractAddress,
      );
      return await erc20TokenContractCall?.methods?.symbol().call();
    }
  };

  const getTokenName = async (contractAddress) => {
    if (contractAddress) {
      const erc20TokenContractCall = new web3Call.eth.Contract(
        ERC20TokenABI.abi,
        contractAddress,
      );
      return await erc20TokenContractCall?.methods?.name().call();
    }
  };

  const approveDeposit = async (
    contractAddress,
    approvalContract,
    amount,
    usdcConvertDecimal,
  ) => {
    if (contractAddress) {
      const erc20TokenContractSend = new web3Send.eth.Contract(
        ERC20TokenABI.abi,
        contractAddress,
      );
      const value = convertToWeiGovernance(
        amount,
        usdcConvertDecimal,
      )?.toString();

      const currentAllowance = await erc20TokenContractSend.methods
        .allowance(walletAddress, approvalContract)
        .call();

      if (Number(currentAllowance) >= Number(value)) {
        return;
      } else {
        return await erc20TokenContractSend?.methods
          ?.approve(approvalContract, value)
          .send({
            from: walletAddress,
            gasPrice: await getIncreaseGasPrice(networkId),
          });
      }
    }
  };

  const encode = (address, amount) => {
    // Define the types and values for encoding
    const types = ["address", "uint256"];
    const values = [address, amount];

    // Encode the address and amount together
    const encodedData = web3Call.eth.abi.encodeParameters(types, values);

    return encodedData;
  };

  return {
    getDecimals,
    getERC721Symbol,
    getBalance,
    getTokenSymbol,
    getTokenName,
    approveDeposit,
    encode,
  };
};

export default useCommonContractMethods;
