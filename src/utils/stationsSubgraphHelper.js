import { CHAIN_CONFIG } from "./constants";
import { subgraphQuery } from "./subgraphs";
import axios from "axios";
import {
  IS_STATION_MEMBER,
  QUERY_ALL_MEMBERS,
  QUERY_LATEST_MEMBERS,
  QUERY_PAGINATED_MEMBERS,
  QUERY_STATION_DETAILS,
} from "api/graphql/stationQueries";
import { MAIN_API_URL } from "api";

export const queryStationDataFromSubgraph = async (daoAddress, networkId) => {
  try {
    const data = await subgraphQuery(
      CHAIN_CONFIG[networkId]?.stationSubgraphUrl,
      QUERY_STATION_DETAILS(daoAddress),
    );

    return data ?? {};
  } catch (error) {
    throw error;
  }
};

export const queryStationListFromSubgraph = async (walletAddress) => {
  try {
    const data = await axios.get(
      `${MAIN_API_URL}user/${walletAddress}/clubs-multichain`,
    );

    return data ?? {};
  } catch (error) {
    throw error;
  }
};

export const queryAllMembersFromSubgraph = async (daoAddress, networkId) => {
  try {
    const data = await subgraphQuery(
      CHAIN_CONFIG[networkId]?.stationSubgraphUrl,
      QUERY_ALL_MEMBERS(daoAddress),
    );

    return data ?? {};
  } catch (error) {
    throw error;
  }
};

export const queryPaginatedMembersFromSubgraph = async (
  daoAddress,
  first,
  skip,
  networkId,
) => {
  try {
    const data = await subgraphQuery(
      CHAIN_CONFIG[networkId]?.stationSubgraphUrl,
      QUERY_PAGINATED_MEMBERS(daoAddress, first, skip),
    );
    return data ?? {};
  } catch (error) {
    throw error;
  }
};

export const queryLatestMembersFromSubgraph = async (daoAddress, networkId) => {
  try {
    const data = await subgraphQuery(
      CHAIN_CONFIG[networkId]?.stationSubgraphUrl,
      QUERY_LATEST_MEMBERS(daoAddress),
    );
    return data ?? {};
  } catch (error) {
    throw error;
  }
};

export const isMember = async (address, daoAddress, networkId) => {
  try {
    const data = await subgraphQuery(
      CHAIN_CONFIG[networkId]?.stationSubgraphUrl,
      IS_STATION_MEMBER(address, daoAddress),
    );

    return data ?? [];
  } catch (error) {
    throw error;
  }
};
