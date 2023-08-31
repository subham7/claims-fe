import {
  QUERY_ALL_DROPS_OF_CREATOR,
  QUERY_ALL_DROPS_TRANSACTIONS,
  QUERY_DROP_DETAILS,
  QUERY_WALLET_WISE_TRANSACTIONS,
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
      QUERY_WALLET_WISE_TRANSACTIONS(claimAddress),
    );
    return data ?? null;
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
    return data ?? null;
  } catch (error) {
    throw error;
  }
};

export const queryDropsListFromSubgraph = async (walletAddress, networkId) => {
  try {
    const data = await subgraphQuery(
      CHAIN_CONFIG[networkId]?.claimsSubgraphUrl,
      QUERY_ALL_DROPS_OF_CREATOR(walletAddress),
    );
    return data ?? null;
  } catch (error) {
    throw error;
  }
};

export const queryClaimDetailsFromSubgraph = async (
  claimAddress,
  networkId,
) => {
  try {
    const data = await subgraphQuery(
      CHAIN_CONFIG[networkId]?.claimsSubgraphUrl,
      QUERY_DROP_DETAILS(claimAddress),
    );
    return data ?? null;
  } catch (error) {
    throw error;
  }
};
