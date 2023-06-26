import Web3 from "web3";
import { POLYGON_MAINNET_RPC_URL, RPC_URL } from "../api";
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
  if (!sessionStorage.getItem("gasPrice")) {
    const gasPrice = await web3.eth.getGasPrice();
    const increasedGasPrice = +gasPrice + 30000000000;
    return increasedGasPrice;
  } else {
    return Number(sessionStorage.getItem("gasPrice"));
  }
};

export const web3InstanceEthereum = async () => {
  const web3 = new Web3(window.ethereum);
  return web3;
};

export const web3InstanceCustomRPC = async () => {
  const web3 = new Web3(RPC_URL ? RPC_URL : POLYGON_MAINNET_RPC_URL);
  return web3;
};

export const convertEpochTimeInCounterFormat = (epochTime) => {
  const millisecondsPerMinute = 60 * 1000;
  const millisecondsPerHour = 60 * millisecondsPerMinute;
  const millisecondsPerDay = 24 * millisecondsPerHour;

  const days = Math.floor(epochTime / millisecondsPerDay);
  epochTime %= millisecondsPerDay;

  const hours = Math.floor(epochTime / millisecondsPerHour);
  epochTime %= millisecondsPerHour;

  const minutes = Math.floor(epochTime / millisecondsPerMinute);

  return `${days}D: ${hours < 10 ? "0" : ""}${hours}H: ${
    minutes < 10 ? "0" : ""
  }${minutes}M`;
};

export function formatEpochTime(epochTime) {
  const currentTime = Math.floor(Date.now() / 1000); // Current time in seconds
  const timeDiff = epochTime - currentTime;
  const days = Math.floor(timeDiff / (24 * 60 * 60));
  const hours = Math.floor((timeDiff % (24 * 60 * 60)) / (60 * 60));
  const minutes = Math.floor((timeDiff % (60 * 60)) / 60);
  return `${days}D: ${hours}H: ${minutes}M`;
}
