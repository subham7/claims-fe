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

function convertEpochTime(epochTime) {
  const secondsPerMinute = 60;
  const secondsPerHour = 60 * secondsPerMinute;
  const secondsPerDay = 24 * secondsPerHour;

  const days = Math.floor(epochTime / secondsPerDay);
  const hours = Math.floor((epochTime % secondsPerDay) / secondsPerHour);
  const minutes = Math.floor((epochTime % secondsPerHour) / secondsPerMinute);

  return `${days}D: ${hours < 10 ? "0" : ""}${hours}H: ${
    minutes < 10 ? "0" : ""
  }${minutes}M`;
}

console.log(convertEpochTime(1688032070));
