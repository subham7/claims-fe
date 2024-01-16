import {
  QUERY_WALLET_DROPS,
  QUERY_ALL_DROPS_TRANSACTIONS,
  QUERY_DROP_DETAILS,
  QUERY_WALLET_CLAIM_TRANSACTIONS,
  QUERY_LATEST_TEN_DROPS_TRANSACTIONS,
} from "api/graphql/dropQueries";
import { CHAIN_CONFIG } from "./constants";
import { subgraphQuery } from "./subgraphs";

export const queryWalletWiseTransactionsFromSubgraph = async (
  claimAddress,
  networkId,
) => {
  try {
    const data = await subgraphQuery(
      CHAIN_CONFIG[networkId]?.claimsSubgraphUrl,
      QUERY_WALLET_CLAIM_TRANSACTIONS(claimAddress),
    );
    return data ?? {};
  } catch (error) {
    throw error;
  }
};

export const queryAllDropsTransactionsFromSubgraph = async (
  claimAddress,
  networkId,
) => {
  try {
    const data = await subgraphQuery(
      CHAIN_CONFIG[networkId]?.claimsSubgraphUrl,
      QUERY_ALL_DROPS_TRANSACTIONS(claimAddress),
    );
    return data ?? {};
  } catch (error) {
    throw error;
  }
};

export const queryLatestTenDropsTransactionsFromSubgraph = async (
  claimAddress,
  networkId,
) => {
  try {
    const data = await subgraphQuery(
      CHAIN_CONFIG[networkId]?.claimsSubgraphUrl,
      QUERY_LATEST_TEN_DROPS_TRANSACTIONS(claimAddress),
    );
    return data ?? {};
  } catch (error) {
    throw error;
  }
};

export const queryDropsListFromSubgraph = async (walletAddress, networkId) => {
  try {
    const data = await subgraphQuery(
      CHAIN_CONFIG[networkId]?.claimsSubgraphUrl,
      QUERY_WALLET_DROPS(walletAddress),
    );
    return data ?? {};
  } catch (error) {
    throw error;
  }
};

export const queryDropDetailsFromSubgraph = async (claimAddress, networkId) => {
  try {
    const data = await subgraphQuery(
      CHAIN_CONFIG[networkId]?.claimsSubgraphUrl,
      QUERY_DROP_DETAILS(claimAddress),
    );
    return data ?? {};
  } catch (error) {
    throw error;
  }
};
