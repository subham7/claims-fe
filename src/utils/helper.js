import Web3 from "web3";
import { RPC_URL } from "../api";
import Safe, { Web3Adapter } from "@safe-global/protocol-kit";

export const getSafeSdk = async (gnosisAddress, walletAddress) => {
  const web3 = await web3InstanceCustomRPC();
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
  const web3 = await web3InstanceCustomRPC();
  const gasPrice = await web3.eth.getGasPrice();
  const increasedGasPrice = +gasPrice + 30000000000;
  return increasedGasPrice;
};

export const web3InstanceEthereum = async () => {
  const web3 = new Web3(window.ethereum);
  return web3;
};

export const web3InstanceCustomRPC = async () => {
  const web3 = new Web3(RPC_URL);
  return web3;
};
