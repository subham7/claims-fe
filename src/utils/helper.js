import Web3 from "web3";
import Safe, { Web3Adapter } from "@safe-global/protocol-kit";
import WrongNetworkModal from "../components/modals/WrongNetworkModal";
import { QUERY_ALL_MEMBERS } from "../api/graphql/queries";
import { subgraphQuery } from "./subgraphs";
import { CHAIN_CONFIG, NETWORK_IDs, NETWORK_RPC_URL } from "./constants";

export const getSafeSdk = async (gnosisAddress, walletAddress, networkId) => {
  const web3 = await web3InstanceCustomRPC(networkId);
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

export const getIncreaseGasPrice = async (networkId = "0x89") => {
  const web3 = await web3InstanceCustomRPC(networkId);

  if (!sessionStorage.getItem("gasPrice" + networkId)) {
    const gasPrice = await web3.eth.getGasPrice();

    let increasedGasPrice;

    if (networkId === "0x89") {
      increasedGasPrice = +gasPrice + 30000000000;
    } else {
      increasedGasPrice = +gasPrice + 1000;
    }

    sessionStorage.setItem("gasPrice" + networkId, increasedGasPrice);
    return increasedGasPrice;
  } else {
    return Number(sessionStorage.getItem("gasPrice" + networkId));
  }
};

export const web3InstanceEthereum = async () => {
  const web3 = new Web3(window.ethereum);
  return web3;
};

export const web3InstanceCustomRPC = async (networkId) => {
  const web3 = new Web3(NETWORK_RPC_URL[networkId]);
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

export function returnRemainingTime(epochTime) {
  const currentTime = Math.floor(Date.now() / 1000); // Current time in seconds
  const timeDiff = currentTime - epochTime;
  const days = Math.abs(Math.floor(timeDiff / (24 * 60 * 60)));
  const hours = Math.abs(Math.floor((timeDiff % (24 * 60 * 60)) / (60 * 60)));
  const minutes = Math.abs(Math.floor((timeDiff % (60 * 60)) / 60));

  return days > 0
    ? `${days} days`
    : (days === 0) & (hours > 0)
    ? `${hours} hours`
    : days === 0 && hours === 0
    ? `${minutes} mins`
    : 0;
}

export const showWrongNetworkModal = (
  walletAddress,
  networkId,
  isClaims = false,
  network,
) => {
  if (isClaims) {
    if (network && network !== networkId) {
      return <WrongNetworkModal chainId={parseInt(network, 16)} />;
    }

    return walletAddress && !NETWORK_IDs.includes(networkId) ? (
      <WrongNetworkModal />
    ) : null;
  }

  return walletAddress && networkId !== "0x89" ? (
    <WrongNetworkModal isClaims={isClaims} />
  ) : null;
};

export const getAllEntities = async (
  SUBGRAPH_URL,
  daoAddress,
  entity,
  startDate,
  endDate,
) => {
  try {
    let allEntities = [];
    let skip = 0;
    let continueFetching = true;

    while (continueFetching) {
      let query = QUERY_ALL_MEMBERS(daoAddress, 100, skip, startDate, endDate);
      let result = await subgraphQuery(SUBGRAPH_URL, query);

      allEntities = [...allEntities, ...result[entity]];

      if (result[entity].length < 100) {
        continueFetching = false;
      } else {
        skip += 100;
      }
    }

    return allEntities;
  } catch (error) {
    console.log(error);
  }
};

export const extractPartFromUrl = (url) => {
  try {
    const parsedUrl = new URL(url);
    const pathname = parsedUrl.pathname;
    const parts = pathname.split("/");
    return parts[parts.length - 1];
  } catch (error) {
    console.error("Invalid URL:", error);
    return null;
  }
};

export const extractNftAdressAndId = (url) => {
  try {
    const parsedUrl = new URL(url);
    const pathname = parsedUrl.pathname;
    const parts = pathname.split("/");

    return {
      nftAddress: parts[parts.length - 2],
      tokenId: parts[parts.length - 1],
    };
  } catch (error) {
    console.error("Invalid URL:", error);
    return null;
  }
};

export const getUserTokenData = async (tokenData, networkId) => {
  const filteredData = tokenData.filter(
    (token) => token.contract_address !== CHAIN_CONFIG[networkId].native_token,
  );

  return filteredData.map((token) => {
    return {
      balance: token.balance,
      address: token.contract_address,
      decimals: token.contract_decimals,
      symbol: token.contract_ticker_symbol,
    };
  });
};

export const requestEthereumChain = async (method, params) => {
  return await window.ethereum.request({ method, params });
};
