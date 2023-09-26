import { CHAIN_CONFIG } from "./constants";
import { subgraphQuery } from "./subgraphs";
import {
  QUERY_ALL_MEMBERS,
  QUERY_LATEST_MEMBERS,
  QUERY_PAGINATED_MEMBERS,
  QUERY_STATIONS_LIST,
  QUERY_STATION_DETAILS,
} from "api/graphql/stationQueries";

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

export const queryStationListFromSubgraph = async (
  walletAddress,
  networkId,
) => {
  try {
    const data = await subgraphQuery(
      CHAIN_CONFIG[networkId]?.stationSubgraphUrl,
      QUERY_STATIONS_LIST(walletAddress),
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
