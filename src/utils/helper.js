import Web3 from "web3";
import Safe, { Web3Adapter } from "@safe-global/protocol-kit";
import { getConnections, switchChain } from "@wagmi/core";
import { QUERY_PAGINATED_MEMBERS } from "api/graphql/stationQueries";
import { subgraphQuery } from "./subgraphs";
import {
  ALLOWED_NETWORKS_FOR_STATION,
  BLOCK_CONFIRMATIONS,
  BLOCK_TIMEOUT,
  CHAIN_CONFIG,
  contractNetworks,
  supportedChainsDrops,
} from "./constants";
import { getPublicClient } from "utils/viemConfig";
import { normalize } from "viem/ens";
import { uploadToAWS } from "api/club";
import { baseLinks } from "data/dashboard";
import SafeApiKit from "@safe-global/api-kit";
import { config } from "config";
import { getAddress } from "viem";
import { convertToWeiGovernance } from "./globalFunctions";

export const getSafeSdk = async (
  gnosisAddress,
  walletAddress,
  gnosisTransactionUrl,
  networkId,
) => {
  try {
    const web3 = networkId
      ? await web3InstanceCustomRPC(networkId)
      : await web3InstanceEthereum();

    const ethAdapter = new Web3Adapter({
      web3,
      signerAddress: walletAddress,
    });

    const safeSdk = gnosisAddress
      ? await Safe.create({
          ethAdapter,
          safeAddress: gnosisAddress,
          contractNetworks,
        })
      : null;

    const safeService = gnosisTransactionUrl
      ? new SafeApiKit({
          txServiceUrl: gnosisTransactionUrl,
          ethAdapter,
        })
      : null;

    return { safeSdk, safeService };
  } catch (e) {
    console.error(e);
    return {};
  }
};

export const web3InstanceEthereum = async () => {
  const connector = await getConnections(config)[0].connector.getProvider();

  const web3 = new Web3(connector);
  return web3;
};

