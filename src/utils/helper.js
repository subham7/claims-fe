import Web3 from "web3";
import { RPC_URL } from "../api";
import Safe, { Web3Adapter } from "@safe-global/protocol-kit";

export const getSafeSdk = async (gnosisAddress, walletAddress) => {
  const web3 = new Web3(RPC_URL);
  const ethAdapter = new Web3Adapter({
    web3,
    signerAddress: walletAddress,
  });
  const safeSdk = await Safe.create({
    ethAdapter: ethAdapter,
    safeAddress: gnosisAddress,
  });

  return safeSdk;
};

export const getIncreaseGasPrice = async () => {
  const web3 = new Web3(RPC_URL);
  const gasPrice = await web3.eth.getGasPrice();
  const increasedGasPrice = +gasPrice + 30000000000;
  return increasedGasPrice;
};