export const web3InstanceCustomRPC = async (networkId = "0x89") => {
  const web3 = new Web3(CHAIN_CONFIG[networkId].appRpcUrl);
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

export const showWrongNetworkModal = (networkId, routeNetworkId, isClaims) => {
  networkId = networkId?.toLowerCase();
  routeNetworkId = routeNetworkId?.toLowerCase();
  if (
    routeNetworkId &&
    routeNetworkId !== networkId &&
    routeNetworkId !== "create" &&
    routeNetworkId !== "disburse"
  ) {
    if (isClaims && !supportedChainsDrops.includes(networkId)) {
      return true;
    }
    if (!isClaims && !ALLOWED_NETWORKS_FOR_STATION.includes(networkId)) {
      return true;
    }

    if (
      !isClaims &&
      ALLOWED_NETWORKS_FOR_STATION.includes(networkId) &&
      routeNetworkId !== networkId
    ) {
      return true;
    }
  } else {
    return false;
  }
};

export const getAllEntities = async (SUBGRAPH_URL, daoAddress, entity) => {
  try {
    let allEntities = [];
    let skip = 0;
    let continueFetching = true;

    while (continueFetching) {
      let query = QUERY_PAGINATED_MEMBERS(daoAddress, 100, skip);
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

export const getUserTokenData = async (
  tokenData,
  networkId,
  allowNative = false,
) => {
  const filteredData = !allowNative
    ? tokenData.filter(
        (token) =>
          token.contract_address !== CHAIN_CONFIG[networkId].nativeToken,
      )
    : tokenData;

  return filteredData?.map((token) => {
    return {
      balance: token.balance || token.TokenQuantity,
      address:
        token.contract_address || token.contractAddress || token.TokenAddress,
      decimals: token.contract_decimals || token.decimals || token.TokenDivisor,
      symbol: token.contract_ticker_symbol || token.symbol || token.TokenSymbol,
    };
  });
};

export const requestEthereumChain = async (method, params) => {
  const connector = await getConnections(config)[0].connector.getProvider();

  return await window.ethereum.request({ method, params });
};

export const writeContractFunction = async ({
  address,
  abi,
  functionName,
  args,
  account,
  networkId,
  value,
  walletClient,
}) => {
  try {
    const publicClient = getPublicClient(networkId);

    const { request } = await publicClient.simulateContract({
      address,
      abi,
      functionName,
      args,
      account,
      value,
    });

    const txHash = await walletClient?.data?.writeContract(request);
    const txReciept = await publicClient.waitForTransactionReceipt({
      hash: txHash,
      confirmations: BLOCK_CONFIRMATIONS,
      timeout: BLOCK_TIMEOUT,
    });

    return txReciept;
  } catch (error) {
    throw error;
  }
};

export const readContractFunction = async ({
  address,
  abi,
  functionName,
  args,
  account,
  networkId,
}) => {
  try {
    const publicClient = getPublicClient(networkId);

    const data = await publicClient.readContract({
      address,
      abi,
      functionName,
      args,
      account,
    });

    return data;
  } catch (error) {
    console.error(error);
  }
};

export const csvToObjectForMintGT = (csvString) => {
  const lines = csvString.trim().split("\n");
  const addresses = [];
  const amounts = [];

  for (const line of lines) {
    const [address, amount] = line.trim().split(",");
    addresses.push(address);
    amounts.push(convertToWeiGovernance(amount.trim(), 18)?.toString());
  }

  return { addresses, amounts };
};

export const shortAddress = (address, length = 6) => {
  if (address) {
    return (
      address?.substring(0, length) +
      "....." +
      address?.substring(address.length - 4)
    );
  }
};

export const uploadFileToAWS = async (file) => {
  return new Promise(async (resolve, reject) => {
    const reader = new FileReader();
    reader.addEventListener("loadend", async () => {
      const path = file?.name.split("/");
      const fileName = path[path.length - 1];
      const data = await uploadToAWS(fileName, reader);
      resolve(data?.saveFileResponse?.Location);
    });

    reader.readAsArrayBuffer(file);
  });
};

export const isValidAddress = (address) => {
  return /^0x[a-fA-F0-9]{40}$/.test(address);
};

export const generateRandomString = (length) => {
  const chars =
    "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  let result = "";
  for (let i = 0; i < length; i++) {
    const randomIndex = Math.floor(Math.random() * chars.length);
    result += chars[randomIndex];
  }
  return result;
};

export const addLineBreaks = (inputString, breakAfter = 40) => {
  let result = "";
  for (let i = 0; i < inputString?.length; i += breakAfter) {
    result += inputString?.substr(i, breakAfter) + "\n";
  }
  return result;
};

export const convertToFullNumber = (expNotation) => {
  if (typeof expNotation === "string") {
    let [base, exponent] = expNotation?.split("e");
    let [whole, fractional] = base?.split(".");

    if (exponent?.includes("+")) {
      let positiveExponent = parseInt(exponent?.replace("+", ""), 10);
      if (fractional) {
        let adjustedWhole =
          whole +
          fractional?.substring(
            0,
            Math.min(positiveExponent, fractional?.length),
          );
        let remainingExponent = positiveExponent - fractional?.length;
        return adjustedWhole + "0".repeat(Math.max(0, remainingExponent));
      } else {
        return whole + "0".repeat(positiveExponent);
      }
    } else if (exponent?.includes("-")) {
      let negativeExponent = parseInt(exponent?.replace("-", ""), 10);
      if (negativeExponent >= whole?.length) {
        return (
          "0." +
          "0".repeat(negativeExponent - whole?.length) +
          whole +
          (fractional || "")
        );
      } else {
        let decimalPlace = whole?.length - negativeExponent;
        return (
          whole?.substring(0, decimalPlace) +
          "." +
          whole?.substring(decimalPlace) +
          (fractional || "")
        );
      }
    }
    return expNotation;
  } else {
    expNotation;
  }
};

export const processAmount = (amount) => {
  if (typeof amount === "string" && amount?.includes("e")) {
    return convertToFullNumber(amount);
  }
  return amount;
};

export const handleSignMessage = async (data, signMessage) => {
  try {
    const signature = await signMessage({
      message: data,
    });
    return { data, signature };
  } catch (err) {
    throw new Error("User denied message signature.");
  }
};
export const getDaysDifferenceDescription = (targetDateStr) => {
  const targetDate = new Date(targetDateStr);
  const currentDate = new Date();
  currentDate.setHours(0, 0, 0, 0);
  const differenceInMilliseconds = targetDate - currentDate;
  const differenceInDays = Math.round(
    differenceInMilliseconds / (1000 * 60 * 60 * 24),
  );
  return differenceInDays;
};

export const formatCash = (n) => {
  if (n < 1e3) return n;
  if (n >= 1e3 && n < 1e6) return +(n / 1e3).toFixed(1) + "K";
  if (n >= 1e6 && n < 1e9) return +(n / 1e6).toFixed(1) + "M";
  if (n >= 1e9 && n < 1e12) return +(n / 1e9).toFixed(1) + "B";
  if (n >= 1e12) return +(n / 1e12).toFixed(1) + "T";
};

export const getLinks = (daoAddress, networkId) => {
  return baseLinks(networkId)
    .filter((link) => !link?.hideNetworks?.includes(networkId))
    ?.map((link, index) => ({
      ...link,
      icon: `/assets/icons/${link.icon}.svg`,
      hoveredLink: `/assets/icons/${link.icon}_hovered.svg`,
      route: `/${link.routeHeader}/${daoAddress}/${networkId}`,
      id: String(index + 1),
    }));
};

export const isNative = (depositTokenAddress, networkId) => {
  try {
    if (depositTokenAddress === "0x0000000000000000000000000000000000001010") {
      return true;
    } else {
      return (
        depositTokenAddress?.toLowerCase() ===
        CHAIN_CONFIG[networkId]?.nativeToken?.toLowerCase()
      );
    }
  } catch (error) {
    console.log(error);
    return false;
  }
};

export const switchNetworkHandler = async (networkId, setLoading) => {
  setLoading(true);
  await switchChain(config, {
    chainId: CHAIN_CONFIG[networkId].chainId,
  });
  setLoading(false);
};

export function customToFixedAutoPrecision(num) {
  try {
    let decimalPlaces = 2;
    let tempNum = num;
    while (tempNum < 1 && tempNum > 0) {
      tempNum *= 10;
      decimalPlaces++;
    }
    return num?.toFixed(decimalPlaces);
  } catch (err) {
    console.error(err);
    return "0.00";
  }
}

export const withHttps = (url) =>
  !!url && !/^https?:\/\//i.test(url) ? `https://${url}` : url;

export const formatNumbers = (number) => {
  return number?.toLocaleString("en-US");
};

export const containsHtml = (str) => /<\/?[a-z][\s\S]*>/i.test(str);

export const isValidReciptentAddress = async (value) => {
  try {
    const val = getAddress(value);
    return val;
  } catch (error) {
    return false;
  }
};

export const ensToWalletAddress = async (ens) => {
  if (!ens?.includes(".eth")) {
    return ens;
  }
  try {
    const publicClient = getPublicClient("0x1");
    const ensAddress = await publicClient.getEnsAddress({
      name: normalize(ens),
    });
    return ensAddress;
  } catch (error) {
    console.error(error);
  }
};

export const validateWalletAddress = async (value) => {
  if (!value) return false;
  try {
    const resolvedAddress = await ensToWalletAddress(value.trim());
    if (!resolvedAddress) return false;
    const verifyAddress = await isValidReciptentAddress(resolvedAddress);
    if (!verifyAddress) return false;
    return true;
  } catch (error) {
    return false;
  }
};
